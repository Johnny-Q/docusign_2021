const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User" }, // The user who authored the review
    sketchLayer: String, // The data containing the sketch layer edited by the reviewer
    verdict: {
        type: String,
        default: "pending",
        enum: ["pending", "approved", "changes requested"]
    },
    comments: String, // Comments added by the reviewer
    // Option to add images? How would this be handled
});

module.exports = mongoose.model('Review', Review);