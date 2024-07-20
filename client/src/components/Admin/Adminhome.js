import React from "react";
import Username from "./Usersname"
import './userstyle.css'
const Adminhome = () => {
  const handleLogout = () => {
    localStorage.removeItem("token1");
    window.location.reload();
  };
  return (
    <>
    <div className="logoutbutton">

      <button onClick={handleLogout}>Logout</button>
    </div>
      
        <div>
        <h1 style={{ color: 'blue' , textAlign: 'center'}}>Registered Users Reports</h1>
        <hr />
        <br />
           <Username/>
        </div>
     
    </>
  );
};

export default Adminhome;
