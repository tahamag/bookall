import Rental from '@/models/rental';
import connect from '@/utils/db';
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';
import { NextApiRequest } from 'next';


export async function POST(request: Request) {
    await connect();
    let newRental;
    const data = await request.formData()
    const idClient = data.get('idClient');
    const rentalType = data.get('rentalType');
    const name = data.get('name');
    const description = data.get('description');
    const price = data.get('price');
    const city = data.get('city');
    const disposability = data.get('disposability');
    const file: File | null = data.get('mainImage') as unknown as File ;
   
    const bytes = await file.arrayBuffer()
    const mainImage = Buffer.from(bytes)
   
    if(rentalType === 'Hotel' || rentalType === 'Apartment'){
        const address = data.get('address');
        const nbrChamber = data.get('nbrChamber');
        const wifi = data.get('wifi');
        const parking = data.get('parking');
        const piscine = data.get('piscine');
        if(rentalType === 'Apartment')
            newRental = new Rental({
                name,
                description,
                price,
                city,
                disposability,
                mainImage,
                address,
                nbrChamber,
                wifi,
                parking,
                piscine,
                idClient,
                rentalType
            });
        else{
            const restoration = data.get('restoration');
            newRental = new Rental({
                name,
                description,
                price,
                city,
                disposability,
                mainImage,
                address,
                nbrChamber,
                wifi,
                parking,
                piscine,
                restoration,
                idClient,
                rentalType
            });
        }
    }

    if (rentalType === 'Car') {
        const model = data.get('model');
        const marque = data.get('marque');
        const automatique = data.get('automatique');
        const typeCars = data.get('typeCars');

        newRental = new Rental({
            name,
            description,
            price,
            city,
            disposability,
            mainImage,
            model,
            marque,
            automatique,
            typeCars,
            idClient,
            rentalType
        });
    }

    try {
        //await newRental.save();
        const savedRental = await newRental.save();
        const newId = savedRental._id;
        return NextResponse.json(
            { message: "Rental is registered successfully", rentalId: newId },
            { status: 200 }
        )
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}

export async function GET(req: NextApiRequest) {
    try {
        let rentals;
        const { searchParams } = new URL(req.url)
        const idClient = searchParams.get('idClient')?? null;
        const rentalId = searchParams.get('rentalId')?? null;
        const rentalType = searchParams.get('rentalType')?? null;

        await connect();

        if (idClient != null)
            rentals = await Rental.find({ idClient: new ObjectId(idClient) });
        else if (rentalId != null)
            rentals = await Rental.findOne({ _id: new ObjectId(rentalId) });
        else if(rentalType!=null)
            rentals = await Rental.find({rentalType:  rentalType });
        else if( rentalType != null && rentalId != null)
            rentals = await Rental.find({rentalType:  rentalType , disposability : true ,_id: { $ne: new ObjectId(rentalId) }}).limit(8);
        else
            rentals = await Rental.find();

        return NextResponse.json(
            { message: "Rental fetched successfully", rentals: rentals },
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


export async function DELETE(request: Request) {
    await connect();
    try {
        const { retanlId } = await request.json();

        await Rental.deleteOne({ _id:  new ObjectId(retanlId) });
        return NextResponse.json(
            { message: "Rental is deleted successfully" },
            { status: 200 }
        )
        // res.status(200).json(rentals)
    } catch (error) {
        console.error();
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextApiRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const rentalId = searchParams.get('rentalId')?? null ;
        const formData = await request.formData();

        // Extract data from formData
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string);
        const city = formData.get('city') as string;
        const disposability = formData.get('disposability') === 'true';
        const rentalType = formData.get('rentalType') as 'Hotel' | 'Apartment' | 'Car';

        // Validate required fields
        if (!rentalId || !name || !description || isNaN(price) || !city || !rentalType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Prepare update data
        const updateData: any = {
            name,
            description,
            price,
            city,
            disposability,
            rentalType,
        };

        // Handle type-specific fields
        if (rentalType === 'Hotel' || rentalType === 'Apartment') {
            updateData.address = formData.get('address') as string;
            updateData.nbrChamber = parseInt(formData.get('nbrChamber') as string);
            updateData.wifi = formData.get('wifi') === 'true';
            updateData.parking = formData.get('parking') === 'true';
            updateData.piscine = formData.get('piscine') === 'true';
            if (rentalType === 'Hotel') {
                updateData.restoration = formData.get('restoration') === 'true';
            }
        } else if (rentalType === 'Car') {
            updateData.model = formData.get('model') as string;
            updateData.marque = formData.get('marque') as string;
            updateData.automatique = formData.get('automatique') === 'true';
            updateData.typeCars = formData.get('typeCars') as string;
        }
        // Handle main image upload
        const mainImage = formData.get('mainImage') as File;
        if (mainImage) {
            const file: File | null = formData.get('mainImage') as unknown as File ;
            const bytes = await file.arrayBuffer()
            updateData.mainImage = Buffer.from(bytes)
        }

        // Update rental in database
        const updatedRental = await Rental.updateOne({
            _id: new ObjectId(rentalId) },
            {$set: updateData},
        );
        return NextResponse.json({ message: 'Rental updated successfully', rental: updatedRental }, { status: 200 });
    } catch (error) {
        console.error('Error updating rental:', error);
        return NextResponse.json({ error: 'Failed to update rental' }, { status: 500 });
    }
}