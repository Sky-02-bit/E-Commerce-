import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import UserMenu from '../../components/layout/UserMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from "moment";
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth();
    const getOrders = async () => {
        try {
            const { data } = await axios.get('/api/v1/auth/orders');
            setOrders(data);
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        if (auth?.token) getOrders()
    }, [auth?.token])
    return (
        <Layout title={"Your Orders"}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        <h1 className='text-center'>All Orders</h1>
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
                                                        {ord?.status}
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
            </div>
        </Layout>
    )
}

export default Orders