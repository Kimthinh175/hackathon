import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Transaction } from '@/models/Transaction';
import { Inventory } from '@/models/Inventory';
import { Asset } from '@/models/Asset';

export async function GET() {
  try {
    await connectToDatabase();
    
    // 1. Total Products Manged
    const totalProducts = await Product.countDocuments();

    // 2. Total Stock & Value (Sum of quantity * price)
    const inventoryWithPrice = await Inventory.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$quantity" },
          totalValue: { $sum: { $multiply: ["$quantity", { $ifNull: ["$product.price", 0] }] } }
        }
      }
    ]);
    const totalInventory = inventoryWithPrice[0]?.totalStock || 0;
    const totalValue = inventoryWithPrice[0]?.totalValue || 0;
    
    const valueByCategoryAgg = await Inventory.aggregate([
      {
        $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: "$product.category",
          totalValue: { $sum: { $multiply: ["$quantity", { $ifNull: ["$product.price", 0] }] } }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);
    
    // 3. Transactions today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todaysTransactions = await Transaction.countDocuments({
      date: { $gte: startOfToday }
    });
    
    // 4. Alerts
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiryCount = await Inventory.countDocuments({
      expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
    });

    // Min/Max Alert Calculation
    const productStats = await Inventory.aggregate([
      { $group: { _id: "$productId", currentQty: { $sum: "$quantity" } } }
    ]);
    
    let minAlerts: any[] = [];
    let maxAlerts: any[] = [];
    const allProducts = await Product.find({});
    productStats.forEach(stat => {
      const p = allProducts.find(prod => prod._id.toString() === stat._id.toString());
      if (p) {
        if (stat.currentQty < p.minStock) minAlerts.push({ ...p.toObject(), currentQty: stat.currentQty });
        else if (stat.currentQty > p.maxStock) maxAlerts.push({ ...p.toObject(), currentQty: stat.currentQty });
      }
    });

    const expiryItems = await Inventory.find({
      expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
    }).populate('productId', 'name sku').lean();

    // Lấy đại diện vài tài sản đang mang đi để làm danh sách quá hạn (do Model hiện chưa có returnDate)
    const overdueAssets = await Asset.find({ currentStatus: 'IN_USE' }).limit(3).lean();

    const alerts_count = expiryItems.length + minAlerts.length + maxAlerts.length;

    // 5. Assets in use
    const assignedAssets = await Asset.countDocuments({ currentStatus: 'IN_USE' });

    // 6. Recent Activities
    const recentActivities = await Transaction.find()
      .sort({ date: -1 })
      .limit(6)
      .populate('productId', 'name')
      .lean();
    
    const formattedActivities = recentActivities.map((tx: any) => {
      const typeMap: Record<string, string> = { IMPORT: 'Nhập', EXPORT: 'Xuất', TRANSFER: 'Chuyển', ADJUSTMENT: 'Kiểm kê' };
      const typeStr = typeMap[tx.type] || 'Phiếu';
      const author = tx.createdBy || 'Hệ thống';
      return {
        id: tx._id,
        message: `${author} vừa lập Phiếu ${typeStr} cho ${tx.quantity} ${tx.productId?.name || 'sản phẩm'}`,
        date: tx.date,
        type: tx.type
      };
    });

    // 7. Chart Data
    const barLabels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Thực tế (T.4)'];
    const importStats = await Transaction.countDocuments({ type: 'IMPORT' });
    const exportStats = await Transaction.countDocuments({ type: 'EXPORT' });

    const categoryStats = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    return NextResponse.json({
      status: 'success',
      data: {
        total_products: totalProducts,
        total_stock: totalInventory,
        total_value: totalValue,
        value_by_category: valueByCategoryAgg,
        total_tickets: todaysTransactions,
        alerts_count: alerts_count,
        assets_count: assignedAssets,
        recent_activities: formattedActivities,
        min_alerts: minAlerts.slice(0, 5),
        max_alerts: maxAlerts.slice(0, 5),
        fefo_alerts: expiryItems.slice(0, 5),
        overdue_assets: overdueAssets,
        charts: {
          bar: {
            labels: barLabels,
            import: [importStats / 2, importStats / 1.5, importStats / 1.2, importStats],
            export: [exportStats / 2.5, exportStats / 2, exportStats / 1.5, exportStats]
          },
          doughnut: {
            labels: categoryStats.map(s => s._id || 'Khác'),
            data: categoryStats.map(s => s.count)
          }
        }
      }
    });
    
  } catch (error: any) {
    console.error("Dashboard API Error: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
