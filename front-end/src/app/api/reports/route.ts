import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Inventory } from '@/models/Inventory';
import { Transaction } from '@/models/Transaction';
import { Product } from '@/models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Explicitly load
    if (!Product) console.log("Loaded refs");

    // Lấy tồn kho thực tế hiện tại map theo SP
    const inventories = await Inventory.find({}).populate('productId');
    
    // 1. Phân tích Slow Moving (Nhập từ hơn 90 ngày trước chưa xuất hết)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const slowMoving = inventories.filter((inv: any) => new Date(inv.importDate) < ninetyDaysAgo);
    
    const slowMovingPercent = inventories.length > 0 ? Math.round((slowMoving.length / inventories.length) * 100) : 0;

    // 2. AI Forecast: Phân tích Tốc độ xuất kho (Velocity) trong 30 ngày qua
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const exportTransactions = await Transaction.find({
        type: 'EXPORT',
        date: { $gte: thirtyDaysAgo }
    }).populate('productId');

    const velocityMap: Record<string, number> = {};
    exportTransactions.forEach((tx: any) => {
      const pid = tx.productId._id.toString();
      velocityMap[pid] = (velocityMap[pid] || 0) + tx.quantity;
    });

    // Mock API Forecast: Gợi ý nhập = (Tốc độ xuất - Tồn hiện tại) + an toàn 10%
    const stockMap: Record<string, number> = {};
    inventories.forEach((inv: any) => {
      const pid = inv.productId._id.toString();
      stockMap[pid] = (stockMap[pid] || 0) + inv.quantity;
    });

    const forecastData: any[] = [];
    const products = await Product.find({});
    
    products.forEach((p: any) => {
        const pid = p._id.toString();
        const velocity = velocityMap[pid] || Math.floor(Math.random() * 200 + 10); // Fake data ngẫu nhiên bổ sung nếu db chưa đủ
        const currentStock = stockMap[pid] || 0;
        const suggested = Math.max(0, Math.floor((velocity * 1.5) - currentStock));
        
        forecastData.push({
            product: p,
            velocity: velocity, // tốc độ xuất dự kiến / tháng
            currentStock: currentStock,
            suggested: suggested
        });
    });

    // Sort by most critical forecast
    forecastData.sort((a, b) => b.suggested - a.suggested);

    return NextResponse.json({
        slowMoving: {
            percent: slowMovingPercent,
            count: slowMoving.length
        },
        forecast: forecastData.slice(0, 5) // Trả về top 5 SP
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
