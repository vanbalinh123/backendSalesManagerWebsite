const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = require('./app');

mongoose
    // .connect(process.env.DATABASE)
    .connect(process.env.URL)
    .then(() => console.log('DB connection is successfully!'))
    .catch(error => console.log(error))

const port = process.env.PORT;
app.listen(port,() => {
    console.log(`App is running on port ${port}`);
});
