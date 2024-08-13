import { useState } from "react";
import styles from "./UpdateCardStyles.module.css";
import { MdCancel } from "react-icons/md";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";



const formatDateString = (dateString) => {
     if (!dateString) {
          return '';
     }
     const date = new Date(dateString);
     const year = date.getFullYear();
     const month = String(date.getMonth() + 1).padStart(2, '0');
     const day = String(date.getDate()).padStart(2, '0');
     return `${year}-${month}-${day}`;
}

export const UpdateCard = ({ onClose }) => {

     const selectedStudent = useSelector((state) => state.studentData.selectedStudent);
     const studentId = selectedStudent?._id;

     const busAllocated = [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
          { label: 3, value: 3 },
     ];

     const fees = [
          { label: 1500, value: 1500 },
          { label: 1800, value: 1800 },
     ];


     const [formData, setFormData] = useState({
          busAllocated: selectedStudent?.busAllocated || '',
          fees: selectedStudent?.fees || '',
          dateOfFeesPaid: formatDateString(selectedStudent?.dateOfFeesPaid) || '',
     });

     const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
     }

     const handleSubmit = async (e) => {
          e.preventDefault();

          try {
               const response = await axios.patch(`http://localhost:3000/api/v1/admin/updatesinglestudentbuscarddata/${studentId}`, formData, { withCredentials: true });
               // console.log(response.data);
               toast.success(`${selectedStudent?.studentName} data updated successfully`);
               onClose();
          } catch (error) {
               if (error.response && error.response.data) {
                    toast.error(error.response.data.message || "An error occurred");
               } else {
                    toast.error("An error occurred");
               }
          }
     }

     return (
          <section className={styles.updateCardContainer} id="studentCard">
               <div className={styles.closeIcon}>
                    <MdCancel size={26} style={{ cursor: 'pointer', color: 'var(--helper-color)' }} onClick={onClose} />
               </div>

               <h1>Student info</h1>
               <div className={styles.infoFieldsTitle}>
                    <h3>Student name:</h3>
                    <p>{selectedStudent?.studentName}</p>
               </div>
               <div className={styles.infoFieldsTitle}>
                    <h3>Phone:</h3>
                    <p>{selectedStudent?.phone}</p>
               </div>
               <div className={styles.infoFieldsTitle}>
                    <h3>College email:</h3>
                    <p>{selectedStudent?.collegeEmail}</p>
               </div>
               <div className={styles.infoFieldsTitle}>
                    <h3>Department:</h3>
                    <p>{selectedStudent?.department}</p>
               </div>
               <div className={styles.infoFieldsTitle}>
                    <h3>Year of engineering:</h3>
                    <p>{selectedStudent?.yearOfEngineering}</p>
               </div>
               <div className={styles.infoFieldsTitle}>
                    <h3>Current Semester:</h3>
                    <p>{selectedStudent?.currSemester}</p>
               </div>
               <div className={styles.infoFieldsTitle}>
                    <h3>Location:</h3>
                    <p>{selectedStudent?.location}</p>
               </div>
               <div className={styles.infoFieldsTitle}>
                    <h3>Stop:</h3>
                    <p>{selectedStudent?.stop}</p>
               </div>

               <div className={styles.busDetailCard}>
                    <h1>Update bus card details</h1>
                    <form onSubmit={handleSubmit}>
                         <label htmlFor='busAllocated'>Bus allocated</label>
                         <select
                              name='busAllocated'
                              value={formData.busAllocated}
                              onChange={handleChange}
                         >
                              <option value="" disabled>Select bus number</option>
                              {busAllocated.map((option, key) => (
                                   <option key={key} value={option.value}>{option.label}</option>
                              ))}
                         </select>

                         <label htmlFor='fees'>Fees</label>
                         <select
                              name='fees'
                              value={formData.fees}
                              onChange={handleChange}
                         >
                              <option value="" disabled>Select fees</option>
                              {fees.map((option, key) => (
                                   <option key={key} value={option.value}>{option.label}</option>
                              ))}
                         </select>

                         <label htmlFor='dateOfFeesPaid'>Date of fees paid</label>
                         <input
                              type='date'
                              name='dateOfFeesPaid'
                              id='dateOfFeesPaid'
                              placeholder='Enter date'
                              value={formData.dateOfFeesPaid}
                              onChange={handleChange}

                         />

                         <button type='submit'>Update</button>
                    </form>
               </div>
          </section>
     )
}
