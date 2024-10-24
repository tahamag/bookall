import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
    },
    rentalType: {
        type: String,
        enum: ["Apartment", "Hotel", "Car"],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    nights: {
        type: Number,
        required: true,
    }, // nombre de jours
    totalPrice: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
    },
    c: {
        type: Boolean,
        default : false
    },
    clientId: {
        type: String,
        required: true,
    },
    rentalId: {
        type: String,
        required: true,
    },
},
{ timestamps: true }
);

export default mongoose.models.cart || mongoose.model("cart", cartSchema);