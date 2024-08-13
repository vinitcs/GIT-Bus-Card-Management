import React, { useState } from 'react';
import styles from "../styles/RegisterStyles.module.css";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

export const Register = () => {

     const navigate = useNavigate();

     const yearOfEnggOptions = [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
          { label: 3, value: 3 },
          { label: 4, value: 4 },
     ];

     const currSemester = [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
          { label: 3, value: 3 },
          { label: 4, value: 4 },
          { label: 5, value: 5 },
          { label: 6, value: 6 },
          { label: 7, value: 7 },
          { label: 8, value: 8 },
     ];

     const deptOptions = [
          { label: "Computer Engineering", value: "Computer Engineering" },
          { label: "Chemical Engineering", value: "Chemical Engineering" },
          { label: "Entc Engineering", value: "Entc Engineering" },
          { label: "Civil Engineering", value: "Civil Engineering" },
          { label: "Mechnical Engineering", value: "Mechnical Engineering" },
          { label: "AIML Engineering", value: "AIML Engineering" },
     ];

     const locationOptions = [
          { label: "Chiplun", value: "Chiplun" },
          { label: "Khed", value: "Khed" },
     ];


     const [formData, setFormData] = useState({
          studentName: '',
          collegeEmail: '',
          phone: '',
          department: '',
          yearOfEngineering: '',
          currSemester: '',
          location: '',
          stop: '',
          password: '',
          confirmPassword: ''
     })

     const [visibility, setVisibility] = useState({
          password: false,
          confirmPassword: false
     });



     const handlePhoneChange = (e) => {
          // Extract the value from the event object
          const numericValue = e.target.value.replace(/[^0-9]/g, '');
          if (numericValue.length <= 10) {
               setFormData({ ...formData, phone: numericValue });
          }
     };

     const toggleVisibility = (field) => {
          setVisibility(prevVisibility => ({
               ...prevVisibility,
               [field]: !prevVisibility[field]
          }));
     };

     const handleCancelClick = () => {
          navigate('/');
     };



     const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
     }

     const validateCollegeEmail = (email) => {
          const regex = /^en\d{8}@git-india.edu.in$/;
          return regex.test(email);
     };


     const handleSubmit = async (e) => {
          e.preventDefault();

          if (!validateCollegeEmail(formData.collegeEmail)) {
               toast.error("Please enter a valid college email (e.g., en12345678@git-india.edu.in)");
               return;
          }

          if (formData.password !== formData.confirmPassword) {
               toast.error("Password and Confirm password does not match!");
               return;
          }


          try {
               const response = await axios.post('http://localhost:3000/api/v1/students/register', formData);
               // console.log(response);
               toast.success(response.data.message);
               navigate('/');
          } catch (error) {
               console.log(error);
               if (error.response && error.response.data) {
                    toast.error(error.response.data.message || "An error occurred in if error");
               } else {
                    toast.error("An error occurred in else error");
               }
          }
     };

     return (
          <>
               <div className={styles.registerContainer}>
                    <form onSubmit={handleSubmit}>
                         <div className={styles.closeIcon} onClick={handleCancelClick}>
                              <MdCancel size={26} style={{ cursor: 'pointer', color: 'var(--helper-color)' }} />
                         </div>
                         <h1>Sign Up</h1>
                         <p>Welcome to, Bus Card Management Portal.</p>
                         <span className={styles.noteDisplay}><label className={styles.noteLabel}>Note: </label> Fields such as <strong>College Email</strong>, <strong>Department</strong>, <strong>Location</strong> and <strong>Stop</strong> will remain permanant as long as your profile is active; these fields cannot be changed during profile updates. Please ensure that you provide accurate information in these fields.</span>

                         <label htmlFor='studentName'>Name</label>
                         <input
                              type='text'
                              name='studentName'
                              id='studentName'
                              placeholder='Enter Name'
                              value={formData.studentName}
                              onChange={handleChange}
                              required
                         />

                         <label htmlFor='collegeEmail'>College Email</label>
                         <input
                              type='email'
                              name='collegeEmail'
                              id='collegeEmail'
                              placeholder='Enter College Email'
                              value={formData.collegeEmail}
                              onChange={handleChange}
                              required
                         />

                         <label htmlFor='phone'>Phone</label>
                         <input
                              type='tel'
                              name='phone'
                              id='phone'
                              placeholder='Enter Phone'
                              value={formData.phone}
                              onChange={handlePhoneChange}   // separate function as to change Number to String
                              required
                         />

                         <label htmlFor='department'>Department</label>
                         <select
                              name='department'
                              value={formData.department}
                              onChange={handleChange}
                              required>
                              <option value="" disabled>Select department</option>
                              {deptOptions.map((option, key) => (
                                   <option key={key} value={option.value}>{option.label}</option>
                              ))}
                         </select>

                         <label htmlFor='yearOfEngineering'>Year of engineering</label>
                         <select
                              name='yearOfEngineering'
                              value={formData.yearOfEngineering}
                              onChange={handleChange}
                              required>
                              <option value="" disabled>Select year of engineering</option>
                              {yearOfEnggOptions.map((option, key) => (
                                   <option key={key} value={option.value}>{option.label}</option>
                              ))}
                         </select>

                         <label htmlFor='currSemester'>Semester</label>
                         <select
                              name='currSemester'
                              value={formData.currSemester}
                              onChange={handleChange}
                              required>
                              <option value="" disabled>Select semester</option>
                              {currSemester.map((option, key) => (
                                   <option key={key} value={option.value}>{option.label}</option>
                              ))}
                         </select>

                         <label htmlFor='location'>Location</label>
                         <select
                              name='location'
                              value={formData.location}
                              onChange={handleChange}
                              required>
                              <option value="" disabled>Select location</option>
                              {locationOptions.map((option, key) => (
                                   <option key={key} value={option.value}>{option.label}</option>
                              ))}
                         </select>

                         <label htmlFor='stop'>Stop</label>
                         <input
                              type='text'
                              name='stop'
                              id='stop'
                              placeholder='Enter Stop'
                              value={formData.stop}
                              onChange={handleChange}
                              required
                         />
                         {/* <span>Add your fixed stop; it won't change during the profile update.</span> */}

                         <label htmlFor='password'>Password</label>
                         <div className={styles.passwordContainer}>
                              <input
                                   type={visibility.password ? 'text' : 'password'}
                                   name='password'
                                   id='create-password'
                                   placeholder='Create Password'
                                   autoComplete="new-password"
                                   value={formData.password}
                                   onChange={handleChange}
                                   required
                              />
                              <div className={styles.eyeIcon} onClick={() => toggleVisibility('password')}>
                                   {visibility.password ? (
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
                                   autoComplete="new-password"
                                   value={formData.confirmPassword}
                                   onChange={handleChange}
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

                         <button className='signUp' type='submit'>Sign Up</button>
                    </form>
               </div>
          </>
     );
};
