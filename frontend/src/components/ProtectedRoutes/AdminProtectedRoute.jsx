import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const AdminProtectedRoute = () => {
     const isAdminLoggedIn = useSelector((state)=> state.adminAuth.isAdminLoggedIn);
     return isAdminLoggedIn ? <Outlet /> : <Navigate to="/" />;
}