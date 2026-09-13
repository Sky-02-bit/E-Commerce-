import React, { useState, useEffect } from 'react'
import AdminMenu from "../../components/layout/AdminMenu";
import Layout from '../../components/layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import { useAuth } from '../../context/auth';
import { Select } from "antd";
const { Option } = Select;



const AdminOrders = () => {
    const [status, setStatus] = useState([
        "Not Process",
        "Processing",
        "Shipped",
        "deliverd",
        "cancel",
    ]);
    const [changeStatus, setCHangeStatus] = useState("");
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth();
    const getOrders = async () => {
        try {
            const { data } = await axios.get("/api/v1/auth/all-orders");
            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    // handle function
    const handleChange = async (orderId, value) => {
        try {
            const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
                status: value,
            });
            getOrders();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Layout title={"All Orders Data"}>
            <div className="row dashboard">
                <div className="col-md-3">
                    <AdminMenu />
                </div>
                <div className="col-md-9">
                    <h1 className="text-center">All Orders</h1>
                    {
                        orders?.map((ord, indx) => {
                            return (
                                <div className='border shadow'>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th scope='col'>#</th>
                                                <th scope='col'>Status</th>
                                                <th scope='col'>Buyer</th>
                                                <th scope='col'>Date</th>
                                                <th scope='col'>Payment</th>
                                                <th scope='col'>Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    {indx + 1}
                                                </td>
                                                <td>
                                                    <Select
                                                        bordered={false}
                                                        onChange={(value, orderId) => handleChange(ord._id, value)}
                                                        defaultValue={ord?.status}
                                                    >
                                                        {status.map((s, indx) => (
                                                            <Option key={indx} value={s}>
                                                                {s}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </td>
                                                <td>
                                                    {ord?.buyer?.name}
                                                </td>
                                                <td>
                                                    {moment(ord?.createAt).fromNow()}
                                                </td>
                                                <td>
                                                    {ord?.payment.success ? "success" : "Failed"}
                                                </td>
                                                <td>
                                                    {ord?.products?.length}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className='container'></div>
                                    {
                                        ord?.products?.map((p, indx) => (
                                            <div className='row mb-2 p-3 card flex-row' >
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

                                                </div>
                                            </div>

                                        ))
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </Layout>
    )
}

export default AdminOrders