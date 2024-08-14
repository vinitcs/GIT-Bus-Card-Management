// import { Navbar } from "../../components/Navbar/Navbar";
import styles from "../../styles/DashBoardStyles.module.css";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { UpdateCard } from "../../components/UpdateCard/UpdateCard";
import { adminLogout } from "../../redux/features/adminSlice";
import { setSelectedStudent, clearSelectedStudent } from "../../redux/features/studentDataSlice";
import { Footer } from "../../components/Footer/Footer";
import { IoIosClose } from "react-icons/io";


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



export const DashBoard = () => {
     const [adminData, setAdminData] = useState(null);
     const [studentData, setStudentData] = useState([]);
     const [isUpdateCardOpen, setIsUpdateCardOpen] = useState(false);
     const [allowStudentUpdateDetails, setAllowStudentUpdateDetails] = useState(false);
     const isAdminLoggedIn = useSelector((state) => state.adminAuth.isAdminLoggedIn);
     const [toastId, setToastId] = useState(null);
     const [nextDueDate, setNextDueDate] = useState('');
     const [search, setSearch] = useState('');
     const [sort, setSort] = useState('');
     const [isSendingReminder, setIsSendingReminder] = useState(false);
     const [deletingAccount, setDeletingAccount] = useState(false);


     const dispatch = useDispatch();
     const navigate = useNavigate();


     const currSemester = [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
     ];

     useEffect(() => {
          // if (isAdminLoggedIn) {
          fetchAdminData();
          fetchStudentData();
          fetchFeatureStatus();
          // }

     }, [isAdminLoggedIn]);


     const fetchAdminData = async () => {
          try {
               const response = await axios.get('http://localhost:3000/api/v1/admin/loggedadmin', { withCredentials: true })
               setAdminData(response.data.data)
          }
          catch (error) {
               // console.error('Error fetching student data:', error);
               toast.error("Error fetching admin data");
          };
     }

     const fetchStudentData = async () => {
          try {
               const response = await axios.get('http://localhost:3000/api/v1/admin/listallstudentdata', {
                    withCredentials: true
               });
               if (response.data.data.length === 0) {
                    // Handle the case where no student data is found
                    setStudentData([]);
                    // toast.info("No student data found");
               } else {
                    setStudentData(response.data.data);
                    // toast.success(response.data.message);
               }
          } catch (error) {
               // console.error('Error fetching student data:', error);
               toast.error("Error fetching student data");
          }
     };


     const fetchFeatureStatus = async () => {
          try {
               const response = await axios.get('http://localhost:3000/api/v1/admin/getallowstudentupdatefeaturestatus', {
                    withCredentials: true,
               });
               setAllowStudentUpdateDetails(response.data.data.toggleStudentUpdateValue);
          } catch (error) {
               toast.error("Error fetching feature status");
          }
     };


     const handleToggleStudentUpdateDetails = () => {
          const action = allowStudentUpdateDetails ? "Disable" : "Enable";

          const idToast = toast.info(
               <div>
                    <p style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>
                         Are you sure you want to {action} the student update details feature?
                    </p>
                    <button
                         style={{
                              border: "none",
                              padding: "0.2rem 1rem",
                              fontSize: "1.2rem",
                              borderRadius: "0.6rem",
                              cursor: "pointer",
                              marginRight: "1rem"
                         }}
                         onClick={() => confirmToggleStudentUpdateDetails(idToast)}
                    >
                         Yes
                    </button>
                    <button
                         style={{
                              border: "none",
                              padding: "0.2rem 1rem",
                              fontSize: "1.2rem",
                              borderRadius: "0.6rem",
                              cursor: "pointer"
                         }}
                         onClick={() => toast.dismiss(idToast)}
                    >
                         No
                    </button>
               </div>,
               {
                    position: "top-center",
                    autoClose: false,
                    closeOnClick: false,
                    draggable: false,
                    closeButton: false,
                    transition: Bounce,
                    style: { width: "150%" }
               }
          );
     };

     const confirmToggleStudentUpdateDetails = async (idToast) => {
          toast.dismiss(idToast);
          try {
               const response = await axios.patch(
                    'http://localhost:3000/api/v1/admin/allowstudentupdatedetails',
                    { toggleStudentUpdateValue: !allowStudentUpdateDetails },
                    { withCredentials: true }
               );
               setAllowStudentUpdateDetails(!allowStudentUpdateDetails);
               toast.success(response.data.message);
          } catch (error) {
               toast.error("Error updating the feature status");
          }
     };

     const handleOpenUpdateCard = (currStudent) => {
          dispatch(setSelectedStudent(currStudent));
          setIsUpdateCardOpen(true);
     }
     const handleCloseUpdateCard = () => {
          setIsUpdateCardOpen(false);
          fetchStudentData();
          dispatch(clearSelectedStudent());
     }


     const handleLogout = async () => {
          try {
               // Remove token or any login status identifier

               const response = await axios.post('http://localhost:3000/api/v1/admin/logoutadmin', {}, { withCredentials: true });
               // console.log(response);
               dispatch(adminLogout());
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



     const handleNextDueDate = async () => {
          try {
               const response = await axios.patch('http://localhost:3000/api/v1/admin/nextduedateset', { nextDueDate }, { withCredentials: true });
               toast.success(response.data.message);
               setNextDueDate('');
               fetchStudentData();
          } catch (error) {
               if (error.response && error.response.data) {
                    toast.error(error.response.data.message || "An error occurred");
               } else {
                    toast.error("An error occurred");
               }
          }
     }


     const handleNextDueDateConfirmation = (e) => {
          e.preventDefault();
          const idToast = toast.info(
               <div>
                    <p style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>Are you sure to set next due date {formatDateString(nextDueDate)}?</p>
                    <button style={{
                         border: "none",
                         padding: "0.2rem 1rem",
                         fontSize: "1.2rem",
                         borderRadius: "0.6rem",
                         cursor: "pointer",
                         marginRight: "1rem"

                    }}
                         onClick={() => handleNextDueDateConfirmDelete(idToast)}>Yes</button>
                    <button style={{
                         border: "none",
                         padding: "0.2rem 1rem",
                         fontSize: "1.2rem",
                         borderRadius: "0.6rem",
                         cursor: "pointer",

                    }}
                         onClick={() => toast.dismiss(idToast)}>No</button>
               </div>,
               {
                    position: "top-center",
                    autoClose: "5000",
                    closeOnClick: false,
                    draggable: false,
                    closeButton: false,
                    transition: Bounce,
                    style: { width: "150%" }
                    // className: styles.confirmationToast
               }
          );
          setToastId(idToast);
     };

     const handleNextDueDateConfirmDelete = (idToast) => {
          toast.dismiss(idToast);
          handleNextDueDate();
     };



     const deleteStudent = async (id) => {
          setDeletingAccount(true);
          try {
               // console.log(id);
               const response = await axios.delete(`http://localhost:3000/api/v1/admin/deletestudent/${id}`, { withCredentials: true });
               toast.success(response.data.message);
               fetchStudentData();
          } catch (error) {
               if (error.response && error.response.data) {
                    toast.error(error.response.data.message || "An error occurred");
               } else {
                    toast.error("An error occurred");
               }
          } finally {
               setDeletingAccount(false);
          }
     };


     const handleDeleteConfirmation = (id, studentName) => {
          const idToast = toast.info(
               <div>
                    <p style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>Are you sure to delete the "{studentName}" record?</p>
                    <button style={{
                         border: "none",
                         padding: "0.2rem 1rem",
                         fontSize: "1.2rem",
                         borderRadius: "0.6rem",
                         cursor: "pointer",
                         marginRight: "1rem"

                    }}
                         onClick={() => confirmDelete(id)}>Yes</button>
                    <button style={{
                         border: "none",
                         padding: "0.2rem 1rem",
                         fontSize: "1.2rem",
                         borderRadius: "0.6rem",
                         cursor: "pointer",

                    }}
                         onClick={() => toast.dismiss(idToast)}>No</button>
               </div>,
               {
                    position: "top-center",
                    autoClose: "5000",
                    closeOnClick: false,
                    draggable: false,
                    closeButton: false,
                    transition: Bounce,
                    style: { width: "150%" }
                    // className: styles.confirmationToast
               }
          );
          setToastId(idToast);
     };

     const confirmDelete = (id) => {
          toast.dismiss();
          deleteStudent(id);
     };


     const feeReminder = async () => {
          setIsSendingReminder(true);
          try {
               // console.log(id);
               const response = await axios.post('http://localhost:3000/api/v1/admin/feeremainder', {}, { withCredentials: true });
               toast.success(response.data.message);
          } catch (error) {
               if (error.response && error.response.data) {
                    toast.error(error.response.data.message || "An error occurred");
               } else {
                    toast.error("An error occurred");
               }
          } finally {
               setIsSendingReminder(false);
          }
     }

     const handleFeeReminderConfirmation = async () => {
          const idToast = toast.info(
               <div>
                    <p style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>Are you sure to send fee reminder?</p>
                    <button style={{
                         border: "none",
                         padding: "0.2rem 1rem",
                         fontSize: "1.2rem",
                         borderRadius: "0.6rem",
                         cursor: "pointer",
                         marginRight: "1rem"

                    }}
                         onClick={() => confirmSendFeeRemainder()}>Yes</button>
                    <button style={{
                         border: "none",
                         padding: "0.2rem 1rem",
                         fontSize: "1.2rem",
                         borderRadius: "0.6rem",
                         cursor: "pointer",

                    }}
                         onClick={() => toast.dismiss(idToast)}>No</button>
               </div>,
               {
                    position: "top-center",
                    autoClose: "5000",
                    closeOnClick: false,
                    draggable: false,
                    closeButton: false,
                    transition: Bounce,
                    style: { width: "150%" }
                    // className: styles.confirmationToast
               }
          );
          setToastId(idToast);
     }

     const confirmSendFeeRemainder = () => {
          toast.dismiss();
          console.log("Sending fee reminder...");
          feeReminder();
     };


     return (
          <>
               {/* <Navbar /> */}
               <section className={styles.adminContainer}>
                    <div className={styles.welcomeContainer}>
                         <div className={styles.welcomeText}>
                              <h1>Welcome,</h1>
                              {adminData ? <p>"{adminData.adminName}"</p> : ""}
                         </div>

                         <NavLink className={styles.HomeBtn} to='/'>Home</NavLink>
                         <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                    </div>
                    <div className={styles.tableContainer}>
                         <div className={styles.tableHeaderSection}>
                              <div className={styles.filterSection}>
                                   <input
                                        type="text"
                                        placeholder="Search student"
                                        onChange={(e) => setSearch(e.target.value.toLowerCase())}
                                   />
                                   <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        onBlur={(e) => setSort(e.target.value)}
                                   >
                                        <option value='' disabled>Sort by semester</option>
                                        {currSemester.map((option, key) => (
                                             <option key={key} value={option.value}>{option.label}</option>
                                        ))}
                                   </select>
                                   <IoIosClose
                                        size={30}
                                        color="grey"
                                        className={styles.clearSortBtn}
                                        onClick={() => setSort('')}
                                   // disabled={sort === ''}
                                   />
                              </div>

                              <div className={styles.nextDueDateSection}>
                                   <form className={styles.nextDueDateForm} onSubmit={handleNextDueDateConfirmation}>
                                        <label htmlFor='nextDueDate'>Set next due date</label>
                                        <input
                                             type='date'
                                             name='nextDueDate'
                                             id='nextDueDate'
                                             placeholder='Enter date'
                                             value={nextDueDate}
                                             onChange={(e) => setNextDueDate(e.target.value)}
                                             required
                                        />
                                        <button className={styles.setBtn} type="submit">Set</button>
                                   </form>
                              </div>
                              <div className={styles.updateAllowSection}>
                                   <label>Student update detail feature</label>
                                   <button className={styles.allowBtn}
                                        onClick={handleToggleStudentUpdateDetails}>
                                        {allowStudentUpdateDetails ? "Disable" : "Enable"}
                                   </button>
                              </div>
                              <div className={styles.remainderSection}>
                                   <label>Fee remainder</label>
                                   <button className={styles.remainderBtn} onClick={handleFeeReminderConfirmation}> {isSendingReminder ? "Sending..." : "Notify"} </button>
                              </div>
                         </div>

                         <div className={styles.tablePanel}>
                              {studentData.length === 0 ? (
                                   <div className={styles.noDataMessage}>
                                        <p>No student data found</p>
                                   </div>
                              ) : (
                                   <table>
                                        <thead>
                                             <tr>
                                                  <th>Id</th>
                                                  <th>Student name</th>
                                                  <th>Phone</th>
                                                  <th>Department</th>
                                                  <th>Year of engineering</th>
                                                  <th>Semester</th>
                                                  <th>Location</th>
                                                  <th>Stop</th>
                                                  <th>Bus allocated</th>
                                                  <th>Fees</th>
                                                  <th>Date of fees paid</th>
                                                  <th>Next due date</th>
                                                  <th>revious paid fee dates</th>
                                                  <th>Action</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {studentData.filter((currStudent) => {
                                                  // Apply the search filter
                                                  return search === '' || currStudent.studentName.toLowerCase().includes(search);
                                             })
                                                  .filter((currStudent) => {
                                                       // Apply the sort filter
                                                       return sort === '' || currStudent.currSemester === sort;

                                                  }).map((currStudent, idx) => (

                                                       <tr key={currStudent._id}>
                                                            <td>{idx + 1}</td>
                                                            <td>{currStudent.studentName || '-'}</td>
                                                            <td>{currStudent.phone || '-'}</td>
                                                            <td>{currStudent.department || '-'}</td>
                                                            <td>{currStudent.yearOfEngineering || '-'}</td>
                                                            <td>{currStudent.currSemester || '-'}</td>
                                                            <td>{currStudent.location || '-'}</td>
                                                            <td>{currStudent.stop || '-'}</td>
                                                            <td>{currStudent.busAllocated || '-'}</td>
                                                            <td>{currStudent.fees || '-'}</td>
                                                            <td>{formatDateString(currStudent.dateOfFeesPaid) || '-'}</td>
                                                            <td>{formatDateString(currStudent.nextDueDate) || '-'}</td>
                                                            <td>
                                                                 <select
                                                                      name='historyOfPaidFeesDate'
                                                                      defaultChecked
                                                                 >

                                                                      <option value="" disabled >check previous dates</option>
                                                                      {currStudent.historyOfPaidFeesDate.slice().reverse().map((data, key) => (
                                                                           <option key={key} value={data} disabled>{data}</option>
                                                                      ))}
                                                                 </select>
                                                            </td>
                                                            <td className={styles.actions}>
                                                                 <div>
                                                                      <button className={styles.editBtn} onClick={() => handleOpenUpdateCard(currStudent)}>Edit</button>
                                                                 </div>
                                                                 <div>
                                                                      <button className={styles.deleteBtn} onClick={() => handleDeleteConfirmation(currStudent._id, currStudent.studentName)}>{deletingAccount ? "Deleting..." : "Delete"}</button>
                                                                 </div>
                                                            </td>
                                                       </tr>
                                                  ))}

                                        </tbody>

                                   </table>
                              )}
                         </div>
                    </div>

                    <div className={styles.displayUpdateCard}>
                         {isUpdateCardOpen && <UpdateCard onClose={handleCloseUpdateCard} />}
                    </div>
               </section>
               <Footer />

          </>
     )
}