
const userController = require("../controllers/useController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

module.exports = (app)=>{
    app.post("/Ecommerce/api/v1/user/register", userController.registerUser);
    app.post("/Ecommerce/api/v1/user/login", userController.loginUser);
    app.get("/Ecommerce/api/v1/user/logout", userController.logout);
    app.post("/Ecommerce/api/v1/user/forgotPassword", userController.forgotPassword);
    app.put("/Ecommerce/api/v1/user/resetPassword/:token", userController.resetPassword);
    app.put("/Ecommerce/api/v1/user/updatePassword", isAuthenticatedUser, userController.updatePassword);
    app.put("/Ecommerce/api/v1/user/updateProfile", isAuthenticatedUser, userController.updateProfile);
    app.get("/Ecommerce/api/v1/user/me",isAuthenticatedUser, userController.getUserDetails);
    // admin rights:
    app.get("/Ecommerce/api/v1/admin/users", isAuthenticatedUser, authorizeRoles("Admin"), userController.getAllUsers);
    app.get("/Ecommerce/api/v1/admin/user/:id", isAuthenticatedUser, authorizeRoles("Admin"), userController.getUserById);
    app.put("/Ecommerce/api/v1/admin/user/UpdateRole/:id", isAuthenticatedUser, authorizeRoles("Admin"), userController.updateUserRole);
    app.delete("/Ecommerce/api/v1/admin/user/deleteUser/:id", isAuthenticatedUser, authorizeRoles("Admin"), userController.deleteUser);

}