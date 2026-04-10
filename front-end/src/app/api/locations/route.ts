import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Location } from '@/models/Location';
import { Inventory } from '@/models/Inventory';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all locations
    const locations = await Location.find({}).sort({ warehouse: 1, rack: 1, tier: 1, bin: 1 });
    
    // Get current inventory to calculate occupancy
    const inventories = await Inventory.find({});
    
    // Map inventory to locations
    const occupancyMap: Record<string, number> = {};
    inventories.forEach(inv => {
      const locId = inv.locationId.toString();
      occupancyMap[locId] = (occupancyMap[locId] || 0) + inv.quantity;
    });

    const results = locations.map(loc => {
      const quantity = occupancyMap[loc._id.toString()] || 0;
      let status = 'empty';
      if (quantity > 0) status = 'occupied';
      if (quantity > 100) status = 'full'; // Giả định 100 là ngưỡng đầy ô
      
      return {
        ...loc.toObject(),
        currentQuantity: quantity,
        status: status
      };
    });

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
