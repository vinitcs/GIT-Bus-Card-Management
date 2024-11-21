import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { StudentProtectedRoute } from "./components/ProtectedRoutes/StudentProtectedRoute";
// import { UpdatePassword } from "./pages/UpdatePassword";
import { UpdateDetails } from "./pages/UpdateDetails";
import { ForgetPassword } from "./pages/ForgetPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { studentExist, studentNotExist } from "./redux/features/studentSlice";



import { AdminLogin } from "./pages/Admin/AdminLogin";
import { AdminProtectedRoute } from "./components/ProtectedRoutes/AdminProtectedRoute";
import { DashBoard } from "./pages/Admin/DashBoard";
import { adminExist, adminNotExist } from "./redux/features/adminSlice";

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.studentAuth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const studentResponse = await axios.post('https://git-bus-card-management-oapd.onrender.com/api/v1/students/verify-token', {}, { withCredentials: true });
        // console.log(studentResponse);
        const { student } = studentResponse.data;
        dispatch(studentExist(student));
      } catch (error) {
        dispatch(studentNotExist());
      }



      try {
        const adminResponse = await axios.post('https://git-bus-card-management-oapd.onrender.com/api/v1/admin/verifyadmintoken', {}, { withCredentials: true });
        const { admin } = adminResponse.data;
        dispatch(adminExist(admin))
      } catch (error) {
        dispatch(adminNotExist());
      }
    };

    checkAuth();

  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* User(student) routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />


          {/* Make Update password as protected route under student - CAUTION */}

          <Route path="/student" element={<StudentProtectedRoute />} >
            <Route path="updatedetails" element={<UpdateDetails />} />
          </Route>


          {/* Conditionally render ForgotPassword/ResetPassword or Redirect based on "isLoggedIn" where we check user(i.e student), when user is logged in then cannot access the forgetpassword and resetpassword routes. And if not then they can access the routes.  */}

          <Route path="/forgetpassword" element={isLoggedIn ? <Navigate to="/" /> : <ForgetPassword />} />
          <Route path="/resetpassword/:token" element={isLoggedIn ? <Navigate to="/" /> : <ResetPassword />} />



          {/* Admin routes */}
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminProtectedRoute />}>
            <Route path="dashboard" element={<DashBoard />} />
          </Route>



        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
