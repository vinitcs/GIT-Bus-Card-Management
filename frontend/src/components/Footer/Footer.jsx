import styles from "./FooterStyles.module.css";

export const Footer = () => {
     return (
          <footer>
               <div>

                    <div className={styles.copyright}> &copy;2022 All Right Reserved by<strong>&nbsp;Bus Card Management</strong>&nbsp;, GIT
                    </div>
               </div>
               <div>
                    <div className={styles.design}>designed by:&nbsp;<strong>Team Blender</strong></div>
               </div>
          </footer>
     );
}