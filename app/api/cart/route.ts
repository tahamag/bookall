//name rentalType price startDate endDate nights totalPrice city clientId rentalId
import cart from '@/models/cart';
import connect from '@/utils/db';
import { NextResponse } from "next/server";
import { NextApiRequest } from 'next';

export async function POST(request: Request) {
    const { name, rentalType, price, startDate, endDate, nights, totalPrice, city, clientId , rentalId } = await request.json();
    await connect();

    const newCart = new cart({name, rentalType, price, startDate, endDate, nights, totalPrice, city, clientId , rentalId});

    try {
        await newCart.save();
        return new NextResponse("cart added successfully", { status: 200 });
    } catch (err: unknown) {
        console.error(err)
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
};

export async function GET(req: NextApiRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const idClient = searchParams.get('idClient')?? null;
        await connect();

        const carts = await cart.find({ idClient: idClient, isValid : false });
        return NextResponse.json(
            { message: "cart fetched successfully", carts: carts },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
