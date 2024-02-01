module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next) 
      .catch(error => {
        next(error)
      })
  }
}

// module.exports = fn => {
//   return (req, res, next) => {
//     const result = fn(req, res, next);
//     if (result && typeof result.catch === 'function') {
//       result.catch(error => {
//         next(error);
//       });
//     }
//   }
// }