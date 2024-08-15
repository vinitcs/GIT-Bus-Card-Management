import React, { useState } from 'react';
import styles from "../styles/ForgetPasswordStyles.module.css";
import { MdCancel } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


export const ForgetPassword = () => {
  const navigate = useNavigate();

  const handleCancelClick = () => {
    navigate('/login');
  };

  const [formData, setFormData] = useState({
    collegeEmail: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://git-bus-card-management.onrender.com/api/v1/students/forgetpassword', formData);
      // console.log(response);

      toast.success(response.data.message);
      navigate('/');

    } catch (error) {
      if (error.message && error.response.data) {
        toast.error(error.response.data.message || "An error occured");
      } else {
        toast.error("An error occured");

      }
    }
  }
  return (
    <div className={styles.forgotPasswordContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.closeIcon} onClick={handleCancelClick}>
          <MdCancel size={26} style={{ cursor: 'pointer', color: 'var(--helper-color)' }} />
        </div>
        <h1>Forget Password</h1>

        {/* <label htmlFor='collegeEmail'>Enter college email</label> */}
        <input
          type='email'
          name='collegeEmail'
          id='collegeEmail'
          placeholder='Enter college email'
          value={formData.collegeEmail}
          onChange={handleChange}
          required
        />

        <button type='submit'>Send Reset Link</button>
      </form>
    </div>
  );
}
