import Booking from '@/models/booking';
import BookingCart from '@/models/booking_X_cart';
import Cart from '@/models/cart';
import connect from '@/utils/db';
import { NextApiRequest } from 'next';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {  reference, price,clientId } = await request.json();

    await connect();

    const newBooking = new Booking({ reference, price,clientId});

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
export async function GET(req: NextApiRequest) {
    
    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId')
    await connect();

    try {
        // Fetch all bookings
        const bookings = await Booking.find({clientId:clientId}).lean();

        // Fetch all carts and their associated booking IDs
        const bookingCarts = await BookingCart.find({}).lean();
        const cartIds = bookingCarts.map(bc => bc.cartId);
        const carts = await Cart.find({ _id: { $in: cartIds } }).lean();

        // Create a mapping of cart IDs to cart data
        const cartMap = {};
        carts.forEach(cart => {
            if (!cartMap[cart._id]) {
                cartMap[cart._id] = [];
            }
            cartMap[cart._id].push(cart);
        });

        // Format the bookings
        const formattedBookings = bookings.map(booking => {
            const relatedCarts = bookingCarts
                .filter(bc => bc.bookingId === booking._id.toString())
                .map(bc => cartMap[bc.cartId])
                .flat(); // Flatten the array

            return {
                reference: booking.reference,
                price: booking.price,
                operationDate: booking.createdAt, // Assuming you want the creation date as operationDate
                rentals: relatedCarts.map(cart => ({
                    name: cart.name,
                    rentalType: cart.rentalType,
                    price: cart.price,
                    startDate: cart.startDate.toISOString().split('T')[0], // Format date
                    endDate: cart.endDate.toISOString().split('T')[0], // Format date
                    nights: cart.nights,
                    totalPrice: cart.totalPrice,
                    city: cart.city,
                })),
            };
        });
        return NextResponse.json(
            { message: "Rental fetched successfully", Bookings: formattedBookings },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
};

