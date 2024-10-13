import retalImages from '@/models/rentalImages';
import connect from '@/utils/db';
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';
import rentalImagesModel from '@/models/rentalImages';


export async function POST(request: Request) {
    await connect();
    /* image / rentalId*/
    const data = await request.formData()
    const rentalId = data.get('rentalId')
    const file: File | null = data.get('image') as unknown as File ;

    const bytes = await file.arrayBuffer()
    const image = Buffer.from(bytes)

    try {
        const newRetalImage = new retalImages({
            image,
            rentalId,
        });
        await newRetalImage.save();
        return NextResponse.json(
            { message: "Rental images is registered successfully" },
            { status: 200 }
        )
    } catch (err: unknown) {
        console.error(err);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}

export async function GET(req: NextApiRequest) {
    try {
        let images;
        const { searchParams } = new URL(req.url)
        const rentalId = searchParams.get('rentalId')?? null ;
        await connect();
        if(rentalId != null)
        images = await retalImages.find({rentalId:  new ObjectId(rentalId)});
        return NextResponse.json(
            { message: "Rental images is fetched successfully", images: images },
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
        await retalImages.deleteMany({ rentalId:  retanlId });
        return NextResponse.json(
            { message: "Rental images is deleted successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error();
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}