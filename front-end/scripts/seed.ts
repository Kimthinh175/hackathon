const mongoose = require('mongoose');
const { fakerVI: faker } = require('@faker-js/faker');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Product } = require('../src/models/Product.ts');
const { Location: LocationModel } = require('../src/models/Location.ts');
const { Inventory } = require('../src/models/Inventory.ts');
const { Transaction, TransactionType } = require('../src/models/Transaction.ts');
const { Asset, AssetStatus } = require('../src/models/Asset.ts');
const { AssetAllocation } = require('../src/models/AssetAllocation.ts');

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    console.error("Thiết lập MONGODB_URI trong file .env !!");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Kết nối MongoDB thành công. Đang xóa dữ liệu cũ...");

    // Xóa data cũ
    await Product.deleteMany({});
    await LocationModel.deleteMany({});
    await Inventory.deleteMany({});
    await Transaction.deleteMany({});
    await Asset.deleteMany({});
    await AssetAllocation.deleteMany({});
    
    console.log("✅ Đã xóa dữ liệu cũ. Bắt đầu sinh dữ liệu...");

    // 1. Tạo Products
    const realProducts = [
      { name: 'Sữa tươi tiệt trùng Vinamilk 180ml', importUnit: 'Thùng', exportUnit: 'Lốc', category: 'Sữa & Từ Sữa', price: 320000 },
      { name: 'Nước mắm Chinsu Nam Ngư 500ml', importUnit: 'Thùng', exportUnit: 'Chai', category: 'Gia vị', price: 45000 },
      { name: 'Mì tôm Hảo Hảo chua cay', importUnit: 'Thùng', exportUnit: 'Gói', category: 'Thực phẩm đồ khô', price: 110000 },
      { name: 'Thùng bia Tiger Bạc 24 lon', importUnit: 'Pallet', exportUnit: 'Thùng', category: 'Đồ uống có cồn', price: 380000 },
      { name: 'Nước xả vải Downy hương nắng mai 3L', importUnit: 'Thùng', exportUnit: 'Túi', category: 'Hóa mỹ phẩm', price: 155000 },
      { name: 'Giấy vệ sinh Watersilk 12 cuộn', importUnit: 'Thùng', exportUnit: 'Lốc', category: 'Hàng tiêu dùng', price: 42000 },
      { name: 'Cà phê hòa tan G7 3in1', importUnit: 'Thùng', exportUnit: 'Hộp', category: 'Thức uống', price: 58000 },
      { name: 'Nước giải khát Coca-Cola 1.5L', importUnit: 'Thùng', exportUnit: 'Chai', category: 'Thức uống', price: 18000 },
      { name: 'Bột giặt OMO Matic 4.5kg', importUnit: 'Thùng', exportUnit: 'Túi', category: 'Hóa mỹ phẩm', price: 215000 },
      { name: 'Nước tương Maggi tỏi ớt 300ml', importUnit: 'Thùng', exportUnit: 'Chai', category: 'Gia vị', price: 25000 },
      { name: 'Gạo tẻ ST25 túi 5kg', importUnit: 'Tấn', exportUnit: 'Túi', category: 'Thực phẩm thiết yếu', price: 165000 },
      { name: 'Xúc xích Đức Việt Vườn Bia', importUnit: 'Thùng', exportUnit: 'Gói', category: 'Thực phẩm đông lạnh', price: 65000 },
      { name: 'Dầu ăn Simply 1 Lít', importUnit: 'Thùng', exportUnit: 'Chai', category: 'Gia vị', price: 55000 },
      { name: 'Sữa đặc Ông Thọ nhãn đỏ', importUnit: 'Thùng', exportUnit: 'Lon', category: 'Sữa & Từ Sữa', price: 23000 },
      { name: 'Dầu gội Clear Men bùn khoáng 630g', importUnit: 'Thùng', exportUnit: 'Chai', category: 'Hóa mỹ phẩm', price: 145000 }
    ];

    const products = [];
    for (let i = 0; i < realProducts.length; i++) {
        const rp = realProducts[i];
        products.push(new Product({
            sku: `SP${1001 + i}`,
            name: rp.name,
            importUnit: rp.importUnit,
            exportUnit: rp.exportUnit,
            conversionRate: faker.number.int({ min: 10, max: 24 }),
            barcode: faker.string.numeric(13),
            minStock: faker.number.int({ min: 30, max: 100 }),
            maxStock: faker.number.int({ min: 300, max: 900 }),
            category: rp.category,
            price: rp.price
        }));
    }
    const savedProducts = await Product.insertMany(products);
    console.log(`✅ Đã tạo ${savedProducts.length} mặt hàng.`);

    // 2. Tạo Locations (Bin)
    const locations = [];
    const warehouses = ['Kho Tổng', 'Kho Cửa Hàng A'];
    const racks = ['A', 'B'];
    const tiers = ['1', '2'];
    const bins = ['01', '02', '03'];

    for (const hw of warehouses) {
        for (const r of racks) {
            for (const t of tiers) {
                for (const b of bins) {
                    locations.push(new LocationModel({
                        warehouse: hw,
                        rack: r,
                        tier: t,
                        bin: b
                    }));
                }
            }
        }
    }
    const savedLocations = await LocationModel.insertMany(locations);
    console.log(`✅ Đã tạo ${savedLocations.length} ô vị trí kho.`);

    // 3. Tạo Inventory & Transactions
    const inventories = [];
    const transactions = [];
    
    for (let i = 0; i < 50; i++) {
        const prod = faker.helpers.arrayElement(savedProducts);
        const loc = faker.helpers.arrayElement(savedLocations);
        const qty = faker.number.int({ min: 10, max: 500 });
        
        let importDate = faker.date.recent({ days: 90 });
        let expiryDate = faker.date.future({ years: 1, refDate: importDate });
        // Make some expire soon (FEFO alert)
        if (i % 5 === 0) expiryDate = faker.date.soon({ days: 15 });
        // Make some slow moving
        if (i % 7 === 0) importDate = faker.date.past({ years: 1 });

        inventories.push(new Inventory({
            productId: prod._id,
            locationId: loc._id,
            quantity: qty,
            batchNumber: `L${faker.string.numeric(4)}`,
            importDate: importDate,
            expiryDate: expiryDate
        }));

        // Ghi lại giao dịch nhập ban đầu
        transactions.push(new Transaction({
            type: TransactionType.IMPORT,
            productId: prod._id,
            quantity: qty,
            toLocationId: loc._id,
            date: importDate,
            note: 'Nhập kho ban đầu (Seed)',
            createdBy: faker.helpers.arrayElement(['Nguyễn Văn Quân', 'Đặng Ngọc Bích', 'Lê Trọng Tấn', 'Quản trị viên'])
        }));
    }
    
    // Giao dịch chuyển kho (TRANSFER)
     for (let i = 0; i < 15; i++) {
          const prod = faker.helpers.arrayElement(savedProducts);
          const qty = faker.number.int({ min: 1, max: 20 });
          transactions.push(new Transaction({
             type: TransactionType.TRANSFER,
             productId: prod._id,
             quantity: qty,
             fromLocationId: faker.helpers.arrayElement(savedLocations)._id,
             toLocationId: faker.helpers.arrayElement(savedLocations)._id,
             date: faker.date.recent({ days: 10 }),
             note: 'Chuyển lô hàng nội bộ',
             createdBy: faker.helpers.arrayElement(['Trần Thị Mai', 'Hoàng Thanh Thủy', 'Vũ Hải Đăng'])
         }));
     }
    
    await Inventory.insertMany(inventories);
    await Transaction.insertMany(transactions);
    console.log(`✅ Đã tạo ${inventories.length} tồn kho và ${transactions.length} giao dịch.`);

    // 4. Tạo Asset & Asset Allocation
    const realAssets = [
      { name: 'Xe nâng tay Meditek HPT25 2.5 Tấn', purchasePrice: 4500000 },
      { name: 'Máy quét mã vạch không dây Zebra DS2278', purchasePrice: 3200000 },
      { name: 'Thang nhôm rút chữ A Nikawa', purchasePrice: 1800000 },
      { name: 'Laptop Dell Latitude 5420 (Kho Tổng)', purchasePrice: 15500000 },
      { name: 'Quạt hút công nghiệp Dasin', purchasePrice: 2100000 },
      { name: 'Máy in tem nhãn Xprinter 350B', purchasePrice: 1250000 },
      { name: 'Bộ chia mạng Switch Cisco 24 Port', purchasePrice: 5600000 },
      { name: 'Camera an ninh Hikvision Dome', purchasePrice: 950000 },
      { name: 'Bàn cân điện tử 300kg Ohaus', purchasePrice: 4800000 },
      { name: 'Xe đẩy hàng 4 bánh Jumbo', purchasePrice: 1900000 }
    ];

    const assets = [];
    for (let i = 0; i < realAssets.length; i++) {
        const ra = realAssets[i];
        assets.push(new Asset({
            assetCode: `TS-${faker.string.numeric(4)}`,
            name: ra.name,
            purchasePrice: ra.purchasePrice,
            purchaseDate: faker.date.past({ years: 3 }),
            usefulLifeYears: faker.helpers.arrayElement([3, 5, 10]),
            currentStatus: faker.helpers.arrayElement([AssetStatus.IN_STOCK, AssetStatus.IN_USE, AssetStatus.IN_USE])
        }));
    }
    const savedAssets = await Asset.insertMany(assets);
    
    const allocations: any[] = [];
    const vietnameseNames = [
      'Nguyễn Văn Quân (Thủ kho)', 'Trần Thị Mai (Kế toán)', 'Lê Trọng Tấn (Kiểm hàng)', 
      'Phạm Hoàng Hà (Kỹ thuật)', 'Đặng Ngọc Bích (Phó kho)', 'Vũ Hải Đăng (Vận chuyển)'
    ];

    savedAssets.filter((a: any) => a.currentStatus === AssetStatus.IN_USE).forEach((a: any) => {
        allocations.push(new AssetAllocation({
            assetId: a._id,
            assignedTo: faker.helpers.arrayElement(vietnameseNames),
            assignedDate: faker.date.recent({ days: 120 }),
            condition: faker.helpers.arrayElement(['Hoạt động tốt', 'Khá mới', 'Có vết xước nhẹ'])
        }));
    });
    
    await AssetAllocation.insertMany(allocations);
    console.log(`✅ Đã tạo ${savedAssets.length} tài sản và cấp phát ${allocations.length} lượt.`);

    console.log("🎉 Hoàn tất quá trình Seed Database!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
