import React, { useEffect, useState } from 'react';
import styles from "../styles/HomeStyles.module.css";
import { PiMouseScroll } from "react-icons/pi";
// import videoBg from "../assets/busvideo1.mp4"
import { Navbar } from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import { StudentCard } from '../components/StudentCard/StudentCard';
import { About } from '../components/About/About';
import { BusInfo } from '../components/BusInfo/BusInfo';
// import { Contact } from '../components/Contact/Contact';
import { useSelector } from 'react-redux';

export const Home = () => {
     const videoBg = "https://res.cloudinary.com/dbkvjtoul/video/upload/v1723129230/git-bms/busvideo1.mp4";

     let [isLoggedIn, setIsLoggedIn] = useState(false);

     isLoggedIn = useSelector((state) => state.studentAuth.isLoggedIn);
     // console.log(isLoggedIn);

     useEffect(() => {
          // Check login status (e.g., check if a token exists)
          // const token = localStorage.getItem('token');
          //   setIsLoggedIn(!!token);
          setIsLoggedIn(isLoggedIn);

     }, []);

     return (
          <>
               <Navbar />
               <section className={styles.container}>
                    <div className={styles.welcomeContainer} id="home">
                         <div className={styles.overlay}></div>
                         <video src={videoBg} autoPlay loop muted />
                         <div className={styles.welcomeDisplay}>
                              <h1>Welcome to,</h1>
                              <h2>Gharda Institute of Technology</h2>
                              <h3>Bus Card Management Portal</h3>
                              <p>"A bus card management portal where students can view their bus card information."</p>
                         </div>

                         <PiMouseScroll className={styles.scrollIcon} size={30} color='white' />
                    </div>

                    {isLoggedIn && <StudentCard />} {/* Conditionally render StudentCard */}
                    <BusInfo />
                    <About />
                    {/* <Contact /> */}

               </section>
               <Footer />
          </>
     );

}
