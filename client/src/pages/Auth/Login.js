import React from 'react'
import { useState } from 'react'
import '../../styles/authStyle.css';
import Layout from '../../components/layout/Layout'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';


const Login = () => {
  // Using React Hook i.e.(useState())
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // form function
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/v1/auth/login', { email, password, });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message)
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token
        })
        localStorage.setItem('auth', JSON.stringify(res.data))
        navigate(location.state || '/')

      } else {
        toast.error(res.data.message)
      }
    }

    catch (error) {
      console.log(error);
      toast.error('Somthing went wrong')

    }
  }


  return (
    <Layout title={"Login - Sky Electron"}>
      <div className='form-container'>
        <form onSubmit={handelSubmit}>
          <h3 className='title'>Login Form</h3>
          <div className="mb-3">

          </div>
          <div className="mb-3">

            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder='Enter your Email' required />

          </div>
          <div className="mb-3">

            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder='Enter your Password' required />
          </div>
          <div className='mb-3'>
            <button type="button" className="btn btn-primary" onClick={() => { navigate('/forgot-password') }}>Forgot Password</button>
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>

      </div>
    </Layout>
  )
}

export default Login;