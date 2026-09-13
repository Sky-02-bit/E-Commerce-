
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/cart';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import axios from 'axios';
import toast from 'react-hot-toast';
import DropIn from "braintree-web-drop-in-react";
import '../styles/CartStyles.css';

const CartPage = () => {
    const [cart, setCart] = useCart();
    const [auth] = useAuth();
    const [loading, setLoading] = useState(false);
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");
    const navigate = useNavigate();




    // Total Amount calculation
    const totalAmount = () => {
        try {
            const total = cart?.reduce((acc, item) => acc + item.price, 0);
            return total.toLocaleString('en-IN', {
                style: 'currency',
                currency: "INR",
            });
        } catch (error) {
            console.log(error);
            return "₹0.00";
        }
    };


    // remove cart item
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex((item) => item._id === pid);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
        } catch (error) {
            console.log(error);


        }
    };

    //get payment gateway 
    // Get a client token for authorization from your server
    const getToken = async () => {
        try {
            const { data } = await axios.get("/api/v1/product/braintree/token");
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getToken();
    }, [auth?.token]);

    //handle payments
    const handlePayment = async () => {
        try {
            setLoading(true);
            // Send the nonce to your server
            const { nonce } = await instance.requestPaymentMethod();
            await axios.post("/api/v1/product/braintree/payment", {
                nonce,
                cart,
            });
            setLoading(false);
            // removing items from cart page after payment
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dashboard/user/orders");
            toast.success("Payment Completed Successfully ");
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <h1 className='text-center bg-light p-2 mb-1'>
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h1>
                        <h4 className='text-center'>
                            {/* nested if else condition */}
                            {cart?.length
                                ? `You have ${cart.length} items in your cart ${auth.token ? " " : "please login to checkout"}`
                                : "Your Cart Is Empty"
                            }
                        </h4>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8'>
                        {
                            cart?.map(p => (
                                <div className='row mb-2 p-3 card flex-row' key={p._id} >
                                    <div className='col-md-4'>
                                        <img
                                            src={`/api/v1/product/product-photo/${p._id}`}
                                            className="card-img-top"
                                            alt={p.name}
                                            width='100px'
                                            height={'170px'}
                                        />
                                    </div>
                                    <div className='col-md-8'>
                                        <p>{p.name}</p>
                                        <p>
                                            {p.description?.substring(0, 30)}
                                        </p>
                                        <p>₹{p.price}</p>
                                        <button className='btn btn-danger' onClick={() => removeCartItem(p._id)}>Remove</button>
                                    </div>
                                </div>

                            ))
                        }
                    </div>
                    <div className='col-md-4 text-center'>
                        <h2>Price details</h2>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h4>Total Amount : {totalAmount()}</h4>
                        {auth?.user?.address ? (
                            <>
                                <div className="mb-3">
                                    <h5>Current Address</h5>
                                    <h6>{auth?.user?.address}</h6>
                                    <button
                                        className="btn btn-warning text-white" style={{ backgroundColor: '#ff9f00', border: 'none' }}
                                        onClick={() => navigate("/dashboard/user/profile")}
                                    >
                                        Update Address
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="mb-3">
                                {auth?.token ? (
                                    <button
                                        className="btn-warning text-white" style={{ backgroundColor: '#ff9f00', border: 'none' }}
                                        onClick={() => navigate("/dashboard/user/profile")}
                                    >
                                        Update Address
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-warning text-white"
                                        style={{ backgroundColor: '#ff9f00', border: 'none' }}
                                        onClick={() =>
                                            navigate("/login", {
                                                state: "/cart",
                                            })
                                        }
                                    >
                                        Plase Login to checkout
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="mt-2">
                            {!clientToken || !cart?.length ? (
                                ""
                            ) : (
                                <>
                                    {/* currently disable the paypal */}
                                    <DropIn
                                        options={{
                                            authorization: clientToken,
                                            paypal: {
                                                flow: "vault",
                                            },
                                        }}
                                        onInstance={(instance) => setInstance(instance)}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={handlePayment}
                                        disabled={loading || !instance || !auth?.user?.address}
                                    >
                                        {loading ? "Processing ...." : "Make Payment"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CartPage;