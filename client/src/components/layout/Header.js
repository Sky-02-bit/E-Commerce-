import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { SiShopee } from "react-icons/si";
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';
import { Badge } from 'antd';
const Header = () => {
  const [cart] = useCart();
  const [auth, setAuth] = useAuth();
  const categories = useCategory();
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: ""
    })
    localStorage.removeItem('auth')
    toast.success("Logout Successfully")
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <div className="d-flex align-items-center w-100">
              {/* Brand */}
              <Link to='/' className="navbar-brand d-flex align-items-center">
                <SiShopee style={{ marginRight: "5px" }} />
                KY SHOP
              </Link>

              {/* Search */}
              <div className="flex-grow-1 ms-2 me-3">
                <SearchInput />
              </div>

              {/* Nav Items */}
              <ul className="navbar-nav d-flex align-items-center mb-2 mb-lg-0 gap-3">
                <li className="nav-item">
                  <NavLink to='/' className="nav-link">Home</NavLink>
                </li>

                {/* Categories */}
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" to="/categories" data-bs-toggle="dropdown">
                    Categories
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/categories">All Categories</Link>
                    </li>
                    {categories?.map(c => (
                      <li key={c._id}>
                        <Link className="dropdown-item" to={`/category/${c.slug}`}>{c.name}</Link>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* Auth */}
                {!auth.user ? (
                  <>
                    <li className="nav-item">
                      <NavLink to='/register' className="nav-link">Register</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to='/login' className="nav-link">
                        Login</NavLink>
                    </li>
                  </>
                ) : (
                  <li className="nav-item dropdown">
                    <NavLink className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                      
                      {auth?.user?.name}
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                          className="dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink onClick={handleLogout} to='/login' className="dropdown-item">Logout</NavLink>
                      </li>
                    </ul>
                  </li>
                )}

                {/* Cart */}
                <li className="nav-item d-flex align-items-center">
                  <NavLink to='/cart' className="nav-link d-flex align-items-center position-relative">
                    <Badge count={cart?.length} showZero offset={[5, -5]}>
                      <span className="d-flex align-items-center">
                        <i className="fa fa-shopping-cart me-1"></i> Cart
                      </span>
                    </Badge>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;