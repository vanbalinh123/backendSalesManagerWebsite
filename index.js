const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const authenticateJWT = require('./middlewares/authenticateJWT');
const e = require('express');
const port = 3100;

app.use(cors());
app.use(express.json());

function nextId(list) {
  // const maxId = list[list.length - 1].id;
  // return maxId + 1
  if (list.length === 0) {
    return 1;
  } else {
    const maxId = list[list.length - 1].id;
    return maxId + 1;
  }
}

const users = [
  {
    id: 1, username: 'Van Ba Linh', email: 'vanbalinh080102@gmail.com', password: 'Linh123',
    products: [
      { id: 1, name: "Chuot sin", code: 'A1', productGroups: "Mouse", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn.tgdd.vn/Products/Images/86/233777/chuot-khong-day-rapoo-m10-plus-trang-1-org.jpg" },
      { id: 2, name: "Ban phim sin", code: 'A2', productGroups: "Keyboard", trademark: "Samsung", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://vcdn1-sohoa.vnecdn.net/2020/06/10/leopold-fc980c-1591758531.jpg?w=900&h=540&q=100&dpr=1&fit=crop&s=UPQyQReNkm3kBUV89A_t8A" },
      { id: 3, name: "Loa sin", code: 'A3', productGroups: "Loudspeaker", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn.tgdd.vn/Products/Images/2162/235205/bluetoth-jbl-charge-4-den-1-org.jpg" },
      { id: 4, name: "Man hinh sin", code: 'A4', productGroups: "Screen", trademark: "Xiaomi", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://manhinhmaytinhcu.net/wp-content/uploads/2021/05/man-hinh-dell-p2419h-cu.jpg" },
      { id: 5, name: "Ipad sin", code: 'A5', productGroups: "iPads", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn2.cellphones.com.vn/x358,webp,q100/media/catalog/product/i/p/ipad-2022-hero-blue-wifi-select.png" },
      { id: 6, name: "May tinh sin", code: 'A6', productGroups: "Computers", trademark: "Samsung", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/laptop/May-tinh-de-ban-11.jpg" },
      { id: 7, name: "Day cap sin", code: 'A7', productGroups: "Cables", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://binhminhdigital.com/storedata/images/product/day-cap-ket-noi-may-anh-canon-voi-may-tinh.jpg" },
      { id: 8, name: "Laptop sin", code: 'A8', productGroups: "Laptops", trademark: "Xiaomi", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4LqQX?ver=fe80&q=90&m=6&h=705&w=1253&b=%23FFFFFFFF&f=jpg&o=f&p=140&aim=true" },
      { id: 9, name: "Chuot sin 2", code: 'A9', productGroups: "Mouse", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn.tgdd.vn/Products/Images/86/233777/chuot-khong-day-rapoo-m10-plus-trang-1-org.jpg" },
      { id: 10, name: "Ban phim sin 2", code: 'A10', productGroups: "Keyboard", trademark: "Samsung", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://vcdn1-sohoa.vnecdn.net/2020/06/10/leopold-fc980c-1591758531.jpg?w=900&h=540&q=100&dpr=1&fit=crop&s=UPQyQReNkm3kBUV89A_t8A" },
      { id: 11, name: "Loa sin 2", code: 'A11', productGroups: "Loudspeaker", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn.tgdd.vn/Products/Images/2162/235205/bluetoth-jbl-charge-4-den-1-org.jpg" },
      { id: 12, name: "Man hinh sin 2", code: 'A12', productGroups: "Screen", trademark: "Xiaomi", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://manhinhmaytinhcu.net/wp-content/uploads/2021/05/man-hinh-dell-p2419h-cu.jpg" },
      { id: 13, name: "Ipad sin 2", code: 'A13', productGroups: "iPads", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn2.cellphones.com.vn/x358,webp,q100/media/catalog/product/i/p/ipad-2022-hero-blue-wifi-select.png" },
      { id: 14, name: "May tinh sin 2", code: 'A14', productGroups: "Computers", trademark: "Samsung", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/laptop/May-tinh-de-ban-11.jpg" },
      { id: 15, name: "Day cap sin 2", code: 'A15', productGroups: "Cables", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://binhminhdigital.com/storedata/images/product/day-cap-ket-noi-may-anh-canon-voi-may-tinh.jpg" },
      { id: 16, name: "Laptop sin 2", code: 'A16', productGroups: "Laptops", trademark: "Xiaomi", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4LqQX?ver=fe80&q=90&m=6&h=705&w=1253&b=%23FFFFFFFF&f=jpg&o=f&p=140&aim=true" },
      { id: 17, name: "Chuot sin 3", code: 'A17', productGroups: "Mouse", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn.tgdd.vn/Products/Images/86/233777/chuot-khong-day-rapoo-m10-plus-trang-1-org.jpg" },
      { id: 18, name: "Ban phim sin 3", code: 'A18', productGroups: "Keyboard", trademark: "Samsung", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://vcdn1-sohoa.vnecdn.net/2020/06/10/leopold-fc980c-1591758531.jpg?w=900&h=540&q=100&dpr=1&fit=crop&s=UPQyQReNkm3kBUV89A_t8A" },
      { id: 19, name: "Loa sin 3", code: 'A19', productGroups: "Loudspeaker", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn.tgdd.vn/Products/Images/2162/235205/bluetoth-jbl-charge-4-den-1-org.jpg" },
      { id: 20, name: "Man hinh sin 3", code: 'A20', productGroups: "Screen", trademark: "Xiaomi", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://manhinhmaytinhcu.net/wp-content/uploads/2021/05/man-hinh-dell-p2419h-cu.jpg" },
      { id: 21, name: "Ipad sin 3", code: 'A21', productGroups: "iPads", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn2.cellphones.com.vn/x358,webp,q100/media/catalog/product/i/p/ipad-2022-hero-blue-wifi-select.png" },
      { id: 22, name: "May tinh sin 3", code: 'A22', productGroups: "Computers", trademark: "Samsung", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/laptop/May-tinh-de-ban-11.jpg" },
      { id: 23, name: "Day cap sin 3", code: 'A23', productGroups: "Cables", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://binhminhdigital.com/storedata/images/product/day-cap-ket-noi-may-anh-canon-voi-may-tinh.jpg" },
      { id: 24, name: "Laptop sin 3", code: 'A24', productGroups: "Laptops", trademark: "Xiaomi", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4LqQX?ver=fe80&q=90&m=6&h=705&w=1253&b=%23FFFFFFFF&f=jpg&o=f&p=140&aim=true" },
      { id: 25, name: "Chuot sin 4", code: 'A25', productGroups: "Mouse", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn.tgdd.vn/Products/Images/86/233777/chuot-khong-day-rapoo-m10-plus-trang-1-org.jpg" },
      { id: 26, name: "Chuot sin 5", code: 'A26', productGroups: "Mouse", trademark: "Samsung", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://vcdn1-sohoa.vnecdn.net/2020/06/10/leopold-fc980c-1591758531.jpg?w=900&h=540&q=100&dpr=1&fit=crop&s=UPQyQReNkm3kBUV89A_t8A" },
      { id: 27, name: "Chuot sin 6", code: 'A27', productGroups: "Mouse", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn.tgdd.vn/Products/Images/2162/235205/bluetoth-jbl-charge-4-den-1-org.jpg" },
      { id: 28, name: "Chuot sin 7", code: 'A28', productGroups: "Mouse", trademark: "Xiaomi", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://manhinhmaytinhcu.net/wp-content/uploads/2021/05/man-hinh-dell-p2419h-cu.jpg" },
      { id: 29, name: "Chuot sin 8", code: 'A29', productGroups: "Mouse", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn2.cellphones.com.vn/x358,webp,q100/media/catalog/product/i/p/ipad-2022-hero-blue-wifi-select.png" },
      { id: 30, name: "Chuot sin 9", code: 'A30', productGroups: "Mouse", trademark: "Samsung", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/laptop/May-tinh-de-ban-11.jpg" },
      { id: 31, name: "Chuot sin 10", code: 'A31', productGroups: "Mouse", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://binhminhdigital.com/storedata/images/product/day-cap-ket-noi-may-anh-canon-voi-may-tinh.jpg" },
      { id: 32, name: "Chuot sin 11", code: 'A32', productGroups: "Mouse", trademark: "Xiaomi", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4LqQX?ver=fe80&q=90&m=6&h=705&w=1253&b=%23FFFFFFFF&f=jpg&o=f&p=140&aim=true" },
    ],
    productGroups: [
      { id: 1, name: "Mouse" },
      { id: 2, name: "Keyboard" },
      { id: 3, name: "Loudspeaker" },
      { id: 4, name: "Screen" },
      { id: 5, name: "iPads" },
      { id: 6, name: "Computers" },
      { id: 7, name: "Cables" },
      { id: 8, name: "Laptops" },
    ],
    trademark: [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Samsung' },
      { id: 3, name: 'Asus' },
      { id: 4, name: 'Xiaomi' },
      { id: 5, name: 'MSI' },
      { id: 6, name: 'Acer' },
      { id: 7, name: 'HP' },
      { id: 8, name: 'Dell' },
    ],
    returnsCoupon: [
      {
        id: 1, nameUserReturn: 'Linh',
        codeReturn: 'RT1',
        status: 'Return',
        codeImport: 'IP1',
        note: 'Hàng kém chất lượng',
        date: {
          day: '01',
          month: '10',
          year: '2022'
        },
        totalCost: 120000,
        productsReturned: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
        ]
      },
      {
        id: 2, nameUserReturn: 'Linh',
        codeReturn: 'RT2',
        codeImport: 'IP2',
        status: 'Return',
        note: 'Hàng kém chất lượng',
        date: {
          day: '02',
          month: '11',
          year: '2022'
        },
        totalCost: 120000,
        productsReturned: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
        ]
      },
      {
        id: 3, nameUserReturn: 'Linh',
        codeReturn: 'RT3',
        codeImport: 'IP3',
        status: 'Return',
        note: 'Hàng kém chất lượng',
        date: {
          day: '03',
          month: '12',
          year: '2022'
        },
        totalCost: 120000,
        productsReturned: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
        ]
      },
      {
        id: 4, nameUserReturn: 'Linh',
        codeReturn: 'RT4',
        codeImport: 'IP4',
        status: 'Return',
        note: 'Hàng kém chất lượng',
        date: {
          day: '04',
          month: '01',
          year: '2023'
        },
        totalCost: 120000,
        productsReturned: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
        ]
      },
      {
        id: 5, nameUserReturn: 'Linh',
        codeReturn: 'RT5',
        codeImport: 'IP5',
        status: 'Return',
        note: 'Hàng kém chất lượng',
        date: {
          day: '05',
          month: '02',
          year: '2023'
        },
        totalCost: 120000,
        productsReturned: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
        ]
      },
      {
        id: 6, nameUserReturn: 'Linh',
        codeReturn: 'RT6',
        codeImport: 'IP6',
        status: 'Return',
        note: 'Hàng kém chất lượng',
        date: {
          day: '06',
          month: '03',
          year: '2023'
        },
        totalCost: 120000,
        productsReturned: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
        ]
      },
      {
        id: 7, nameUserReturn: 'Linh',
        codeReturn: 'RT7',
        codeImport: 'IP7',
        status: 'Return',
        note: 'Hàng kém chất lượng',
        date: {
          day: '07',
          month: '04',
          year: '2023'
        },
        totalCost: 120000,
        productsReturned: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
        ]
      },
      {
        id: 8, nameUserReturn: 'Linh',
        codeReturn: 'RT8',
        codeImport: 'IP8',
        status: 'Return',
        note: 'Hàng kém chất lượng',
        date: {
          day: '08',
          month: '05',
          year: '2023'
        },
        totalCost: 120000,
        productsReturned: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
        ]
      },
      {
        id: 9, nameUserReturn: 'Linh',
        codeReturn: 'RT9',
        codeImport: 'IP9',
        status: 'Return',
        note: 'Hàng kém chất lượng',
        date: {
          day: '09',
          month: '06',
          year: '2023'
        },
        totalCost: 120000,
        productsReturned: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
        ]
      },
      {
        id: 10, nameUserReturn: 'Linh',
        codeReturn: 'RT10',
        codeImport: 'IP10',
        status: 'Return',
        note: 'Hàng kém chất lượng',
        date: {
          day: '10',
          month: '07',
          year: '2023'
        },
        totalCost: 120000,
        productsReturned: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
        ]
      },
      {
        id: 11, nameUserReturn: 'Linh',
        codeReturn: 'RT11',
        codeImport: 'IP11',
        status: 'Return',
        note: 'Hàng kém chất lượng',
        date: {
          day: '11',
          month: '08',
          year: '2023'
        },
        totalCost: 120000,
        productsReturned: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
        ]
      },
      {
        id: 12, nameUserReturn: 'Linh',
        codeReturn: 'RT12',
        codeImport: 'IP12',
        status: 'Return',
        note: 'Hàng kém chất lượng',
        date: {
          day: '12',
          month: '08',
          year: '2023'
        },
        totalCost: 120000,
        productsReturned: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: '3',
            cost: '20000',
            total: 60000
          },
        ]
      },
    ], 
    importCoupon: [
      {
        id: 1, nameUserImport: 'Linh',
        codeImport: 'IP1',
        status: 'Import',
        note: 'okee',
        date: {
          day: '01',
          month: '10',
          year: '2022'
        },
        totalCost: 800000,
        productsImported: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A3', name: 'Loa sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A4', name: 'Man hinh sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          }
        ]
      },
      {
        id: 2, nameUserImport: 'Linh',
        codeImport: 'IP2',
        status: 'Import',
        note: 'okee',
        date: {
          day: '02',
          month: '11',
          year: '2022'
        },
        totalCost: 800000,
        productsImported: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A3', name: 'Loa sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A4', name: 'Man hinh sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          }
        ]
      },
      {
        id: 3, nameUserImport: 'Linh',
        codeImport: 'IP3',
        status: 'Import',
        note: 'okee',
        date: {
          day: '03',
          month: '12',
          year: '2022'
        },
        totalCost: 800000,
        productsImported: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A3', name: 'Loa sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A4', name: 'Man hinh sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          }
        ]
      },
      {
        id: 4, nameUserImport: 'Linh',
        codeImport: 'IP4',
        status: 'Import',
        note: 'okee',
        date: {
          day: '04',
          month: '01',
          year: '2023'
        },
        totalCost: 800000,
        productsImported: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A3', name: 'Loa sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A4', name: 'Man hinh sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          }
        ]
      },
      {
        id: 5, nameUserImport: 'Linh',
        codeImport: 'IP5',
        status: 'Import',
        note: 'okee',
        date: {
          day: '05',
          month: '02',
          year: '2023'
        },
        totalCost: 800000,
        productsImported: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A3', name: 'Loa sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A4', name: 'Man hinh sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          }
        ]
      },
      {
        id: 6, nameUserImport: 'Linh',
        codeImport: 'IP6',
        status: 'Import',
        note: 'okee',
        date: {
          day: '06',
          month: '03',
          year: '2023'
        },
        totalCost: 800000,
        productsImported: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A3', name: 'Loa sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A4', name: 'Man hinh sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          }
        ]
      },
      {
        id: 7, nameUserImport: 'Linh',
        codeImport: 'IP7',
        status: 'Import',
        note: 'okee',
        date: {
          day: '07',
          month: '04',
          year: '2023'
        },
        totalCost: 800000,
        productsImported: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A3', name: 'Loa sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A4', name: 'Man hinh sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          }
        ]
      },
      {
        id: 8, nameUserImport: 'Linh',
        codeImport: 'IP8',
        status: 'Import',
        note: 'okee',
        date: {
          day: '08',
          month: '05',
          year: '2023'
        },
        totalCost: 800000,
        productsImported: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A3', name: 'Loa sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A4', name: 'Man hinh sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          }
        ]
      },
      {
        id: 9, nameUserImport: 'Linh',
        codeImport: 'IP9',
        status: 'Import',
        note: 'okee',
        date: {
          day: '09',
          month: '06',
          year: '2023'
        },
        totalCost: 800000,
        productsImported: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A3', name: 'Loa sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A4', name: 'Man hinh sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          }
        ]
      },
      {
        id: 10, nameUserImport: 'Linh',
        codeImport: 'IP10',
        status: 'Import',
        note: 'okee',
        date: {
          day: '10',
          month: '07',
          year: '2023'
        },
        totalCost: 800000,
        productsImported: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A3', name: 'Loa sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A4', name: 'Man hinh sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          }
        ]
      },
      {
        id: 11, nameUserImport: 'Linh',
        codeImport: 'IP11',
        status: 'Import',
        note: 'okee',
        date: {
          day: '11',
          month: '08',
          year: '2023'
        },
        totalCost: 800000,
        productsImported: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A3', name: 'Loa sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A4', name: 'Man hinh sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          }
        ]
      },
      {
        id: 12, nameUserImport: 'Linh',
        codeImport: 'IP12',
        status: 'Import',
        note: 'okee',
        date: {
          day: '12',
          month: '08',
          year: '2023'
        },
        totalCost: 800000,
        productsImported: [
          {
            code: 'A1', name: 'Chuot sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A2', name: 'Ban phim sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A3', name: 'Loa sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          },
          {
            code: 'A4', name: 'Man hinh sin',
            quantity: "10",
            cost: '20000',
            total: 200000,
          }
        ]
      },
    ]
  },
  {
    id: 2, username: 'Le Loc', email: 'leloc@gmail.com', password: 'Loc123',
    products: [
      { id: 1, name: "Chuot sin", code: 'A12', productGroups: "Mouse", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn.tgdd.vn/Products/Images/86/233777/chuot-khong-day-rapoo-m10-plus-trang-1-org.jpg" },
      { id: 2, name: "Ban phim sin", code: 'A13', productGroups: "Keyboard", trademark: "Samsung", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://vcdn1-sohoa.vnecdn.net/2020/06/10/leopold-fc980c-1591758531.jpg?w=900&h=540&q=100&dpr=1&fit=crop&s=UPQyQReNkm3kBUV89A_t8A" },
      { id: 3, name: "Loa sin", code: 'A14', productGroups: "Loudspeaker", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn.tgdd.vn/Products/Images/2162/235205/bluetoth-jbl-charge-4-den-1-org.jpg" },
      { id: 4, name: "Man hinh sin", code: 'A15', productGroups: "Screen", trademark: "Xiaomi", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://manhinhmaytinhcu.net/wp-content/uploads/2021/05/man-hinh-dell-p2419h-cu.jpg" },
      { id: 5, name: "Ipad sin", code: 'A16', productGroups: "iPads", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn2.cellphones.com.vn/x358,webp,q100/media/catalog/product/i/p/ipad-2022-hero-blue-wifi-select.png" },
      { id: 6, name: "May tinh sin", code: 'A17', productGroups: "Computers", trademark: "Samsung", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://hc.com.vn/i/ecommerce/media/ckeditor_3416865.jpg" },
      { id: 7, name: "Day cap sin", code: 'A18', productGroups: "Cables", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://binhminhdigital.com/storedata/images/product/day-cap-ket-noi-may-anh-canon-voi-may-tinh.jpg" },
      { id: 8, name: "Laptop sin", code: 'A19', productGroups: "Laptops", trademark: "Xiaomi", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4LqQX?ver=fe80&q=90&m=6&h=705&w=1253&b=%23FFFFFFFF&f=jpg&o=f&p=140&aim=true" },
    ],
    productGroups: [
      { id: 1, name: "Mouse" },
      { id: 2, name: "Keyboard" },
      { id: 3, name: "Loudspeaker" },
      { id: 4, name: "Screen" },
      { id: 5, name: "iPads" },
      { id: 6, name: "Computers" },
      { id: 7, name: "Cables" },
      { id: 8, name: "Laptops" },
    ],
    trademark: [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Samsung' },
      { id: 3, name: 'Asus' },
      { id: 4, name: 'Xiaomi' },
      { id: 5, name: 'MSI' },
      { id: 6, name: 'Acer' },
      { id: 7, name: 'HP' },
      { id: 8, name: 'Dell' },
    ]
  },
]

app.get('/', (req, res) => {
  res.send('LetDiv');
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(422).json({ message: 'Your email has been registered!' });
  }

  const newUserId = nextId(users);

  const newUser = {
    id: newUserId,
    username,
    email,
    password,
    avatar: '',
    products: [],
    productGroups: [],
    trademark: [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Samsung' },
      { id: 3, name: 'Asus' },
      { id: 4, name: 'Xiaomi' },
      { id: 5, name: 'MSI' },
      { id: 6, name: 'Acer' },
      { id: 7, name: 'HP' },
      { id: 8, name: 'Dell' },
    ]
  };
  users.push(newUser);

  res.status(201).json({ message: 'You have successfully registered an account!' });
})

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const target = users.find(item => item.email === email && item.password === password);
  if (target) {
    const userLogin = {
      id: target.id
    }
    const accessToken = jwt.sign(userLogin, process.env.JWT_SECRET_KEY, { expiresIn: '180 days' });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
});

app.get('/userLogin', authenticateJWT, (req, res) => {
  const { id } = req.user;
  const user = users.find((user) => user.id === id);
  const userLogin = {
    id: user.id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
  }

  res.json(userLogin);
});

app.get('/products', authenticateJWT, (req, res) => {
  const { id } = req.user;
  const { name, code, productGroups, trademark, page } = req.query;
  const userProducts = users.find((u) => u.id === id)?.products || [];
  let filteredProducts = userProducts;
  if (name || code) {
    filteredProducts = filteredProducts.filter(item =>
      (name && item.name.toLowerCase().includes(name.toLowerCase())) ||
      (code && item.code.toLowerCase().includes(code.toLowerCase()))
    );
  }

  if (productGroups) {
    filteredProducts = filteredProducts.filter(item => item.productGroups.toLowerCase() === productGroups.toLowerCase());
  }

  if (trademark) {
    filteredProducts = filteredProducts.filter(item => item.trademark.toLowerCase() === trademark.toLowerCase());
  }

  const productsPerPage = 10;
  const totalProducts = filteredProducts.length;
  const currentPage = Number(page) || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const startIndex = currentPage * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const productsForPage = filteredProducts.slice(startIndex, endIndex);

  res.json({
    currentPage,
    totalPages,
    productsPerPage,
    totalProducts,
    products: productsForPage,
  });

  // res.json(filteredProducts);
});

app.post('/products/add', authenticateJWT, (req, res) => {
  const { id } = req.user;
  const target = users.find(item => item.id === id);
  const { name, code, productGroups, trademark, quantity, describe, cost, price, img, dateAdd } = req.body;

  const exist = target.products.find(item => item.code === code);


  if (exist === undefined) {
    const newProduct = {
      id: nextId(target.products),
      name,
      code,
      productGroups,
      trademark,
      quantity,
      describe,
      cost,
      price,
      img,
    };
    target.products.push(newProduct);

    res.status(201).json({ message: 'Product added successfully!' });
  } else {
    return res.status(422).json({ message: 'Error!!! Code of product is existed!' });
  }
});

app.post('/product/update', authenticateJWT, (req, res) => {
  const { id: idUser } = req.user;
  const { id, name, code, productGroups, trademark, quantity, describe, cost, price, img } = req.body;
  const target = users.find(item => item.id === idUser);
  const product = target.products.find(item => item.id === id);
  const exist = target.products.find(item => item.code === code);

  if (exist === undefined || product.code === code) {
    product.name = name;
    product.code = code;
    product.productGroups = productGroups;
    product.trademark = trademark;
    product.quantity = quantity;
    product.describe = describe;
    product.cost = cost;
    product.price = price;
    product.img = img;
  } else {
    return res.status(422).json({ message: 'Error!!! Code of product is existed!' });
  }

  res.status(200).json({ message: 'Product updated successfully!' });
})

app.delete('/product/delete/:id', authenticateJWT, (req, res) => {
  const { id: idUser } = req.user;
  const { id: idProduct } = req.params;
  const target = users.find(item => item.id === idUser);

  const deletedIndex = target.products.findIndex(item => item.id === Number(idProduct));

  if (deletedIndex !== -1) {
    const deletedItem = target.products.splice(deletedIndex, 1)[0];
    res.json(deletedItem);
  } else {
    res.sendStatus(404);
  }
})


app.get('/productGroups', authenticateJWT, (req, res) => {
  const { id } = req.user;
  const name = req.query.name;
  const userProductGroups = users.find(u => u.id === id)?.productGroups;

  let filteredProductGroups = userProductGroups;

  if (name) {
    filteredProductGroups = filteredProductGroups.filter(group =>
      group.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  res.json(filteredProductGroups);
});

app.post('/productGroups/add', authenticateJWT, (req, res) => {
  const { id } = req.user;
  const target = users.find(item => item.id === id);
  const { nameProductGroup } = req.body;

  // if (!target.productGroups) {
  //   target.productGroups = [];
  // }

  const exist = target.productGroups.find(item => item.name === nameProductGroup)

  if (exist === undefined) {
    const newProductGroup = {
      id: nextId(target.productGroups),
      name: nameProductGroup
    }
    target.productGroups.push(newProductGroup);

    res.json(newProductGroup);
  } else {
    return res.status(422).json({ message: 'Error!!! Your Product Groups is existed!' });
  }
})

app.post('/productGroups/update', authenticateJWT, (req, res) => {
  const { id: idUser } = req.user;
  const { id: idProductGroup, name: nameProductGroup } = req.body;

  const target = users.find(item => item.id === idUser);
  const productGroup = target.productGroups.find(item => item.id === idProductGroup);
  const exist = target.productGroups.find(item => item.name === nameProductGroup);

  if (exist === undefined || productGroup.name === nameProductGroup) {
    productGroup.name = nameProductGroup;
  } else {
    return res.status(422).json({ message: 'Error!!! Name of product group is existed!' });
  }

  res.status(200).json({ message: 'Product group updated successfully!' });
})

app.delete('/productGroup/delete/:id', authenticateJWT, (req, res) => {
  const { id: idUser } = req.user;
  const { id: idProductGroup } = req.params;
  const target = users.find(item => item.id === idUser);

  const deletedIndex = target.productGroups.findIndex(item => item.id === Number(idProductGroup));

  if (deletedIndex !== -1) {
    const deletedItem = target.productGroups.splice(deletedIndex, 1)[0];
    res.json(deletedItem);
  } else {
    res.sendStatus(404);
  }
})

//trademark
app.get('/trademark', authenticateJWT, (req, res) => {
  const { id } = req.user;
  const userTrademark = users.find(u => u.id === id)?.trademark || [];
  res.json(userTrademark)
});

//warehouse
app.get('/importCoupon', authenticateJWT, (req, res) => {
  const { id } = req.user;
  const { code, page, day, month, year } = req.query;
  const imported = users.find(u => u.id === id)?.importCoupon || [];
  let filterImported = imported;
  if (code) {
    filterImported = filterImported.filter(item =>
      item.codeImport.toLowerCase().includes(code.toLowerCase())
    );
  }

  if(day) {
    filterImported = filterImported.filter(item => item.date.day === day);
  }

  if(month) {
    filterImported = filterImported.filter(item => item.date.month === month);
  }

  if(year) {
    filterImported = filterImported.filter(item => item.date.year === year);
  }

  const importPerPage = 10;
  const totalImport = filterImported.length;
  const currentPage = Number(page) || 0;
  const totalPages = Math.ceil(totalImport / importPerPage)

  const startIndex = currentPage * importPerPage;
  const endIndex = startIndex + importPerPage;

  const importForPage = filterImported.slice(startIndex, endIndex)

  res.json({
    import: importForPage,
    currentPage,
    totalPages,
    importPerPage,
    totalImport
  })
});

app.post('/importCoupon/add', authenticateJWT, (req, res) => {
  const { id } = req.user;
  const target = users.find(item => item.id === id);
  const {nameUserImport, status, note, date, totalCost, productsImported} = req.body;
  
  const newImport = {
    id: nextId(target?.importCoupon),
    nameUserImport: nameUserImport,
    codeImport:  'IP' + nextId(target?.importCoupon),
    status: status,
    note: note,
    date: {
      day: date.day,
      month: date.month,
      year: date.year
    },
    totalCost: totalCost,
    productsImported: productsImported
  }

  target?.importCoupon.push(newImport)
  // res.status(201).json({ message: 'Imported successfully!' });
  res.json(newImport)
})


//return
app.get('/returnCoupon', authenticateJWT, (req, res) => {
  const { id } = req.user;
  const { code, page, day, month, year } = req.query;
  const retunted = users.find(u => u.id === id)?.returnsCoupon || [];
  let filterReturn = retunted;
  if (code) {
    filterReturn = filterReturn.filter(item =>
      item.codeReturn.toLowerCase().includes(code.toLowerCase())
    );
  }

  if(day) {
    filterReturn = filterReturn.filter(item => item.date.day === day);
  }

  if(month) {
    filterReturn = filterReturn.filter(item => item.date.month === month);
  }

  if(year) {
    filterReturn = filterReturn.filter(item => item.date.year === year);
  }

  const returnPerPage = 10;
  const totalReturn = filterReturn.length;
  const currentPage = Number(page) || 0;
  const totalPages = Math.ceil(totalReturn / returnPerPage)

  const startIndex = currentPage * returnPerPage;
  const endIndex = startIndex + returnPerPage;

  const returnForPage = filterReturn.slice(startIndex, endIndex)

  res.json({
    return: returnForPage,
    currentPage,
    totalPages,
    returnPerPage,
    totalReturn
  })
});

app.post('/returnCoupon/add', authenticateJWT, (req, res) => {
  const { id } = req.user;
  const target = users.find(item => item.id === id);
  const {
    nameUserReturn, status, note, codeImport, 
    date, totalCost, productsReturned
  } = req.body;
  
  const newReturn = {
    id: nextId(target?.returnsCoupon),
    nameUserReturn: nameUserReturn,
    codeImport:  codeImport,
    codeReturn: 'RT' + nextId(target?.returnsCoupon),
    status: status,
    note: note,
    date: {
      day: date.day,
      month: date.month,
      year: date.year
    },
    totalCost: totalCost,
    productsReturned: productsReturned
  }

  target?.returnsCoupon.push(newReturn)
  // res.status(201).json({ message: 'Imported successfully!' });
  res.json(newReturn)
})


app.listen(port, () => {
  console.log(`LetDiv app listening on port ${port}`)
});