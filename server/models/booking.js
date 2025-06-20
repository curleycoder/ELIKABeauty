const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    phone: {type: String, required: true},
    Service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    date: Date,
    note: String,
    createdAt:{
        type: Date,
        default:Date.now
    }
});

module.exports = mongoose.model("booking", bookingSchema)