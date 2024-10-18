import { NextRequest, NextResponse } from 'next/server';
import connect from '@/utils/db';
import Client from '@/models/client';
import bcrypt from 'bcryptjs';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) { 
    try { 
        const { id } = params; 
        const { 
            firstName, 
            lastName, 
            email, 
            phoneNumber, 
            role, 
            password, 
            birthday, 
            identifiant, 
            adress, 
            rental 
        } = await req.json(); 
        
        await connect(); 

        const updateData: any = { 
            firstName, 
            lastName, 
            email, 
            phoneNumber, 
            role 
        }; 

        if (password) { 
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(password, saltRounds);
        } 

        if (role === 'locateur') {
            updateData.birthday = birthday;
            updateData.identifiant = identifiant;
            updateData.adress = adress;
            updateData.rental = rental;
        }

        const updatedUser = await Client.findByIdAndUpdate( 
            id, 
            updateData, 
            { new: true, runValidators: true } 
        ); 

        if (!updatedUser) { 
            return NextResponse.json({ error: `${role} not found.` }, { status: 404 }); 
        } 

        const userWithoutPassword = updatedUser.toObject(); 
        delete userWithoutPassword.password; 

        return NextResponse.json({ message: `${role} updated successfully`, user: userWithoutPassword }); 
    } catch (error) { 
        console.error('Error updating user:', error); 
        return NextResponse.json({ error: `Failed to update ${role}.` }, { status: 500 }); 
    } 
} 

export async function GET(req: NextRequest, { params }: { params: { id: string } }) { 
    try { 
        const { id } = params; 
        await connect(); 

        const user = await Client.findById(id); 

        if (!user) { 
            return NextResponse.json({ error: "User not found." }, { status: 404 }); 
        } 

        const userWithoutPassword = user.toObject(); 
        delete userWithoutPassword.password; 

        return NextResponse.json({ user: userWithoutPassword }, { status: 200 }); 
    } catch (error) { 
        console.error('Error fetching user:', error); 
        return NextResponse.json({ error: "Failed to fetch user." }, { status: 500 }); 
    } 
}