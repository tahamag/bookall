import retalImages from '@/models/rentalImages';
import connect from '@/utils/db';
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    await connect();
    /* image / rentalId*/

    const data = await request.formData()
    const rentalId = data.get('rentalId')
    const file: File | null = data.get('image') as unknown as File ;

    console.log("file :",file);
    console.log("retal id  :",rentalId);

    const bytes = await file.arrayBuffer()
    const image = Buffer.from(bytes)
    console.log("image :",image);

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

        // response;
        //return new NextResponse("rental is registered successfully", { status: 200 , rentalId : newId });
    } catch (err: unknown) {
        console.error(err);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}
