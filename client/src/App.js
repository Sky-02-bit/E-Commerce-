import { Routes, Route } from 'react-router-dom'; // Routes will work as container
import HomePage from './pages/HomePage';
import About from './pages/About';
import Policy from './pages/Policy';
import Contact from './pages/Contact';
import PageNotfound from './pages/PageNotfound'
import Register from './pages/Auth/Register';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Auth/Login.js';
import Dashboard from './pages/User/Dashboard.js';
import PrivateRoutes from './components/Routes/private.js';
import ForgotPassword from './pages/Auth/ForgotPassword.js';
import AdminRoute from './components/Routes/AdminRout.js';
import AdminDashboard from './pages/Admin/AdminDashboard.js';
import CreateCatogory from './pages/Admin/CreateCatogory.js';
import CreateProduct from './pages/Admin/CreateProduct.js';
import Users from './pages/Admin/Users.js';
import Orders from './pages/User/Orders.js';
import Profile from './pages/User/Profile.js';
import Products from './pages/Admin/Products.js';
import UpdateProduct from './pages/Admin/UpdateProduct.js';
import Search from './pages/Search.js';
import ProductDetail from './pages/ProductDetail.js';
import Categories from './pages/Categories.js';
import CategoryProduct from './pages/CategoryProduct.js';
import CartPage from './pages/CartPage.js';
import AdminOrders from './pages/Admin/AdminOrders.js';


function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path="/cart" element={<CartPage />} />

        {/* creating nested Route to check the , 
        * first porotected routes will be check and then nested Route will be execute 
        * empty path means that directly dashboard will be shown 
        */}
        <Route path='/dashboard' element={<PrivateRoutes />}>
          <Route path='user' element={<Dashboard />} />
          <Route path='user/orders' element={<Orders />} />
          <Route path='user/profile' element={<Profile />} />
        </Route>

        <Route path='/dashboard' element={<AdminRoute />}>
          <Route path='admin' element={<AdminDashboard />} />
          <Route path='admin/create-category' element={<CreateCatogory />} />
          <Route path='admin/create-product' element={<CreateProduct />} />
          <Route path='admin/product/:slug' element={<UpdateProduct />} />
          <Route path='admin/products' element={<Products />} />
          <Route path='admin/users' element={<Users />} />
          <Route path='admin/orders' element={<AdminOrders />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/login' element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="*" element={<PageNotfound />} />
      </Routes>
    </>
  );
};

export default App;
