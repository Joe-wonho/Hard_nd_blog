const mongoose = require("mongoose");
const { Schema } = mongoose;
const commentSchema = new Schema({
  boardId: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  today: {
    type: Date,
    default: Date.now(),
  },
  date: {
    type: String,
  },
  comment: {
    type: String,
    required: true,
  },
});

commentSchema.virtual("commentId").get(function () {
  return this._id.toHexString();
});
commentSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Comments", commentSchema);
