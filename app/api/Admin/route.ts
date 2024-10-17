import { NextRequest, NextResponse } from 'next/server';
import connect from '@/utils/db';
import Client from '@/models/client';
//import { ObjectId } from 'mongodb';


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
        return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
      }
}
export async function GET(req: NextRequest) {
    await connect();
    console.log('Request received');
  
    // Récupérer le paramètre "role" depuis les query params
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
  
    try {
      // Filtrer les utilisateurs par rôle (admin ou locateur)
      const users = await Client.find(role ? { role } : {});
      console.log('Users found:', users);
  
      if (!users || users.length === 0) {
        return NextResponse.json({ message: `No users found for role: ${role}` }, { status: 404 });
      }
  
      return NextResponse.json(users, { status: 200 });
    } catch (err) {
        console.error('Error fetching users by role:', error);
      return NextResponse.json(
        { error: `An unexpected error occurred while fetching users with role: ${role}` },
        { status: 500 }
      );
    }
  }