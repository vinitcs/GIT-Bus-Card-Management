import React, { useState } from 'react';
import styles from "../styles/UpdatePasswordStyles.module.css";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

export const UpdatePassword = () => {
  const navigate = useNavigate();

  const [visibility, setVisibility] = useState({
    oldPassword: false,
    confirmPassword: false
  });


  const toggleVisibility = (field) => {
    setVisibility(prevVisibility => ({
      ...prevVisibility,
      [field]: !prevVisibility[field]
    }));
  };

  const handleCancelClick = () => {
    navigate('/');
  };

  return (
    <>
      <div className={styles.updatePasswordContainer}>
        <form action=''>
          <div className={styles.closeIcon} onClick={handleCancelClick}>
            <MdCancel size={26} style={{ cursor: 'pointer', color: 'var(--helper-color)' }} />
          </div>
          <h1>Update Password</h1>
          <p>Welcome to, Bus Management System.</p>

          <label htmlFor='password'>Old Password</label>
          <div className={styles.passwordContainer}>
            <input
              type={visibility.oldPassword ? 'text' : 'password'}
              name='old-password'
              id='old-password'
              placeholder='Enter Old Password'
              // autoComplete="old-password"
              required
            />
            <div className={styles.eyeIcon} onClick={() => toggleVisibility('OldPassword')}>
              {visibility.oldPassword ? (
                <BsEyeSlash size={20} />
              ) : (
                <BsEye size={20} />
              )}
            </div>
          </div>

          <label htmlFor='password'>Confirm Password</label>
          <div className={styles.passwordContainer}>
            <input
              type={visibility.confirmPassword ? 'text' : 'password'}
              name='confirmPassword'
              id='confirm-password'
              placeholder='Confirm Password'
              // autoComplete="new-password"
              required
            />
            <div className={styles.eyeIcon} onClick={() => toggleVisibility('confirmPassword')}>
              {visibility.confirmPassword ? (
                <BsEyeSlash size={20} />
              ) : (
                <BsEye size={20} />
              )}
            </div>
          </div>

          <button className='signIn' type='submit' value='SignIn'>Sign In</button>
        </form>
      </div>
    </>
  );
};
