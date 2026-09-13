import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
// get product by category
const CategoryProduct = () => {
    const params = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (params?.slug) getProductByCat();

    }, [params?.slug])
    const getProductByCat = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category)
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <Layout>
            <div className='container mt-3'>
                <h4 className='text-center'>Category - {category?.name}</h4>
                <h6 className='text-center'>
                    {products?.length} result found
                </h6>
                <div className='row'>
                    <div className="d-flex flex-wrap">
                        {products?.map((p) => (
                            <div className="card m-2" style={{ width: "20rem" }}>
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
                                    <p className="card-text"> ₹ {p.price}</p>
                                    {/* buttons */}
                                    <div className="d-flex flex-column flex-sm-row mt-1 gap-1" style={{ height: '31px', width: '289px' }}>
                                        <button className="btn btn-warning me-1 px-3 py-1 text-white" style={{ backgroundColor: '#ff9f00', border: 'none' }}
                                            onClick={() => navigate(`/product/${p.slug}`)}
                                        >
                                            <i className="fa fa-bars"></i> More Details
                                        </button>

                                        <button className="btn btn-danger px-3 py-1 text-white" style={{ backgroundColor: '#fb641b', border: 'none' }}>
                                            <i className="fa fa-shopping-cart"></i>  Add to Cart
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* <div className="m-2 p-3">
                        {products && products.length < total && (
                            <button
                                className="btn btn-warning"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(page + 1);
                                }}
                            >
                                <i class="fa fa-arrow-down"></i>

                                {loading ? "Loading ..." : "Loadmore"}
                            </button>
                        )}
                    </div> */}
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct