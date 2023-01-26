
const productController = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

module.exports = (app)=>{
    app.post("/Ecommerce/api/v1/products/newProduct", isAuthenticatedUser, authorizeRoles("Admin"), productController.createProduct);
    app.get("/Ecommerce/api/v1/products", productController.getAllProducts);
    app.get("/Ecommerce/api/v1/product/:id", productController.getOneProduct);
    app.put("/Ecommerce/api/v1/product/:id", isAuthenticatedUser, authorizeRoles("Admin"), productController.updateProduct);
    app.delete("/Ecommerce/api/v1/product/:id", isAuthenticatedUser, authorizeRoles("Admin"), productController.deleteProduct);
    
}