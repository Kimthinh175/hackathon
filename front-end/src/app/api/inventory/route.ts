import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Inventory } from '@/models/Inventory';
import { Product } from '@/models/Product';
import { Location } from '@/models/Location';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Explicitly load models to prevent unpopulated references if they haven't been loaded yet by Mongoose
    if (!Product || !Location) {
        console.log("Loading models");
    }

    const inventories = await Inventory.find({})
      .populate('productId')
      .populate('locationId')
      .sort({ importDate: -1 });
      
    return NextResponse.json(inventories);
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
