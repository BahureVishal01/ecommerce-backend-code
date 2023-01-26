const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next)=>{
 err.statusCode = err.statusCode || 500;
 err.message = err.message || "Internal server error";

//Wrong Mongodb id error

if(err.name === "CastError"){
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
}

//Mongoose duplicate key error
if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered.`;
    err = new ErrorHandler(message, 400);
}

// wrong jwt error
if(err.name === "JsonWebTokenError"){
    const message = `Json Web Token is Invalid, Please try again. :(`;
    err = new ErrorHandler(message, 400);
}

// JWT expire error
  if(err.name === "TokenExpiredError"){
  const message = `Json web token is Expired, Please Try again :(`;
  err = new ErrorHandler(message, 400);
  }
  // //reset Password token invalid
  // if(err.name = "resetPasswordTokenError"){
  //   const message = `Reset password token is Invalid please try again. :(`;
  //   err = new ErrorHandler(message, 400);
  // }

 res.status(err.statusCode).json({
    success: false,
    error:err.message,
   error:err.stack // for path where is error.
  // error: err
   
 })
}
