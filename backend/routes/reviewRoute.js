
const reviewController = require("../controllers/ReviewController");
const { isAuthenticatedUser } = require("../middleware/auth");


module.exports =(app)=> {
    app.post("/Ecommerce/api/v1/product/seviews", isAuthenticatedUser, reviewController.createProductReview);
    app.delete("/Ecommerce/api/v1/product/review", isAuthenticatedUser, reviewController.deleteReview);
    app.get("/Ecommerce/api/v1/product/reviews/:id", reviewController.getProductReviews );
}