import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './StudentCardStyles.module.css';
import { Loading } from '../Loading/Loading';
import { useSelector } from 'react-redux';

const formatDateString = (dateString) => {
     if (!dateString) {
          return '';
     }
     const date = new Date(dateString);
     const year = date.getFullYear();
     const month = String(date.getMonth() + 1).padStart(2, '0');
     const day = String(date.getDate()).padStart(2, '0');
     return `${day}-${month}-${year}`;
}



export const StudentCard = () => {
     const [studentData, setStudentData] = useState(null);
     const isLoggedIn = useSelector((state) => state.studentAuth.isLoggedIn);

     useEffect(() => {
          if (isLoggedIn) {

               // Fetch the current student data
               axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/students/logged`, { withCredentials: true })
                    .then((response) => {
                         setStudentData(response.data.data);
                    })
                    .catch((error) => {
                         console.error('Error fetching student data:', error);
                    });
          }
     }, [isLoggedIn]);

     return (
          <section className={styles.studentCardContainer} id="studentCard">
               <h1>Bus Card Info</h1>
               <div className={styles.studentCardInfoPanel}>
                    {studentData ? (
                         <>
                              <table>
                                   <tbody>
                                        <tr>
                                             <td>Student Name:</td>
                                             <td>{studentData.studentName || "-"}</td>
                                        </tr>
                                        <tr>
                                             <td>Bus Allocated:</td>
                                             <td>{studentData.busAllocated || "-"}</td>
                                        </tr>
                                        <tr>
                                             <td>Phone:</td>
                                             <td>{studentData.phone || "-"}</td>
                                        </tr>
                                        <tr>
                                             <td>Department:</td>
                                             <td>{studentData.department || "-"}</td>
                                        </tr>
                                        <tr>
                                             <td>Year of Engineering:</td>
                                             <td>{studentData.yearOfEngineering || "-"}</td>
                                        </tr>
                                        <tr>
                                             <td>Semester:</td>
                                             <td>{studentData.currSemester || "-"}</td>
                                        </tr>
                                        <tr>
                                             <td>Location:</td>
                                             <td>{studentData.location || "-"}</td>
                                        </tr>
                                        <tr>
                                             <td>Stop:</td>
                                             <td>{studentData.stop || "-"}</td>
                                        </tr>
                                        <tr>
                                             <td>Fees:</td>
                                             <td>{studentData.fees || "-"}</td>
                                        </tr>
                                        <tr>
                                             <td>Date of Fee Paid:</td>
                                             <td>{formatDateString(studentData.dateOfFeesPaid) || "-"}</td>
                                        </tr>
                                        <tr>
                                             <td>Next Due Date:</td>
                                             <td>{formatDateString(studentData.nextDueDate) || "-"}</td>
                                        </tr>
                                        <tr>
                                             <td>Previous paid fee dates:</td>
                                             {/* <td>{studentData.historyOfPaidFeesDate || "-"}</td> */}
                                             <td>
                                                  <select
                                                       name='historyOfPaidFeesDate'
                                                  >
                                                       <option value="" disabled >check previous dates</option>
                                                       {studentData.historyOfPaidFeesDate.slice().reverse().map((data, key) => (
                                                            <option key={key} value={data} disabled>{data}</option>
                                                       ))}
                                                  </select>
                                             </td>
                                        </tr>
                                   </tbody>
                              </table>
                              <span className={styles.noteDisplay}>"Stay Updated! Refresh the Tab to Get the Latest Card Info."</span>

                         </>
                    ) : (
                         <Loading />
                    )}
               </div>
          </section>
     );
};
