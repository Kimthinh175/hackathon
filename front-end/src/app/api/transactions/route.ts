import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Transaction } from '@/models/Transaction';
import { Product } from '@/models/Product';
import { Location } from '@/models/Location';
import { Inventory } from '@/models/Inventory';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product');

    await connectToDatabase();
    
    if (!Product || !Location) console.log("Loaded refs");

    let query: any = {};
    if (productId) query.productId = productId;
    
    const transactions = await Transaction.find(query)
      .populate('productId')
      .populate('fromLocationId')
      .populate('toLocationId')
      .sort({ date: -1 });

    return NextResponse.json(transactions);
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, productId, quantity, fromLocationId, toLocationId, note } = body;
        
        await connectToDatabase();
        if (!Product || !Location || !Inventory) console.log("Loaded refs");
        
        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return NextResponse.json({ error: "Số lượng không hợp lệ" }, { status: 400 });
        }

        // Fetch product to get conversion rate
        const productDoc = await Product.findById(productId);
        if (!productDoc) {
            return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
        }

        let effectiveQuantity = parsedQuantity;
        
        // Logic xử lý Kho
        if (type === 'IMPORT') {
            // Quy đổi: Nhập 1 Thùng = conversionRate Cái
            effectiveQuantity = parsedQuantity * (productDoc.conversionRate || 1);
            
            const inventory = await Inventory.findOne({ productId, locationId: toLocationId });
            if (inventory) {
                inventory.quantity += effectiveQuantity;
                await inventory.save();
            } else {
                await Inventory.create({ 
                    productId, 
                    locationId: toLocationId, 
                    quantity: effectiveQuantity,
                    batchNumber: "L-" + new Date().getTime().toString().substr(-5),
                    importDate: new Date(),
                    // Hardcode expiry in 1 year for demo
                    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                });
            }
        } 
        else if (type === 'EXPORT') {
            // Xuất theo Cái (đã là đơn vị nhỏ nhất)
            const inventory = await Inventory.findOne({ productId, locationId: fromLocationId });
            if (!inventory || inventory.quantity < effectiveQuantity) {
                return NextResponse.json({ error: "Tồn kho không đủ để xuất!" }, { status: 400 });
            }
            inventory.quantity -= effectiveQuantity;
            await inventory.save();
        } 
        else if (type === 'TRANSFER') {
            if (fromLocationId === toLocationId) {
                return NextResponse.json({ error: "Vị trí nguồn và đích không thể giống nhau!" }, { status: 400 });
            }
            const fromInv = await Inventory.findOne({ productId, locationId: fromLocationId });
            if (!fromInv || fromInv.quantity < parsedQuantity) {
                return NextResponse.json({ error: "Tồn kho nguồn không đủ để chuyển đi!" }, { status: 400 });
            }
            // Trừ nguồn
            fromInv.quantity -= parsedQuantity;
            await fromInv.save();
            
            // Cộng đích
            const toInv = await Inventory.findOne({ productId, locationId: toLocationId });
            if (toInv) {
                toInv.quantity += parsedQuantity;
                await toInv.save();
            } else {
                await Inventory.create({
                    productId,
                    locationId: toLocationId,
                    quantity: parsedQuantity,
                    batchNumber: fromInv.batchNumber, // Giữ nguyên Lô
                    importDate: fromInv.importDate,
                    expiryDate: fromInv.expiryDate
                });
            }
        }
        else if (type === 'ADJUSTMENT') {
            // Kiểm kê: thay thế hoặc cộng trừ. Trong thiết kế này đắp bù số.
            const fromInv = await Inventory.findOne({ productId, locationId: fromLocationId });
            if (fromInv) {
                fromInv.quantity = parsedQuantity; // cập nhật đè số mới kiểm kê
                await fromInv.save();
            } else {
                await Inventory.create({
                    productId,
                    locationId: fromLocationId,
                    quantity: parsedQuantity,
                    importDate: new Date()
                });
            }
        } else {
            return NextResponse.json({ error: "Loại giao dịch không hợp lệ!" }, { status: 400 });
        }

        const newTrans = await Transaction.create({
            type,
            productId,
            quantity: parsedQuantity,
            fromLocationId: fromLocationId || null,
            toLocationId: toLocationId || null,
            note: note || `Đã thực hiện giao dịch ${type}`
        });

        // Refecth saved details
        const populatedTrans = await Transaction.findById(newTrans._id)
          .populate('productId')
          .populate('fromLocationId')
          .populate('toLocationId');

        return NextResponse.json({ status: 'success', data: populatedTrans });
    } catch (error: any) {
        console.error("POST Transaction API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
