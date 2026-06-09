import React, { useMemo, useState } from "react";
import axios from "axios";
import { FiMessageSquare, FiSend, FiX } from "react-icons/fi";
import { server } from "../../server";
import { useSelector } from "react-redux";

const quickPrompts = [
  "Show me low-stock products",
  "What is the order status for my latest order?",
  "Suggest products similar to this one",
  "How do I raise a dispute or complaint?",
];

const AIChatbot = () => {
  const { user } = useSelector((state) => state.user);
  const { seller } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Ask me about products, orders, low-stock alerts, support tickets, or complaints.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(seller?._id ? "seller" : "buyer");

  const context = useMemo(() => ({
    role: mode,
    shopId: seller?._id,
    orderId: user?.latestOrderId,
  }), [mode, seller?._id, user?.latestOrderId]);

  const sendMessage = async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || loading) {
      return;
    }

    const nextMessages = [...messages, { role: "user", content: messageText }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${server}/assistant/grok-chat`, {
        message: messageText,
        ...context,
        conversationSummary: nextMessages
          .slice(-6)
          .map((entry) => `${entry.role}: ${entry.content}`)
          .join("\n"),
      });

      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "I could not reach the assistant right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl transition-transform hover:scale-105"
        aria-label="Open assistant"
      >
        {open ? <FiX size={22} /> : <FiMessageSquare size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[60] w-[92vw] max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-slate-900 px-5 py-4 text-white">
            <div>
              <h3 className="font-semibold">Marketplace Assistant</h3>
              <p className="text-xs text-slate-300">Buyer and seller support powered by Grok</p>
            </div>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value)}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white outline-none"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto max-w-[85%] bg-slate-900 text-white"
                    : "mr-auto max-w-[85%] bg-slate-100 text-slate-800"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading && <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500">Thinking...</div>}
          </div>

          <div className="space-y-3 border-t border-slate-200 p-4">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Ask about orders, products, or support..."
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
              <button
                onClick={() => sendMessage()}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 text-white"
                aria-label="Send message"
              >
                <FiSend size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;