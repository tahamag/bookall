import { NextResponse } from 'next/server';
import connect from '@/utils/db';
import Rental from '@/models/rental';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const _id = params.id;

  if (!ObjectId.isValid(_id)) {
    return NextResponse.json(
      { error: 'Invalid Rental ID' },
      { status: 400 } 
    );
  }

  try {
    await connect();

    // Trouver la location par son ObjectId
    const rental = await Rental.findById(new ObjectId(_id));

    if (!rental) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 } 
      );
    }

    // Basculer l'état de validation
    rental.isValidated = !rental.isValidated;

    await rental.save();

    return NextResponse.json({
      message: "Rental validation status successfully updated",
      rental: rental
    });
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'An unexpected error has occurred' },
      { status: 500 }
    );
  }
}

