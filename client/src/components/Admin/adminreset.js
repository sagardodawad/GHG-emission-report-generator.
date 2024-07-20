import React, { useEffect, useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../PasswordReset/styles.module.css";

const Adminreset = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
  
	const { userId, token } = useParams();
	console.log('userId:', userId);
	console.log('token:', token);
	
  

  const url = `http://localhost:3000/admin/password-reset/${userId}/${token}/`;
  const burl = `http://localhost:8080/admin/password-reset/${userId}/${token}/`;
 
  useEffect(() => {
    const verifyUrl = async () => {
      try {
        await axios.post(burl,password);
		console.log(burl);
        setValidUrl(true);
		console.log("url is correct");
      } catch (error) {
		console.log(url);
        setValidUrl(false);
		console.log("url is not correct");
      } finally {
        setLoading(false);
      }
    };
    verifyUrl();
	
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(burl, { password });
      setMsg(data.message);
      setError("");
      navigate("/admin/login"); 
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setMsg("");
      } else {
        setError("An error occurred while resetting the password.");
        setMsg("");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
     
        <div className={styles.container}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Add New Password</h1>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            {msg && <div className={styles.success_msg}>{msg}</div>}
            <button type="submit" className={styles.green_btn}>
              Submit
            </button>
          </form>
        </div>
    </Fragment>
  );
};

export default Adminreset;
