import Lottie from "lottie-react";
import loading from "../../assets/animations/Animation.json";

export const Loading = () => {
     return (
          // <div style={{
          //      backgroundColor: "orange",
          //      width: "100%",
          //      height: 20,
          //      display: "flex",
          //      justifyContent: "center",
          //      alignItems: "center"
          // }}>
          <Lottie
               animationData={loading}
               loop
               autoPlay
               style={{ height: 150 }}
          />
          // {/* <p>Loading...</p> */}
          // </div>
     )
}
