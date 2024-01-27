const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require("xss-clean");

const authRouter = require("./src/routes/auth.route");
const userLoginRouter = require("./src/routes/userLogin.route");
const productGroupRouter = require("./src/routes/productGroup.route");
const trademarkRouter = require("./src/routes/trademark.route");
const productRouter = require("./src/routes/product.route")
const AppError = require("./src/helpers/AppError");
const app = express();
app.use(cors());

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());


app.use('/api/auth', authRouter);
app.use('/api/userLogin', userLoginRouter);
app.use('/api/productGroups', productGroupRouter);
app.use('/api/trademarks', trademarkRouter);
app.use('/api/products', productRouter);

app.all('*',(req,res,next) => {
  next(new AppError('Url Not Found!!!', 404));
});

//middleware dùng để xử lý lỗi global
app.use((error,req,res,next) => {
  if(!error.status) {
      console.log(error);
  }
  res
      .status(error.statusCode || 500)
      .json({
          status: error.status || 'error',
          message: error.message,
          error: error.error
      })
});
module.exports = app;