const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated, isAdmin, isSeller } = require("../middleware/auth");
const Complaint = require("../model/complaint");

router.post(
  "/create",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { title, description, category, severity, orderId, shopId, createdBy } = req.body;

      if (!title || !description || !createdBy) {
        return next(new ErrorHandler("Title, description, and creator are required", 400));
      }

      const complaint = await Complaint.create({
        title,
        description,
        category,
        severity,
        orderId,
        shopId,
        createdBy,
      });

      res.status(201).json({ success: true, complaint });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/admin-all",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const complaints = await Complaint.find().sort({ status: 1, severity: -1, createdAt: -1 });
      res.status(200).json({ success: true, complaints });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/seller-all/:shopId",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const complaints = await Complaint.find({ shopId: req.params.shopId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, complaints });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.patch(
  "/resolve/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        return next(new ErrorHandler("Complaint not found", 404));
      }

      complaint.status = req.body.status || "resolved";
      complaint.resolutionNote = req.body.resolutionNote || complaint.resolutionNote;
      complaint.reviewedBy = req.user;
      complaint.resolvedAt = new Date();

      await complaint.save();

      res.status(200).json({ success: true, complaint });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;