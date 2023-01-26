const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const cathcAsyncErrors = require("../middleware/catchAsyncError");
const { SendToken } = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const ApiFeatures = require("../utils/apiFeatueres");
const registerUser = cathcAsyncErrors(async (req, res)=>{
      
    const {name, email, password} = req.body;
    const user = await User.create({
        name, 
        email,
        password,
        // this is temparory avatar.
        avatar: {
            public_id: "This is sample id",
            url: "profilepicurl"
        }
    });
        SendToken(user, 201, res);
});

const loginUser = cathcAsyncErrors(async (req, res, next)=>{
   const {email, password} = req.body;
   // checking if user has given password and email both
   if(!email || !password){
    return next(new ErrorHandler("Please enter Email & password", 400));
   }
   const user = await User.findOne({email}).select("+password");//here we are checking both with the help of select caz we did 'select:false' in password field.
   if(!user){
    return next(new ErrorHandler("Invalid email or password", 401));
   }
   const isPasswordMatched = user.comparePassword(password);
   if(!isPasswordMatched){
    return next(new ErrorHandler("Invalid email or password", 401));
   }
//    const token = user.getJWTToken();
//    res.status(200).json({ // 200 means successfully
//     success: true,
//     token,
//    }) // Instead of this following small code we can use

    SendToken(user, 200, res);
     

})

const logout = cathcAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  });

  //reset forget  password
  const forgotPassword = cathcAsyncErrors(async function(req,res,next){
     const user = await User.findOne({email: req.body.email});

     if(!user){
        return next (new ErrorHandler("User is not found", 404));
     }

    //Get reset password token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/Ecommerce/api/v1/user/resetPassword/${resetToken}`;
    
    const message = `Your password reset Token is :-\n\n${resetPasswordUrl}\n\n If you have not requested this email then please ignore it. :)`
    
    try{
        await sendEmail({
            email: user.email,
            subject: "Ecommerce password recovery.",
            message
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    }catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message, 500));
    }

});
// reset password when we forgot password.
const resetPassword = cathcAsyncErrors(async (req, res, next)=>{
    //creating token hash
    const resetPasswordToken = crypto
          .createHash("sha256")
          .update(req.params.token)
          .digest("hex");
    
          const user = await User.findOne({
                resetPasswordToken,
                resetPasswordExpire: {$gt: Date.now()},
          });
          if(!user){
            return next(new ErrorHandler("Reset Password token is invalid OR token has been expired", 400));
          }
          if(req.body.password !== req.body.confirmPassword){
            return next(new ErrorHandler("Password does not match write again", 400));
          }
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          await user.save();
          SendToken(user, 200, res);
});

  // update password

  const updatePassword = cathcAsyncErrors(async(req, res, next)=>{

    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("old password is incorrect", 400));
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("password does not match Please try again. :(", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    res.status(200).json({
        message: "password is updated successfully. please relogin",
        user, 
    });
    //sendToken(user, 200, res);
    
  })

  //  only user can see it's own details
const getUserDetails = cathcAsyncErrors(async(req, res)=>{
      const user = await User.findById(req.user.id);
      res.status(200).json({
        success: true,
        user
      });
});

// Update user profile
const updateProfile = cathcAsyncErrors(async(req, res)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }
    // we will add cloudinary later for avtar
    const updatedUser = await User.findByIdAndUpdate(req.user.id,newUserData , 
        {
         new: true,
         runValidators:true,
         useFindAndModify: false
    }
    );
    //console.log(user);

       //await updatedUser.save();
    res.status(200).json({
        success: true,
        updatedUser,
    })
 // message: "Profile updated successfully.",
        
 })
 //-------------------------------------------
//  following actions are handle by only admin
const  getAllUsers = cathcAsyncErrors(async(req, res, next)=>{
    const resultPerPage = 3;

    const apifeatueres = new ApiFeatures(User.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    const users = await apifeatueres.query;

    if(!users){
        return next(new ErrorHandler("Users not found.", 404))
    }
    res.status(200).json({
        success: true,
        message: "All users List",
        users
    });
});

//get one user by id -admin

const getUserById = cathcAsyncErrors(async(req, res, next)=>{
      const user = await User.findById(req.params.id);
      if(!user){
        return next(
            new ErrorHandler(`User does not exist with id: ${req.params.id}`, 400)
        );
      }
      res.status(200).json({
        success: true,
        user,
      })
});

// Update user profile
const updateUserRole = cathcAsyncErrors(async(req, res, next)=>{
    const user = await User.findById(req.params.id);
     if(!user){
        return next(new ErrorHandler("user is not found", 404))
     }
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    
    const updatedUser = await User.findByIdAndUpdate(req.params.id,newUserData , 
        {
         new: true,
         runValidators:true,
         useFindAndModify: false
      }
    );
    res.status(200).json({
        success: true,
        updatedUser,
    })     
 })
 // delete user

 const deleteUser = cathcAsyncErrors(async(req, res, next)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user is not found`, 404))
    }
    res.status(200).json({
        success: true,
    });
 });


module.exports = {registerUser, loginUser, logout, forgotPassword, 
                  resetPassword,updatePassword, getUserDetails, getAllUsers,
                   getUserById, updateProfile,updateUserRole, deleteUser
                 };
