const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Audit = new Schema({
  name: String, // Name of the audit
  facilitator: { type: Schema.Types.ObjectId, ref: "User" }, // Email of the user who initiated the conversation
  reviewers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Stakeholders and experts added to give feedback to the conversation
  webmapID: String, // PortalItem ID of the webmap from ArcGIS
  cycle: Number,
  cycles: [
    {
      reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }], // Array containing each review made by a reviewer
      finalLayer: String, // Final iteration of the cycle made by the facilitator based on the suggestions
      comments: String // Comments made by the facilitator to add additional context for the next review cycle
    }
  ],
  status: {
    type: String,
    default: "awaiting responses",
    enum: ["awaiting responses", "awaiting revisions", "completed"]
  }
});

module.exports = mongoose.model("Audit", Audit);
