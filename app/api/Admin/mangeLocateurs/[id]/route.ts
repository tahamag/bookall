import { NextRequest, NextResponse } from 'next/server'
import connect from '@/utils/db'
import ClientModel from '@/models/client'
import mongoose from 'mongoose'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect()

  const { id } = params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid locateur ID' }, { status: 400 })
  }

  try {
    const deletedLocateur = await ClientModel.findOneAndDelete({ _id: id, role: 'locateur' })
    if (!deletedLocateur) {
      return NextResponse.json({ error: 'Locateur not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Locateur deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting locateur:', error)
    return NextResponse.json({ error: 'Error deleting locateur' }, { status: 500 })
  }
}