const jwt = require('jsonwebtoken');
const AppError = require('../helpers/AppError');
const catching = require('../helpers/catching');
const User = require('../models/user.model');

// const authenticateJWT = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//       const accessToken = authHeader.split(' ')[1];

//       jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, user) => {
//           if (err) {
//             return res.sendStatus(401);
//           }
//           req.user = user;
//           next();
//       });
//   } else {
//       res.sendStatus(401);
//   }
// };

// module.exports = authenticateJWT;

const authenticateJWT = catching(async (req, res, next) => {
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if(!token) {
    next(new AppError('Do not have permission', 401));
    return;
  }

  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, data) => {
      if(error) {
        reject('Token is not valid');
        return;
      }
      resolve(data);
    });
  });

  const user = await User.findById(decoded.id)
  if(!user) {
    next(new AppError('Do not have permission!', 401));
    return;
  }

  req.user = user;
  next();
});

module.exports = authenticateJWT;