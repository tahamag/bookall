import mongoose from "mongoose";

const bookingCartSchema = new mongoose.Schema(
{
    cartId: {
        type: String,
        required: true,
    },
    bookingId: {
        type: String,
        required: true,
    },
},
{ timestamps: true }
);

export default mongoose.models.bookingCart || mongoose.model("bookingCart", bookingCartSchema);