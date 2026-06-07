const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../model/product");
const Order = require("../model/order");

const GROK_ENDPOINT = "https://api.x.ai/v1/chat/completions";

const buildSystemPrompt = (role) => {
  const audience = role === "seller" ? "seller" : "buyer";

  return [
    "You are a production ecommerce assistant for a marketplace.",
    `You are helping a ${audience}.`,
    "Be concise, practical, and accurate.",
    "You can answer product questions, suggest related products, explain order status, and guide support ticket creation.",
    "If the user asks for policy, dispute, or complaint guidance, explain the relevant resolution workflow in simple steps.",
    "If you do not know something, say so and suggest the next best action.",
  ].join(" ");
};

const localFallbackReply = async ({ message, role, shopId, orderId }) => {
  const lowerMessage = String(message || "").toLowerCase();

  if (orderId) {
    const order = await Order.findById(orderId);
    if (order) {
      return `Order ${order._id} is currently ${order.status}. ${order.deliveredAt ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}.` : ""}`;
    }
  }

  const productQuery = {};
  if (shopId) {
    productQuery.shopId = shopId;
  }

  const products = await Product.find(productQuery).limit(8);
  const matching = products.filter((product) => {
    const text = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    return lowerMessage.split(/\s+/).some((word) => word.length > 2 && text.includes(word));
  });

  if (lowerMessage.includes("stock") || lowerMessage.includes("low stock")) {
    return "Low-stock items should be reordered when inventory reaches the threshold in Seller Analytics. Check the low-stock panel to see which products need replenishment.";
  }

  if (lowerMessage.includes("dispute") || lowerMessage.includes("complaint") || lowerMessage.includes("refund")) {
    return "Create a complaint from the support workflow, include the order ID, and move the ticket to under review. Admins can resolve or reject it from the complaints dashboard.";
  }

  if (matching.length > 0) {
    return `I found ${matching.length} potentially relevant product(s): ${matching.map((product) => product.name).join(", ")}. Ask me for price, stock, or comparison details.`;
  }

  if (role === "seller") {
    return "I can help you review products, order status, revenue trends, stock alerts, refund handling, and support tickets. Ask a specific question to continue.";
  }

  return "I can help you find products, explain order status, suggest alternatives, or guide you through support and complaint steps. Ask a specific question to continue.";
};

router.post(
  "/grok-chat",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { message, role = "buyer", shopId, orderId, conversationSummary = "" } = req.body;

      if (!message) {
        return next(new ErrorHandler("Message is required", 400));
      }

      const fallbackMessage = await localFallbackReply({ message, role, shopId, orderId });
      const apiKey = process.env.GROK_API_KEY;

      if (!apiKey) {
        return res.status(200).json({ success: true, source: "fallback", reply: fallbackMessage });
      }

      const products = await Product.find(shopId ? { shopId } : {}).sort({ createdAt: -1 }).limit(10);
      const order = orderId ? await Order.findById(orderId) : null;

      const productContext = products
        .map((product) => `${product.name} | category: ${product.category} | price: ${product.discountPrice} | stock: ${product.stock} | rating: ${product.ratings || 0}`)
        .join("\n");

      const orderContext = order
        ? `Order status: ${order.status}. Total: ${order.totalPrice}. Delivered at: ${order.deliveredAt || "not delivered"}.`
        : "No order context provided.";

      const response = await fetch(GROK_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.GROK_MODEL || "grok-2-latest",
          messages: [
            { role: "system", content: buildSystemPrompt(role) },
            {
              role: "user",
              content: [
                `Conversation summary: ${conversationSummary || "none"}`,
                `User message: ${message}`,
                `Role: ${role}`,
                orderContext,
                `Relevant products:\n${productContext || "No matching products found."}`,
              ].join("\n\n"),
            },
          ],
          temperature: 0.3,
          max_tokens: 400,
        }),
      });

      if (!response.ok) {
        return res.status(200).json({ success: true, source: "fallback", reply: fallbackMessage });
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content || fallbackMessage;

      return res.status(200).json({ success: true, source: "grok", reply });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/seller-analytics/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { shopId } = req.params;
      const products = await Product.find({ shopId }).sort({ createdAt: -1 });
      const orders = await Order.find({ $or: [{ shopId }, { "cart.shopId": shopId }] }).sort({ createdAt: -1 });

      const deliveredOrders = orders.filter((order) => order.status === "Delivered");
      const totalRevenue = deliveredOrders.reduce((acc, order) => acc + Number(order.totalPrice || 0), 0);
      const netRevenue = deliveredOrders.reduce((acc, order) => acc + Number(order.totalPrice || 0) * 0.9, 0);
      const totalItemsSold = deliveredOrders.reduce((acc, order) => acc + order.cart.reduce((sum, item) => sum + Number(item.qty || 0), 0), 0);
      const lowStockProducts = products.filter((product) => Number(product.stock || 0) <= 5);
      const totalReviews = products.reduce((acc, product) => acc + (product.reviews?.length || 0), 0);
      const averageRating = products.length
        ? products.reduce((acc, product) => acc + Number(product.ratings || 0), 0) / products.length
        : 0;

      const monthlyRevenueMap = new Map();
      deliveredOrders.forEach((order) => {
        const date = new Date(order.deliveredAt || order.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        monthlyRevenueMap.set(key, (monthlyRevenueMap.get(key) || 0) + Number(order.totalPrice || 0));
      });

      const revenueTrend = Array.from(monthlyRevenueMap.entries())
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([month, revenue]) => ({ month, revenue }));

      const topProducts = [...products]
        .sort((left, right) => Number(right.sold_out || 0) - Number(left.sold_out || 0))
        .slice(0, 5)
        .map((product) => ({
          id: product._id,
          name: product.name,
          soldOut: product.sold_out || 0,
          stock: product.stock || 0,
          rating: product.ratings || 0,
        }));

      const conversionRate = orders.length ? (deliveredOrders.length / orders.length) * 100 : 0;

      return res.status(200).json({
        success: true,
        analytics: {
          totals: {
            products: products.length,
            orders: orders.length,
            deliveredOrders: deliveredOrders.length,
            revenue: totalRevenue,
            netRevenue,
            itemsSold: totalItemsSold,
            lowStock: lowStockProducts.length,
            reviews: totalReviews,
          },
          metrics: {
            conversionRate,
            averageRating,
          },
          topProducts,
          lowStockProducts: lowStockProducts.map((product) => ({
            id: product._id,
            name: product.name,
            stock: product.stock,
            category: product.category,
          })),
          revenueTrend,
        },
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;