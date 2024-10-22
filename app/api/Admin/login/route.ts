import { NextRequest, NextResponse } from 'next/server';
import connect from '@/utils/db';
import Client from '@/models/client'; 
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }
        await connect();

        const user = await Client.findOne({ email, role: 'admin' }); 

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return NextResponse.json({
            message: "Login successful",
            user: userWithoutPassword,
            }, { status: 200 });
    } catch (error) {
        console.error('Error during admin login:', error);
        return NextResponse.json({ error: "Failed to login." }, { status: 500 });
    }
}
