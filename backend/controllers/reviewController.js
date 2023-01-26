const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const cathcAsyncErrors = require("../middleware/catchAsyncError");


// add reviews

const createProductReview = cathcAsyncErrors(async(req, res, next)=>{
    const {rating, comment, productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
        (rev)=> rev.user.toString() === req.user._id.toString()
    );
    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString()===req.user._id.toString())
            (rev.rating = rating), (rev.comment = comment);
        });

    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach((rev)=>{
        avg += rev.rating;
    })
    product.ratings = avg / product.reviews.length;

    await product.save({validateBeforeSave:false});
    
    res.status(200).json({
        success: true,
    })
});
// get all reviews of a porduct
const getProductReviews = cathcAsyncErrors(async(req, res, next)=>{
    const product = await Product.findById(req.query.id);

    if(!product){ 
        return next(new ErrorHandler("Product is not found.", 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});


const deleteReview = cathcAsyncErrors(async(req, res, next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("product is not found.", 404));
    }
    const reviews = product.reviews.filter(
        (rev)=>rev._id.toString() !==req.query.id.toString()
    );
    let avg = 0;
    reviews.forEach((rev)=>{
        avg += rev.rating;
    })
    let ratings = 0;
    if(reviews.length === 0){
        ratings = 0;
    }else{
        ratings = avg / reviews.length;
    }
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews
        },
        {
            new : true,
            runValidators: true,
            useFindAndModify : false,
        }
    );
    res.status(200).json({
        success: true,
    });

})
module.exports = { createProductReview , getProductReviews, deleteReview };