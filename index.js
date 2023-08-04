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
  const maxId = list[list.length - 1].id;
  return maxId + 1
}

const users = [
  {
    id: 1, username: 'Van Ba Linh', email: 'vanbalinh080102@gmail.com', password: 'Linh123',
    products: [
      { id: 1, name: "Chuot sin", code: 'A12', productGroups: "Mouse", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn.tgdd.vn/Products/Images/86/233777/chuot-khong-day-rapoo-m10-plus-trang-1-org.jpg" },
      { id: 2, name: "Ban phim sin", code: 'A13', productGroups: "Keyboard", trademark: "Samsung", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://vcdn1-sohoa.vnecdn.net/2020/06/10/leopold-fc980c-1591758531.jpg?w=900&h=540&q=100&dpr=1&fit=crop&s=UPQyQReNkm3kBUV89A_t8A" },
      { id: 3, name: "Loa sin", code: 'A14', productGroups: "Loudspeaker", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn.tgdd.vn/Products/Images/2162/235205/bluetoth-jbl-charge-4-den-1-org.jpg" },
      { id: 4, name: "Man hinh sin", code: 'A15', productGroups: "Screen", trademark: "Xiaomi", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://manhinhmaytinhcu.net/wp-content/uploads/2021/05/man-hinh-dell-p2419h-cu.jpg" },
      { id: 5, name: "Ipad sin", code: 'A16', productGroups: "iPads", trademark: "Apple", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn2.cellphones.com.vn/x358,webp,q100/media/catalog/product/i/p/ipad-2022-hero-blue-wifi-select.png" },
      { id: 6, name: "May tinh sin", code: 'A17', productGroups: "Computers", trademark: "Samsung", quantity: "20", describe: "Sin", cost: "20000", price: "50000", img: "https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/laptop/May-tinh-de-ban-11.jpg" },
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
  const { name, code } = req.query;
  const userProducts = users.find((u) => u.id === id)?.products || [];

  let filteredProducts = userProducts;

  if (name) {
    filteredProducts = filteredProducts.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (code) {
    filteredProducts = filteredProducts.filter(item => item.code.toLowerCase() === code.toLowerCase());
  }

  res.json(filteredProducts);

});

app.post('/products/add', authenticateJWT, (req, res) => {
  const { id } = req.user;
  const target = users.find(item => item.id === id);
  const { name, code, productGroups, trademark, quantity, describe, cost, price, img } = req.body;
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
});


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

  const newProductGroup = {
    id: nextId(target.productGroups),
    name: nameProductGroup
  }
  target.productGroups.push(newProductGroup);

  res.json(newProductGroup);
})

app.get('/trademark', authenticateJWT, (req, res) => {
  const { id } = req.user;
  console.log(id)
  const userTrademark = users.find(u => u.id === id)?.trademark || [];
  res.json(userTrademark)
});


app.listen(port, () => {
  console.log(`LetDiv app listening on port ${port}`)
});