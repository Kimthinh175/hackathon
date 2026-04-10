import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Inventory } from '@/models/Inventory';
import { Product } from '@/models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Explicitly load
    if (!Product) console.log("Loaded refs");

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    // 1. Lấy cảnh báo Expiry (FEFO)
    const fefoAlerts = await Inventory.find({
      expiryDate: { $lte: thirtyDaysFromNow }
    }).populate('productId').sort({ expiryDate: 1 });

    // 2. Lấy danh sách tồn của tất cả SP để check Min/Max
    // Trong thực tế cần dùng Aggregation sum(quantity) group by productId
    const inventories = await Inventory.find({}).populate('productId');
    const stockMap: Record<string, number> = {};
    inventories.forEach((inv: any) => {
      const pid = inv.productId._id.toString();
      stockMap[pid] = (stockMap[pid] || 0) + inv.quantity;
    });

    const minMaxAlerts: any[] = [];
    const products = await Product.find({});
    products.forEach((p: any) => {
        const currentStock = stockMap[p._id.toString()] || 0;
        if (currentStock < p.minStock) {
            minMaxAlerts.push({ product: p, currentStock, type: 'MIN' });
        } else if (currentStock > p.maxStock) {
            minMaxAlerts.push({ product: p, currentStock, type: 'MAX' });
        }
    });

    return NextResponse.json({
        fefo: fefoAlerts,
        minMax: minMaxAlerts
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
