// user registration
import { compare } from "bcrypt";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from 'jsonwebtoken';
import { token } from "morgan";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        // Validation
        if (!name) {
            return res.send({ message: 'Name is require' })
        }
        if (!email) {
            return res.send({ message: 'Email is require' })
        }
        if (!password) {
            return res.send({ message: 'Password is require' })
        }
        if (!phone) {
            return res.send({ message: 'Phone is require' })
        }
        if (!address) {
            return res.send({ message: 'Address is require' })
        }
        if (!answer) {
            return res.send({ message: 'Answer is require' })
        }

        // check user
        const existingUser = await userModel.findOne({ email })
        // existing user
        if (existingUser) {
            return res.status(200).send({
                // success:true,
                success: false,
                message: 'Already Register please login',
            })
        }
        // Registor user
        const hashedPassword = await hashPassword(password);
        // 
        const user = await new userModel({ name, email, password: hashedPassword, phone, address, answer }).save()
        res.status(201).send({
            success: true,
            message: 'Registration Successfully Done',
            user,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Registration Failed',
            error

        })

    }
};

// POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        // check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not registered'
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid password'
            })
        }
        // creating TOKEN
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: 'login successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,

            },
            token
        })

    }
    catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })

    }
}

// Forgot Password controller
export const forgotPasswordController = async (req, res) => {


    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: 'Email is required' })
        }
        if (!answer) {
            res.status(400).send({ message: 'Answer is required' })
        }
        if (!newPassword) {
            res.status(400).send({ message: 'New Password is required' })
        }

        // Check user

        const user = await userModel.findOne({ email, answer });

        // validation

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong email or answer"
            });
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: "false",
            message: "Something went Wrong", error

        });
    }

}

// Test 
export const testController = (req, res) => {
    try {
        res.send('protected rout');

    } catch (error) {
        console.log("error")
        res.send({ error });
    }

};

// update profile controller for user

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, phone, password, address } = req.body;
        const user = await userModel.findById(req.user._id);
        // Password
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (password && password.lenght < 5) {
            return res.json({ error: "Password is required and 5 character long" });

        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
        }, { new: true });
        res.status(200).send({
            success: true,
            message: "Profile updated Successfully",
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error while updating profile',
            error
        });

    }
};

// orders 
export const getOrderController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting orders",
            error
        })
    }
}

// get All-orders 
export const getAllOrderController = async (req, res) => {
    try {
        const orders = await orderModel.find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: -1 }); //  fixed here
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting orders",
            error
        });
    }
};

//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
        });
    }
};