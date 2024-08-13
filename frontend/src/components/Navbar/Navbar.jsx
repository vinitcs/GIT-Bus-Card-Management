import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./NavbarStyles.module.css";
import { Link } from "react-scroll";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../../redux/features/studentSlice";
import axios from "axios";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

export const Navbar = () => {
     const isLoggedIn = useSelector((state) => state.studentAuth.isLoggedIn);
     const isAdminLoggedIn = useSelector((state) => state.adminAuth.isAdminLoggedIn);
     const [allowStudentUpdateDetails, setAllowStudentUpdateDetails] = useState(false);
     const [isNavbarOpen, setIsNavbarOpen] = useState(false);

     const dispatch = useDispatch();
     const navigate = useNavigate();

     useEffect(() => {
          const fetchFeatureStatus = async () => {
               if (isLoggedIn) {

                    try {
                         const response = await axios.get('http://localhost:3000/api/v1/students/getallowstudentupdatefeaturestatus', {
                              withCredentials: true,
                         });
                         setAllowStudentUpdateDetails(response.data.data.toggleStudentUpdateValue);
                    } catch (error) {
                         toast.error("Error fetching feature status");
                    }
               }
          };
          fetchFeatureStatus();
     }, [isLoggedIn])





     const handleLogout = async () => {

          try {
               // Remove token or any login status identifier

               const response = await axios.post('http://localhost:3000/api/v1/students/logout', {}, { withCredentials: true });
               // console.log(response);
               dispatch(logout());
               toast.success(response.data.message);
               navigate('/');
          } catch (error) {
               console.log(error);
               toast.error("Logout failed");
          }
     };

     const toggleNavbar = () => {
          setIsNavbarOpen(!isNavbarOpen);
     };


     return <>
          <header>
               <div className={`${styles.navbarContainer} ${isNavbarOpen ? styles.openNavbarBackground : ""
                    }`}>
                    <div className={styles.logoBrand}>
                         <a href="/">GIT Bus Card</a>
                         {isNavbarOpen ? (
                              <IoClose
                                   size={34}
                                   className={styles.closeMenu}
                                   onClick={toggleNavbar}
                              />
                         ) : (
                              <RxHamburgerMenu
                                   color="white"
                                   size={34}
                                   className={styles.hamburgerMenu}
                                   onClick={toggleNavbar}
                              />
                         )}
                    </div>

                    <nav className={isNavbarOpen ? styles.showNav : ""}>
                         <ul>
                              {isLoggedIn && <li> <Link to="studentCard"
                                   spy={true}
                                   smooth={true}
                                   duration={100}>CardInfo</Link>
                              </li>}


                              <li> <Link to="busInfo"
                                   spy={true}
                                   smooth={true}
                                   duration={100}>BusInfo</Link>
                              </li>
                              <li> <Link to="about"
                                   spy={true}
                                   smooth={true}
                                   duration={100}>AboutUs</Link>
                              </li>

                              {/* <li> <Link to="contact"
                                   spy={true}
                                   smooth={true}
                                   duration={100}>ContactUs</Link>
                              </li> */}

                              {isLoggedIn ? (
                                   <>
                                        {allowStudentUpdateDetails &&

                                             <li><NavLink to="/student/updatedetails">UpdateDetails</NavLink></li>
                                        }
                                        <li onClick={handleLogout} className={styles.loginBtn}>Logout</li>
                                   </>
                              ) : (
                                   <>
                                        <li> <NavLink to="/register">Register</NavLink> </li>
                                        <li className={styles.loginBtn}> <NavLink to="/login">LogIn</NavLink> </li>
                                   </>
                              )}



                              {/* admin dashnoard */}
                              {isAdminLoggedIn && <li className={styles.adminDashboard}> <NavLink to="/admin/dashboard">Admin Dashboard</NavLink> </li>}
                         </ul>
                    </nav>
               </div>
          </header>
     </>
}