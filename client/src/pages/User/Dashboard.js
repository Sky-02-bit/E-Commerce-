import React from 'react';
import Layout from '../../components/layout/Layout';
import UserMenu from '../../components/layout/UserMenu';
import { useAuth } from '../../context/auth';
const Dashboard = () => {
    const [auth] = useAuth();
    return (
        <Layout title={'Dashboard-Ecommerce App'}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        <div className='card w-75 p-3'>
                            <h2>User Name : {auth?.user?.name}</h2>
                            <h2>User Email : {auth?.user?.email}</h2>
                            <h2>User Address : {auth?.user?.address}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard