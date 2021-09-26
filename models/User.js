const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 40,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicLink: {
      type: String,
      required: true,
    }
  },
  { toJSON: { virtuals: true } }
);

const User = mongoose.model("user", participantSchema);

module.exports = User;