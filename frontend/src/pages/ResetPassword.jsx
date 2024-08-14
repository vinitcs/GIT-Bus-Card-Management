import React, { useState } from 'react';
import styles from "../styles/ResetPasswordStyles.module.css";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../constants/BackendUrl';


export const ResetPassword = () => {
     const [passwordVisible, setPasswordVisible] = useState(false);
     const navigate = useNavigate();
     const [formData, setFormData] = useState({
          password: ''
     });

     const { token } = useParams();

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
               const response = await axios.put(`${BACKEND_URL}/api/v1/students/resetpassword/${token}`, formData);
               // console.log(response);
               
               toast.success(response.data.message);
               navigate('/login');


          } catch (error) {
               if (error.message && error.response.data) {
                    toast.error(error.response.data.message || "An error occured");
               } else {
                    toast.error("An error occured");

               }
          }
     }


     return (
          <div className={styles.ResetPasswordContainer}>
               <form onSubmit={handleSubmit}>
                    <div className={styles.closeIcon} onClick={handleCancelClick}>
                         <MdCancel size={26} style={{ cursor: 'pointer', color: 'var(--helper-color)' }} />
                    </div>
                    <h1>Reset Password</h1>


                    <label htmlFor='password'>Reset Password</label>
                    <div className={styles.passwordContainer}>
                         <input
                              type={passwordVisible ? 'text' : 'password'}
                              name='password'
                              id='password'
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

                    <button type='submit'>Reset Password</button>
               </form>

          </div>
     );
};
