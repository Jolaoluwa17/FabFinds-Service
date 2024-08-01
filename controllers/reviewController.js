const Review = require("../models/Review");

// GET all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user");
    if (reviews.length === 0) {
      return res.status(404).json({ message: "no reviews found" });
    }
    return res.status(200).json(reviews);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// CREATE new review
const createNewReview = async (req, res) => {
  const newReview = new Review(req.body);
  try {
    const savedReview = await newReview.save();
    return res.status(200).json(savedReview);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

// GET specific review
const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("user");
    if (!review) {
      return res.status(404).json({ message: "review not found" });
    }
    return res.status(200).json(review);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// GET review by product id
const getReviewsByProductId = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await Review.find({ product: productId }).populate("user");
    return res.status(200).json(reviews);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// UPDATE review
const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    return res.status(200).json(updatedReview);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// DELETE review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "review not found" });
    }
    await review.deleteOne({ _id: req.params.id });
    return res.status(200).json("review has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getAllReviews,
  getReview,
  getReviewsByProductId,
  createNewReview,
  deleteReview,
  updateReview,
};
