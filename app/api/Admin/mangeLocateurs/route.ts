import { NextResponse } from 'next/server'
import connect from '@/utils/db'
import ClientModel from '@/models/client'

export async function GET() {
  await connect()

  try {
    const locateurs = await ClientModel.find({ role: 'locateur' }).select('-password')
    return NextResponse.json(locateurs, { status: 200 })
  } catch (error) {
    console.error('Error fetching locateurs:', error)
    return NextResponse.json({ error: 'Error fetching locateurs' }, { status: 500 })
  }
}