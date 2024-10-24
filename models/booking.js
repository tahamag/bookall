import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
{
    reference: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    clientId : {
        type: String,
        required: true,
    },
},
{ timestamps: true }
);

export default mongoose.models.booking || mongoose.model("booking", bookingSchema);