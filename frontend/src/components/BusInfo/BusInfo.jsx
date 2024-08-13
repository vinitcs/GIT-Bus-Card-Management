import styles from "./BusInfoStyles.module.css";

export const BusInfo = () => {
     return (
          <section className={styles.busInfoContainor} id="busInfo">
               <h1>Bus Info</h1>

               <div className={styles.busInfoPanel}>
                    <table>
                         <thead>
                              <tr>
                                   <th>Bus No.</th>
                                   <th>Location</th>
                                   <th>Route</th>
                                   <th>Start Timing</th>
                                   <th>Bus Number Plate</th>
                              </tr>
                         </thead>
                         <tbody>
                              <tr>
                                   <td>1</td>
                                   <td>Khed</td>
                                   <td>Teen batti naka {'>'} ST stand {'>'} Golibaar maidan {'>'} Bharne Naka {'>'} <br /> Railway station {'>'} Khopi fata {'>'} Shiv fata {'>'} Lavel</td>
                                   <td>Morning: 9:15am<br />Evening: 5:10pm</td>
                                   <td>MH 08 2DE4</td>
                              </tr>
                              <tr>
                                   <td>2</td>
                                   <td>Chiplun</td>
                                   <td>Bahadurshek naka {'>'} Farshi {'>'} Parshuram ghat {'>'} Pir Lote {'>'} Lavel</td>
                                   <td>Morning: 8:45am<br />Evening: 5:10pm</td>
                                   <td>MH 08 ADE4</td>
                              </tr>
                              <tr>
                                   <td>3</td>
                                   <td>Chiplun</td>
                                   <td>Powerhouse {'>'} Bhogale {'>'} Bandal {'>'} Bahadurshek naka {'>'} <br />Farshi {'>'} Parshuram ghat {'>'} Pir Lote {'>'} Lavel</td>
                                   <td>Morning: 8:45am<br />Evening: 5:10pm</td>
                                   <td>MH 08 2EE4</td>
                              </tr>
                         </tbody>
                    </table>
               </div>
          </section>
     )
}