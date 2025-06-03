import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
import fs from 'fs';
import braintree from "braintree";
import dotenv from 'dotenv';
import orderModel from "../models/orderModel.js";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


// creating product controller
export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields; // now we are getting the data from formidable instead of req.body where req.field is the documentation of express-formidable for getting data
        const { photo } = req.files // this contains files

        // Validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' })
            case !description:
                return res.status(500).send({ error: 'description is required' })
            case !price:
                return res.status(500).send({ error: 'price is required' })
            case !category:
                return res.status(500).send({ error: 'category is required' })
            case !quantity:
                return res.status(500).send({ error: 'quantity is required' })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'photo is required and should be less than 1mb' })
        }
        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: 'Product created successfully',
            products,
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating product",
        })
    }

}

// get all products
export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            counTotal: products.length, // count total no of product 
            message: "All products",
            products,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'error while geting product',
            error: message.error,
        })
    }
};

// get single product
export const getSingleProductController = async (req, res) => {
    try {
        const singleProduct = await productModel.findOne({ slug: req.params.slug }).select('-photo').populate('category')
        res.status(200).send({
            success: true,
            message: "Here is the single product",
            singleProduct,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'error while getting product',
            error,
        })
    }
}

// get product photo

export const getProductPhotoController = async (req, res) => {
    try {
        const { pid } = req.params;

        // Check if pid is valid
        if (!pid || pid === 'undefined') {
            return res.status(400).send({
                success: false,
                message: 'Invalid product ID',
            });
        }

        const product = await productModel.findById(pid).select('photo');

        // If product not found
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found',
            });
        }

        // If photo is not available
        if (!product.photo || !product.photo.data) {
            return res.status(404).send({
                success: false,
                message: 'Photo not found for this product',
            });
        }

        res.set('Content-Type', product.photo.contentType);
        return res.status(200).send(product.photo.data);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error retrieving photo',
            error,
        });
    }
};


// delete product controller
export const deleteProductController = async (req, res) => {
    try {
        //const { pid } = req.params;
        await productModel.findByIdAndDelete(req.params.pid).select('-photo');
        res.status(200).send({
            success: true,
            message: "Successfuly deleted"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while deleting Product'
        });
    }
};

// update product
export const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields; // now we are getting the data from formidable instead of req.body where req.field is the documentation of express-formidable for getting data
        const { photo } = req.files // this contains files

        // Validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' })
            case !description:
                return res.status(500).send({ error: 'description is required' })
            case !price:
                return res.status(500).send({ error: 'price is required' })
            case !category:
                return res.status(500).send({ error: 'category is required' })
            case !quantity:
                return res.status(500).send({ error: 'quantity is required' })
            case photo && photo.size > 100000000:
                return res.status(500).send({ error: 'photo is required and should be less than 1mb' })
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,
            { ...req.fields, slug: slugify(name) }, { new: true }
        )
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: 'Product updated successfully',
            products,
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in updating product",
        });
    };
};

// Filters

export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        // gte = greater than equal to
        // lte = less than equal to 
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Filtering Products",
            error,
        });
    }
};

// product count

export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error in product count",
            error,
            success: false,
        });
    }
};

// product list based on page

export const productListController = async (req, res) => {
    try {
        const perPage = 2;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in per page ctrl",
            error,
        });
    }
};

// search product controller

export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }).select("-photo");
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in Search product API',
            error
        })
    }
};

// similar product

export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid },  // $ne stands for not include
        })
            .select('-photo')
            .limit(4)       // set limit of 3 product of related product
            .populate('category');
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while getting related product",
            error
        })

    }
};

// get product by category

export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate('category');
        res.status(200).send({
            success: true,
            category,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while getting product",
            error
        })
    }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

//payment
export const brainTreePaymentController = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};

