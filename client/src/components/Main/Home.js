import React from "react";
import Header from "./Header";
import "./../../styles/Home.css";
import Report from "./report.jsx";
const Home = () => {
  let token = localStorage.getItem("token");
  console.log("tokeen", token);
  return (
    <>
      <Header />
      <body>
        <Report />
      </body>
    </>
  );
};

export default Home;
