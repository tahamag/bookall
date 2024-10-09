    import { NextResponse } from "next/server";


    export async function POST(request: Request) {
        try {
            const data = await request.formData()
            const files: File[] | null = data.getAll('additionalImages') as unknown as File[];
            const file: File | null = data.get('mainImage') as unknown as File ;

            const bytes = await file.arrayBuffer()
            const mainImage = Buffer.from(bytes)

            return new NextResponse("success", { status: 200 });
        } catch (err: any) {
            console.error(err);
            return NextResponse.json(
                { error: 'An unexpected error occurred' },
                { status: 500 }
            )
        }
    }