import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Asset } from '@/models/Asset';
import { AssetAllocation } from '@/models/AssetAllocation';

export async function GET() {
  try {
    await connectToDatabase();
    if (!AssetAllocation) console.log("Loaded ref");
    const assets = await Asset.find({}).sort({ createdAt: -1 });
    return NextResponse.json(assets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, assetId, assignedTo, condition } = body;
    await connectToDatabase();
    
    const asset = await Asset.findById(assetId);
    if (!asset) return NextResponse.json({ error: "Không tìm thấy Tài sản" }, { status: 404 });

    if (action === 'ALLOCATE') {
        asset.currentStatus = 'IN_USE';
        await asset.save();
        await AssetAllocation.create({
            assetId,
            assignedTo: assignedTo || 'Người dùng mặc định',
            assignedDate: new Date(),
            condition: condition || 'Tốt'
        });
    } else if (action === 'RETURN') {
        asset.currentStatus = 'IN_STOCK';
        await asset.save();
        // Cập nhật record cuối đang IN_USE
        const allocation = await AssetAllocation.findOne({ assetId, returnedDate: { $exists: false } }).sort({ assignedDate: -1 });
        if (allocation) {
            allocation.returnedDate = new Date();
            allocation.condition = condition || 'Tốt (Thu hồi)';
            await allocation.save();
        }
    } else {
        return NextResponse.json({ error: "Hành động không hợp lệ" }, { status: 400 });
    }

    return NextResponse.json({ status: 'success', asset });
  } catch (error: any) {
    console.error("Asset POST Error: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
