import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";


export default function PrivateRoutes() {
    const [ok, setOk] = useState(false)
    const [auth,] = useAuth()
    useEffect(() => {
        const authCheck = async () => {

            const res = await axios.get('/api/v1/auth/user-auth');

            if (res.data.ok) {
                setOk(true);
            } else {
                setOk(false);
            }

        };
        // checking token before calling
        if (auth?.token) authCheck()
    }, [auth?.token]);
    return ok ? <Outlet /> : <Spinner />;
    // for neste route we need to use <outlet />
}