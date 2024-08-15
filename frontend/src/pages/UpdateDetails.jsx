import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import styles from "../styles/UpdateDetailsStyles.module.css";
import { MdCancel } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export const UpdateDetails = () => {
     const [studentData, setStudentData] = useState(null);
     const isLoggedIn = useSelector((state) => state.studentAuth.isLoggedIn);
     const navigate = useNavigate();

     useEffect(() => {
          if (isLoggedIn) {

               // Fetch the current student data
               axios.get('https://git-bus-card-management.onrender.com/api/v1/students/logged', { withCredentials: true })
                    .then((response) => {
                         const data = response.data.data;
                         setStudentData(data);
                         setFormData({
                              studentName: data.studentName || '',
                              collegeEmail: data.collegeEmail || '',
                              phone: data.phone || '',
                              department: data.department || '',
                              yearOfEngineering: data.yearOfEngineering || '',
                              currSemester: data.currSemester || '',
                              location: data.location || '',
                              stop: data.stop || '',
                         });
                    })
                    .catch((error) => {
                         console.error('Error fetching student data:', error);
                    });
          }
     }, [isLoggedIn]);




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
     });




     const handlePhoneChange = (e) => {
          // Extract the value from the event object
          const numericValue = e.target.value.replace(/[^0-9]/g, '');
          if (numericValue.length <= 10) {
               setFormData({ ...formData, phone: numericValue });
          }
     };


     const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
     }

     const handleCancelClick = () => {
          navigate('/');
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          try {
               const response = await axios.post('https://git-bus-card-management.onrender.com/api/v1/students/updatedetails', formData, { withCredentials: true });
               // console.log(response.data);
               toast.success("Data updated successfully");
               navigate('/');
          } catch (error) {
               if (error.response && error.response.data) {
                    toast.error(error.response.data.message || "An error occurred");
               } else {
                    toast.error("An error occurred");
               }
          }
     }


     return (
          <>
               <div className={styles.updateDetailsContainer}>
                    <form onSubmit={handleSubmit}>
                         {/* <form > */}
                         <div className={styles.closeIcon} onClick={handleCancelClick}>
                              <MdCancel size={26} style={{ cursor: 'pointer', color: 'var(--helper-color)' }} />
                         </div>
                         <h1>Update Details</h1>
                         <p>Welcome to, Bus Card Management Portal.</p>

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
                              className={styles.collegeEmailInput}
                              type='email'
                              name='collegeEmail'
                              id='collegeEmail'
                              placeholder='eg. en20104079@git-india.edu.in'
                              value={formData.collegeEmail}
                              onChange={handleChange}
                              required
                              disabled
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
                              required
                              disabled
                         >
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
                              required
                              disabled
                         >
                              <option value="" disabled>Select location</option>
                              {locationOptions.map((option, key) => (
                                   <option key={key} value={option.value}>{option.label}</option>
                              ))}
                         </select>

                         <label htmlFor='stop'>Stop</label>
                         <input
                              className={styles.stopInput}
                              type='text'
                              name='stop'
                              id='stop'
                              placeholder='Enter Stop'
                              value={formData.stop}
                              onChange={handleChange}
                              required
                              disabled
                         />

                         <button type='submit'>Update</button>
                    </form>
               </div>
          </>
     )
}
