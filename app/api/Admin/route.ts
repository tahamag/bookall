import { NextRequest, NextResponse } from 'next/server';
import connect from '@/utils/db';
import Client from '@/models/client';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { firstName, lastName, phoneNumber, email, role, password } = await req.json();
        await connect();

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newAdmin = new Client({
            firstName,
            lastName,
            phoneNumber,
            email,
            password: hashedPassword, 
            role: role || 'admin', 
            adress: 'default',
            identifiant: 'default',
            birthday: new Date(),
        });

        await newAdmin.save();
        return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
    } catch (err) {
        console.error('Error creating admin:', err);
        return NextResponse.json(
            { error: 'An unexpected error occurred while creating the admin' },
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
        return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
      }
}
export async function GET(req: NextRequest) {
    await connect();
    console.log('Request received');
  
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
  
    try {
      const users = await Client.find(role ? { role } : {});
      console.log('Users found:', users);
  
      if (!users || users.length === 0) {
        return NextResponse.json({ message: `No users found for role: ${role}` }, { status: 404 });
      }
  
      return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error('Error fetching users by role:', error);
      return NextResponse.json(
        { error: `An unexpected error occurred while fetching users with role: ${role}` },
        { status: 500 }
      );
    }
  }