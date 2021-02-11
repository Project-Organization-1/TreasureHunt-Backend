const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");

const App = express();

dotenv.config();
const uri = process.env.ATLAS_URI;

var cors = require('cors')

App.use(cors())

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
    // useFindAndModify: false
})
    .then(() => {
    console.log("connected to database");
})
.catch(err => {
    console.log("error!!");
    console.log(err);
});

App.use(express.json());

App.use(cors(
    {
      origin: "http://localhost:3000", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
    }
));

App.use('/user', userRouter);

App.listen(5000, () => {
    console.log("Hello World");
});

module.exports = App;