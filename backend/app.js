const bodyParser = require("body-parser");
const express = require("express");
const erroMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

//Routes Imports:
//const product = require("./routes/productRoute");
//app.use("api/v1", product)

require("./routes/productRoute")(app);
require("./routes/userRoute")(app);
require("./routes/reviewRoute")(app);


// middleware for error

app.use(erroMiddleware);



module.exports = app;