const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");


const App = express();

dotenv.config();
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
    console.log("connected to database");
})
.catch(err => {
    console.log("error!!");
    console.log(err);
});

App.use('/user', userRouter);

App.listen(5000, () => {
    console.log("Hello World");
});