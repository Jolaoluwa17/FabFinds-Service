const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  suffix: {
    type: String,
    required: true,
  },
});

const Size = mongoose.model("Size", sizeSchema);

module.exports = Size;
