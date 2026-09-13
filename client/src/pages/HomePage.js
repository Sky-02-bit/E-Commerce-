import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Radio } from 'antd';
import axios from 'axios';
import { Prices } from '../components/Prices';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import { AiOutlineReload } from "react-icons/ai";
import { useInView } from 'react-intersection-observer';
import "../styles/Homepage.css";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useCart();
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts(); // Initial load for page 1
  }, []);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) setCategories(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  // Get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch products with pagination
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      if (page === 1) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && !loading && products.length < total) {
      setLoading(true);
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, loading, products.length, total]);

  // Load more when page changes
  useEffect(() => {
    if (page !== 1) getAllProducts();
  }, [page]);

  // Handle category checkbox change
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // Apply filters
  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduct();
    } else if (!checked.length && !radio.length && page === 1) {
      getAllProducts(); // reload all if filters are cleared
    }
  }, [checked, radio]);

  // Filtered product fetch
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"All Products - Best offers "}>
      <div className="container-fluid row mt-3 homepage">
        <img
          src="/images/banner.png"
          className="banner-img"
          alt="bannerimage"
          width={"100%"}
        />
        <div className="col-md-2">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-dark mt-3"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>

        <div className="col-md-10 product-scroll-container">
          <h1 className="text-center mb-3">All Products</h1>
          <div className="product-container">
            {products?.map((p) => (
              <div key={p._id} className="card product-card">
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description?.substring(0, 30)}...
                  </p>
                  <p className="product-price">₹ {p.price}</p>
                  <div
                   className="d-flex justify-content-between mt-2 gap-2"
                  >
                    <button
                      className="btn text-white me-1 px-3 py-1"
                      style={{ backgroundColor: '#ff9f00', border: 'none' }}
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      <i className="fa fa-bars"></i> More Details
                    </button>
                    <button
                      className="btn text-white px-3 py-1"
                      style={{ backgroundColor: '#fb641b', border: 'none' }}
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem('cart', JSON.stringify([...cart, p]));
                        toast.success("Item added to cart");
                      }}
                    >
                      <i className="fa fa-shopping-cart"></i> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Infinite Scroll Loader */}
          <div ref={ref} className="text-center p-3">
            {loading && <AiOutlineReload className="loading-icon" />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
