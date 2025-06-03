import express, { Router } from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import {

    brainTreePaymentController,
    braintreeTokenController,
    createProductController,
    deleteProductController,
    getProductController,
    getProductPhotoController,
    getSingleProductController,
    productCategoryController,
    productCountController,
    productFiltersController,
    productListController,
    relatedProductController,
    searchProductController,
    updateProductController
} from '../controller/productController.js';
import formidable from 'express-formidable';


const router = express.Router()

// creating routs
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

// get product routs
router.get('/get-product', getProductController);

// single product routs
router.get('/get-product/:slug', getSingleProductController);

// get photo routs
router.get('/product-photo/:pid', getProductPhotoController);

// delete product
router.delete('/delete-product/:pid', deleteProductController);

//filter product
router.post("/product-filters", productFiltersController);

// update route
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

//product count
router.get("/product-count", productCountController);


//product per page
router.get("/product-list/:page", productListController);

// search product
router.get('/search/:keyword', searchProductController);

// similar product
router.get('/related-product/:pid/:cid', relatedProductController);

// category wise product
router.get('/product-category/:slug', productCategoryController);

//payments routes

//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);


export default router; 