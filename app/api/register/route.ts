import Client from '@/models/client';
import connect from '@/utils/db';
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { firstName ,lastName ,email ,birthday ,phoneNumber ,identifiant ,adress ,password , role ,rental} = await request.json();
    let newClient = null
    await connect();
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
        return NextResponse.json(
            { error: 'Email already exists' },
            { status: 400 }
        )
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    if(adress != null)
        newClient = new Client({firstName ,lastName ,email ,birthday ,phoneNumber ,identifiant ,adress ,password: hashedPassword, role ,rental});
    else
        newClient = new Client({firstName ,lastName ,email ,birthday ,phoneNumber ,identifiant  ,password: hashedPassword, role });

    try {
        await newClient.save();
        return new NextResponse("Client is registered successfully", { status: 200 });
    } catch (err: unknown) {
        console.error(err)
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
};