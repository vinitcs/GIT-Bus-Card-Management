import { useState } from "react";
import styles from "../../styles/LoginStyles.module.css";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { adminExist } from "../../redux/features/adminSlice";
import { BACKEND_URL } from "../../../constants/BackendUrl";


export const AdminLogin = () => {
     const [passwordVisible, setPasswordVisible] = useState(false);
     const navigate = useNavigate();
     const dispatch = useDispatch();

     const [formData, setFormData] = useState({
          adminName: '',
          adminPassword: ''
     });

     const togglePasswordVisibility = () => {
          setPasswordVisible(!passwordVisible);
     };

     const handleCancelClick = () => {
          navigate('/');
     };


     const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          try {
               const response = await axios.post(`${BACKEND_URL}/api/v1/admin/adminlogin`, formData, { withCredentials: true });

               const { admin } = response.data;

               dispatch(adminExist(admin));

               toast.success(response.data.message);
               navigate('/admin/dashboard');

          } catch (error) {
               if (error.response && error.response.data) {
                    toast.error(error.response.data.message || "An error occurred")
               } else {
                    toast.error("An error occurred");
               }
          }

     }

     return (
          <div className={styles.loginContainer}>
               <form onSubmit={handleSubmit}>
                    <div className={styles.closeIcon} onClick={handleCancelClick}>
                         <MdCancel size={26} style={{ cursor: 'pointer', color: 'var(--helper-color)' }} />
                    </div>
                    <h1>Admin LogIn</h1>

                    <label htmlFor='adminName'>Name</label>
                    <input
                         type='text'
                         name='adminName'
                         id='adminName'
                         placeholder='Enter Name'
                         value={formData.adminName}
                         onChange={handleChange}
                         required
                    />

                    <label htmlFor='adminPassword'>Password</label>
                    <div className={styles.passwordContainer}>
                         <input
                              type={passwordVisible ? 'text' : 'password'}
                              name='adminPassword'
                              id='adminPassword'
                              placeholder='Enter Password'
                              autoComplete="new-password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                         />
                         <div className={styles.eyeIcon} onClick={togglePasswordVisibility}>
                              {passwordVisible ? (
                                   <BsEyeSlash size={20} />
                              ) : (
                                   <BsEye size={20} />
                              )}
                         </div>
                    </div>

                    <button type='submit'>Log In</button>
               </form>

          </div>
     )
}