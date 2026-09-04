import express from 'express';
import { registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrderController, getAllOrderController, orderStatusController } from '../controller/authController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
// router object
const router = express.Router();

// routing
// REGISTOR || method POST
router.post('/register', registerController)

// LOGIN || METHOD POST
router.post('/login', loginController)

// Forgot Password \\ post

router.post('/forgot-password', forgotPasswordController)

// Test Rout
router.get('/test', requireSignIn, isAdmin, testController)

// protected user route auth

router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})
// protected user route auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
})

// update profile for user
router.put('/profile', requireSignIn, updateProfileController);

// orderRoute
router.get('/orders', requireSignIn, getOrderController);

// All Orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrderController);

// order status update
router.put(
    "/order-status/:orderId",
    requireSignIn,
    isAdmin,
    orderStatusController
);


export default router;
