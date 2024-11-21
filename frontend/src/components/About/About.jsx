import styles from "./AboutStyles.module.css";
import college from "../../assets/college.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const About = () => {

     const [adminData, setAdminData] = useState(null);

     useEffect(() => {
          fetchAdminData();
     }, []);

     const fetchAdminData = async () => {
          try {
               const response = await axios.get('https://git-bus-card-management-oapd.onrender.com/api/v1/admin/adminaboutusdisaplay', { withCredentials: true })
               setAdminData(response.data.data.adminData[0])
          }
          catch (error) {
               // console.error('Error fetching student data:', error);
               toast.error("Error fetching admin data");
          };
     }


     return (
          <section className={styles.aboutContainer} id="about">
               <h1>About Us</h1>

               <div className={styles.aboutDisplay}>
                    <img src={college} alt="collegeImg" />
                    <div className={styles.aboutInfo}>
                         <h1>Gharda Institute of Technology, Khed</h1>
                         <h2>Quality Education at Affordable Cost</h2>
                         <p>Gharda college provides bus service from "Chiplun" and "Khed" students with well maintained buses and trained bus drivers.</p>

                         <div className={styles.impInfo}>
                              <div className={styles.fields}>
                                   <h4>Availability:</h4>
                                   <p>2 Chiplun bus, 1 Khed bus</p>
                              </div>
                              <div className={styles.fields}>
                                   <h4>Chiplun bus:</h4>
                                   <p>Mon-Sat  8:45am from PowerHouse, Pag Naka.</p>
                              </div>
                              <div className={styles.fields}>
                                   <h4>Khed bus:</h4>
                                   <p>Mon-Sat  9:15am from Teen Batti Naka.</p>
                              </div>
                              <div className={styles.fields}>
                                   <h4>Admin:</h4>
                                   <p>{adminData?.adminName}</p>
                              </div>
                              <div className={styles.fields}>
                                   <h4>Contact:</h4>
                                   <p>+91 {adminData?.phone}</p>
                              </div>
                              <div className={styles.fields}>
                                   <h4>Email:</h4>
                                   <p>{adminData?.adminEmail}</p>
                              </div>
                         </div>
                    </div>
               </div>
          </section>
     );
}