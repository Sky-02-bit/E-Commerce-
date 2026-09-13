import React, { useState } from 'react'
import '../../styles/authStyle.css';
import Layout from '../../components/layout/Layout'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';

const Register = () => {
    // Using React Hook i.e.(useState())
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();
    const [answer, setAnswer] = useState("");

    // Form function that allows , after submit not allow to refresh the page

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/v1/auth/register', {
                name,
                email,
                password,
                phone,
                address,
                answer,
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message)
                navigate('/login')
            } else {
                toast.error(res.data.message)
            }
        }

        catch (error) {
            console.log(error);
            toast.error('Somthing went wrong')

        }
    };

    return (
        <Layout title={"Register - Sky Electron"}>
            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h3 className='title'>Register Form</h3>
                    <div className="mb-3">

                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder='Enter your Full Name' required />

                    </div>
                    <div className="mb-3">

                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder='Enter your Email' required />

                    </div>
                    <div className="mb-3">

                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder='Enter your Password' required />
                    </div>
                    <div className="mb-3">

                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder='Enter your Phone' required />

                    </div>
                    <div className="mb-3">

                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder='Enter your Address' required />

                    </div>
                    <div className="mb-3">

                        <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder='What is your favourite game ' required />

                    </div>

                    <button type="submit" className="btn btn-primary">Register</button>
                </form>

            </div>
        </Layout>
    )
}

export default Register