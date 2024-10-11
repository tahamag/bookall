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
    //const files: File[] | null = data.getAll('additionalImages') as unknown as File[];
    //const files: File[] | null = Array.from(data.getAll('additionalImages')).filter(file => file instanceof File) as File[];
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
                idClient
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
                idClient
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
            idClient
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
        console.log("***************hy***********************")
        //const { idClient } = req.params.idClient;
        const { searchParams } = new URL(req.url)
        const idClient = searchParams.get('idClient')
        await connect();
        const rentals = await Rental.find({idClient:  new ObjectId(idClient)});
        return NextResponse.json(
            { message: "Rental is registered successfully", rentals: rentals },
            { status: 200 }
        )
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
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