const ErrorHandeler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
  

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
  
    if (!token) {
      return next(new ErrorHandeler("Please Login to access this resource", 401));
    }
  
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
    req.user = await User.findById(decodedData.id);
  
    next();
  });
  
  exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandeler(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
      next();
    };
  };
  