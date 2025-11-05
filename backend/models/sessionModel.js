const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    sessionName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: {
      type: String, // HH:MM format
      required: true,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid time format! Use HH:MM (24-hour).`,
      },
    },
    meetingId: { type: String, required: true }, // new field
    password: { type: String, required: true }, // new field
    joinLink: { type: String, required: true }, // new field
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Session", sessionSchema);
