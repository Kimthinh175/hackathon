<?php
// Tự động accept tất cả (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json; charset=UTF-8");

$url = isset($_GET['url']) ? rtrim($_GET['url'], '/') : 'dashboard';
$url = filter_var($url, FILTER_SANITIZE_URL);

if (empty($url)) {
    $url = 'dashboard';
}

$data = [
    "status" => "success",
    "endpoint" => $url,
    "data" => []
];

switch ($url) {
    case 'dashboard':
        $data['data'] = [
            "total_tickets" => 142,
            "total_stock" => 1580,
            "alerts_count" => 4,
            "assets_count" => 25,
            "recent_activities" => [
                ["action" => "Nhập kho", "item" => "SP001", "time" => "10 phút trước"],
                ["action" => "Xuất kho", "item" => "SP045", "time" => "1 giờ trước"]
            ],
            "charts" => [
                "bar" => [
                    "labels" => ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
                    "import" => [350, 420, 200, 500],
                    "export" => [280, 390, 250, 460]
                ],
                "doughnut" => [
                    "labels" => ['Thực phẩm', 'Đồ uống', 'Vật tư', 'Thiết bị'],
                    "data" => [45, 25, 15, 15]
                ]
            ]
        ];
        break;
        
    case 'master-data':
        $data['data'] = [
            ["id" => "SP001", "name" => "Sữa đặc Ông Thọ", "category" => "Thực phẩm", "unit_in" => "Thùng", "unit_out" => "Lon", "conversion" => 48, "min_stock" => 20, "max_stock" => 200],
            ["id" => "SP002", "name" => "Nước tinh khiết Aquafina", "category" => "Đồ uống", "unit_in" => "Thùng", "unit_out" => "Chai", "conversion" => 24, "min_stock" => 50, "max_stock" => 500],
            ["id" => "SP010", "name" => "Khẩu trang y tế", "category" => "Vật tư", "unit_in" => "Thùng", "unit_out" => "Hộp", "conversion" => 50, "min_stock" => 10, "max_stock" => 100],
            ["id" => "SP045", "name" => "Bút bi Thiên Long", "category" => "Văn phòng phẩm", "unit_in" => "Hộp", "unit_out" => "Cây", "conversion" => 20, "min_stock" => 5, "max_stock" => 50]
        ];
        break;
        
    case 'inventory':
        $data['data'] = [
            "recent_transfers" => [
                ["id" => "TR-1001", "desc" => "Chuyển 50 Thùng SP001", "from" => "Kho A (Tầng trệt)", "to" => "Kho B (Tầng 2)", "time" => "Hôm nay 10:30"],
                ["id" => "TR-1002", "desc" => "Chuyển 100 Thùng SP002", "from" => "Kho B (Tầng 2)", "to" => "Kho C (Tầng 3)", "time" => "Hôm qua 15:45"]
            ],
            "active_stocktake" => [
                "id" => "KK-2023-11",
                "warehouse" => "Kho A",
                "counted" => 130,
                "total" => 200,
                "progress_percent" => 65,
                "discrepancies" => 3
            ]
        ];
        break;
        
    case 'assets':
        $data['data'] = [
            ["id" => "TS-LAP-001", "name" => "MacBook Pro M2", "status" => "Đang sử dụng", "user" => "Nguyễn Văn A (Dev)", "original_price" => 30000000, "depreciation" => "20%", "residual_value" => 24000000],
            ["id" => "TS-MON-023", "name" => "Dell Ultrasharp 27\"", "status" => "Lưu kho", "user" => "N/A", "original_price" => 10000000, "depreciation" => "40%", "residual_value" => 6000000],
            ["id" => "TS-PC-012", "name" => "PC HP Optiplex", "status" => "Sửa chữa", "user" => "IT Dept", "original_price" => 15000000, "depreciation" => "60%", "residual_value" => 6000000]
        ];
        break;
        
    case 'alerts':
        $data['data'] = [
            "min_max" => [
                ["id" => "SP010", "name" => "Khẩu trang y tế", "type" => "Dưới Min", "current" => 5, "threshold" => 20, "severity" => "warning"],
                ["id" => "SP045", "name" => "Bút bi Thiên Long", "type" => "Vượt Max", "current" => 500, "threshold" => 200, "severity" => "danger"]
            ],
            "expiry" => [
                ["id" => "L001", "name" => "Lô Thuốc Paracetamol", "expiry_date" => "2023-12-15", "days_left" => 5, "severity" => "error"],
                ["id" => "L042", "name" => "Sữa tươi Vinamilk", "expiry_date" => "2023-12-30", "days_left" => 20, "severity" => "warning"]
            ]
        ];
        break;
        
    case 'stock-card':
        $data['data'] = [
            "product" => ["id" => "SP001", "name" => "Sữa đặc Ông Thọ"],
            "period" => ["start" => "2023-11-01", "end" => "2023-11-30"],
            "summary" => ["opening" => 10, "closing" => 14],
            "history" => [
                ["date" => "01/11/2023", "ref" => "-", "desc" => "Tồn đầu kỳ", "in" => 0, "out" => 0, "balance" => 10, "user" => "Hệ thống"],
                ["date" => "05/11/2023", "ref" => "PNK-001", "desc" => "Nhập mua từ NCC ABC", "in" => 10, "out" => 0, "balance" => 20, "user" => "Thủ kho A"],
                ["date" => "10/11/2023", "ref" => "PXK-002", "desc" => "Xuất bán cho Đại lý K", "in" => 0, "out" => 4, "balance" => 16, "user" => "Thủ kho B"],
                ["date" => "15/11/2023", "ref" => "PCK-001", "desc" => "Chuyển sang Kho B", "in" => 0, "out" => 2, "balance" => 14, "user" => "Thủ kho A"]
            ]
        ];
        break;
        
    case 'bin-location':
        $data['data'] = [
            "zone" => "Khu vực A (Kệ sắt)",
            "racks" => [
                [
                    "title" => "Kệ A",
                    "tiers" => [
                        ["level" => 3, "bins" => [
                            ["id" => "A-3-1", "status" => "empty", "item" => null],
                            ["id" => "A-3-2", "status" => "occupied", "item" => "SP002"],
                            ["id" => "A-3-3", "status" => "full", "item" => "SP005"],
                            ["id" => "A-3-4", "status" => "full", "item" => "SP005"]
                        ]],
                        ["level" => 2, "bins" => [
                            ["id" => "A-2-1", "status" => "occupied", "item" => "SP001"],
                            ["id" => "A-2-2", "status" => "occupied", "item" => "SP005", "is_pick" => true],
                            ["id" => "A-2-3", "status" => "empty", "item" => null],
                            ["id" => "A-2-4", "status" => "occupied", "item" => "SP007"]
                        ]],
                        ["level" => 1, "bins" => [
                            ["id" => "A-1-1", "status" => "full", "item" => "SP010"],
                            ["id" => "A-1-2", "status" => "full", "item" => "SP010"],
                            ["id" => "A-1-3", "status" => "full", "item" => "SP010"],
                            ["id" => "A-1-4", "status" => "full", "item" => "SP010"]
                        ]]
                    ]
                ]
            ]
        ];
        break;
        
    case 'reports':
        $data['data'] = [
            "inventory_value" => 1250000000,
            "aging_stock_percent" => 25,
            "top_movers" => [
                ["item" => "Sữa bột Vinamilk", "growth" => "+20%", "type" => "increase", "qty" => 250],
                ["item" => "Nước khoáng Aquafina", "growth" => "+5%", "type" => "increase", "qty" => 60],
                ["item" => "Bánh quy kẹp kem", "growth" => "-15%", "type" => "decrease", "qty" => -30],
                ["item" => "Khẩu trang y tế", "growth" => "Tồn ế", "type" => "dead", "qty" => 0]
            ]
        ];
        break;

    default:
        $data['message'] = "Placeholder data for endpoint: " . $url;
        break;
}

echo json_encode($data);
?>
