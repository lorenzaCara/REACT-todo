import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"

const GuestLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if(user && token) {
            navigate('/');
        }
    }, []);
    return (
        <Outlet />
    )
}

export default GuestLayout;