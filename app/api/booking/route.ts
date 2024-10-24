import booking from '@/models/booking';
import connect from '@/utils/db';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {  reference, price,clientId } = await request.json();

    await connect();

    const newBooking = new booking({ reference, price,clientId});

    try {
        const savedBooking = await newBooking.save();
        const lastInsertedId = savedBooking._id;
        return new NextResponse(
            JSON.stringify({ bookingId: lastInsertedId }),
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
