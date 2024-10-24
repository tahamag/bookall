import bookingCart from '@/models/booking_X_cart';
import connect from '@/utils/db';
import { ObjectId } from 'mongodb';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {  cartId ,bookingId } = await request.json();

    await connect();

    const newbookingCart = new bookingCart({ cartId ,bookingId});

    try {
        await newbookingCart.save();

        await bookingCart.updateOne({
            _id: new ObjectId(cartId) },
            { $set: { isValid: true } }
        );

        return new NextResponse(
            JSON.stringify({ message: "booking cart inserted" }),
            { status: 200 }
        );
    } catch (err: unknown) {
        console.error(err)
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
};
