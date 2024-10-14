import { NextRequest, NextResponse } from 'next/server';
import Client from '@/models/client'; 
import connect from '@/utils/db';

// GET method for retrieving all admins
export async function GET() {
    await connect();

    try {
        const admins = await Client.find({ role: 'admin' });

        if (!admins || admins.length === 0) {
            return NextResponse.json({ message: 'No admins found' }, { status: 404 });
        }
        return NextResponse.json(admins, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: 'An unexpected error occurred while fetching admins' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const { firstName, lastName, phoneNumber, email, role, password } = await req.json();
    await connect();

    const newAdmin = new Client({
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        role: role || 'admin', 
        adress: 'default',
        identifiant: 'default',
        birthday: new Date(),
      });
    try {
        await newAdmin.save();
        return new NextResponse("Admin created successfully", { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
export async function DELETE(request: NextRequest){
    const id = request.nextUrl.searchParams.get("id");
    await connect();
    try {
        const deletedAdmin = await Client.findByIdAndDelete(id);
    
        if (!deletedAdmin) {
          return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Admin deleted successfully' }, { status: 200 });
      } catch (error) {
        console.error('Error deleting admin:', error);
        return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
      }
}
