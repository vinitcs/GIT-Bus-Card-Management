import React, { useState } from 'react';
import styles from "../styles/LoginStyles.module.css";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { studentExist } from '../redux/features/studentSlice';


export const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        collegeEmail: '',
        password: ''
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
            const response = await axios.post('https://git-bus-card-management-oapd.onrender.com/api/v1/students/login', formData, { withCredentials: true });

            const { student } = response.data;

            dispatch(studentExist(student));

            toast.success(response.data.message);
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || "An error occurred");
            } else {
                toast.error("An error occurred");
            }
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit}>
                <div className={styles.closeIcon} onClick={handleCancelClick}>
                    <MdCancel size={26} style={{ cursor: 'pointer', color: 'var(--helper-color)' }} />
                </div>
                <h1>Sign In</h1>
                <p>Welcome to, Bus Card Management Portal.</p>

                <label htmlFor='collegeEmail'>College Email</label>
                <input
                    type='email'
                    name='collegeEmail'
                    id='collegeEmail'
                    placeholder='Enter college email'
                    value={formData.collegeEmail}
                    onChange={handleChange}
                    required
                />

                <label htmlFor='password'>Password</label>
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


                <div className={styles.forgetPassword}>
                    <NavLink to="/forgetpassword">Forgot Password</NavLink>
                </div>
                <button className='signIn' type='submit'>Sign In</button>
            </form>

        </div>
    );
};
