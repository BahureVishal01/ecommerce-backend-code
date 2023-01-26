
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const cathcAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatueres");
//create Product--Admin

const createProduct = cathcAsyncErrors(async (req, res) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
});
// get all products
const getAllProducts = cathcAsyncErrors(async (req, res, next) => {

const resultPerPage = 5;

    const apifeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    const products = await apifeatures.query;

    if (!products) {
        return next(new ErrorHandler("Products not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "All product List",
        products,
    })
});

// const resultPerPage = 5;


// const apiFeature = new ApiFeatures(Product.find(), req.query)
//   .search()
//   .filter();
   

// let products = await apiFeature.query;


// apiFeature.pagination(resultPerPage);

// products = await apiFeature.query;

// res.status(200).json({
//   success: true,
//   products,

// });


const getOneProduct = cathcAsyncErrors(async (req, res, next) => {
    let product = await Product.findById({ _id: req.params.id });

    if (!product) {
        return next(new ErrorHandler("product is not found", 404))
    }

    res.status(200).json({
        success: true,
        product
    })
});
    //     try{
    //         const product = await Product.findOne({
    //             _id: req.params.id
    //         });

    //         res.status(200).send(product);
    //     }catch(err){
    //         console.log(err.message);
    //         return res.status(500).send({
    //             message: "product is not found."
    //         })
    //     }


// update product --Admin

const updateProduct = cathcAsyncErrors(async (req, res, next) => {
    
    let product = await Product.findById(req.params.id);
    if (!product) {
        if (!product) {
            return next(new ErrorHandler("product is not found", 404))
        }
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: "Product is updated Successfully..."
    })
});
//delete product-admin
const deleteProduct = cathcAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

        if(!product){
            return next(new ErrorHandler("product is not found", 404))   
         }

         await product.remove();
       res.status(200).json({
         success: true,
         message:"product is deleted successfully."
       })
});
    // try {
    //     const product = await Product.deleteOne({
    //         _id: req.params.id
    //     });
    //     res.status(200).send("product is deleted successfully", product);
    // } catch (err) {
    //     console.log(err.message);
    //     return next(new ErrorHandler("product is not found", 404))
    // }


    





module.exports = { createProduct, getAllProducts, getOneProduct, updateProduct, deleteProduct };