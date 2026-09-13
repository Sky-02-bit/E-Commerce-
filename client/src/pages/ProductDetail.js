import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const params = useParams();
    const [relatedProducts, setRealtedProduct] = useState([]);
    const [cart, setCart] = useCart();

    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug]);

    // get similar product

    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);

            setRealtedProduct(data?.products);
        } catch (error) {
            console.log(error);

        };
    };

    // get product
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);

            if (data?.success) {
                setProduct(data?.singleProduct);
                getSimilarProduct(data?.singleProduct._id, data?.singleProduct.category._id);
            } else {
                console.log("Product fetch failed");
            }
        } catch (error) {
            console.log("Error in fetching product", error);
        }
    };

    if (!product) {
        return (
            <Layout>
                <div className="text-center">Loading product...</div>
            </Layout>
        );
    };

    return (
        <Layout>
            <div className="row container mt-2">
                <div className="col-md-6">
                    <img
                        src={`/api/v1/product/product-photo/${product._id}`}
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: "300px", width: '250px', objectFit: "contain" }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/default.png"; // fallback image if loading fails
                        }}
                    />
                </div>
                <div className="col-md-6">
                    <h1 className="text-center">Product Details</h1>
                    <h6>Name: {product?.name}</h6>
                    <h6>Description: {product?.description}</h6>
                    <h6>Price: ₹ {product?.price}</h6>
                    <h6>Category: {product?.category?.name || 'No Category'}</h6>
                    {/* <h6>Shipping: {product?.shipping ? 'Yes' : 'No'}</h6> */}

                    <button className="btn btn-danger px-3 py-1 text-white" style={{ backgroundColor: '#ff9f00', border: 'none' }}>
                        <i className="fa fa-bolt"></i>  Buy Now
                    </button>
                    <button className="btn btn-danger px-3 py-1 text-white m-3" style={{ backgroundColor: '#fb641b', border: 'none' }}
                        onClick={() => {
                            setCart([...cart, product])
                            toast.success("Item added to cart")
                        }}
                    >
                        <i className="fa fa-shopping-cart"></i>  Add to Cart
                    </button>
                </div>
            </div>
            <hr />
            <div className="row ">
                <h6>Similar Products</h6>
                {relatedProducts.length < 1 && <p className="text-center">
                    No Similar Sroducts found
                </p>}
                <div className="d-flex flex-wrap justify-content-start">
                    {relatedProducts?.map((p) => (
                        <div className="card m-2" style={{ flex: '1 1 calc(25% - 1rem)', maxWidth: 'calc(25% - 1rem)' }}>
                            <img
                                src={`/api/v1/product/product-photo/${p._id}`}
                                className="card-img-top"
                                alt={p.name}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{p.name}</h5>
                                <p className="card-text">
                                    {p.description.substring(0, 30)}...
                                </p>
                                <p className="card-text">₹ {p.price}</p>

                                {/* buttons */}
                                <div className="d-flex justify-content-center mt-2">
                                    <button
                                        className="btn btn-danger px-3 py-1 text-white"
                                        style={{ backgroundColor: '#fb641b', border: 'none' }}
                                        onClick={() => {
                                            setCart([...cart, p])
                                            toast.success("Item added to cart")
                                        }}
                                    >
                                        <i className="fa fa-shopping-cart"></i> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </Layout>
    );
};

export default ProductDetail;
