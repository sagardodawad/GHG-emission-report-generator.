import { useState } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';
import styles from './styles.module.css';

const Login=()=>{
    const [data, setData] = useState({
        email:"",
        password:""
    });
    const [error, setError] = useState("");
    const handleChange=({currentTarget:input})=>{
        setData({
          ...data,
            [input.name]:input.value
        });
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
       try{
          const url='http://localhost:8080/admin';
          const res=await axios.post(url,data);
          localStorage.setItem('token1',res.data.token.userId);
          window.location='/adminhome'
       }
         catch(error){
            if(error.response && error.response.status>=400 && error.response.status<=500){
               setError(error.response.data.message);
            }
        }
    };

    return(
        <div className={styles.login_container}>
          <div className={styles.login_form_container}>
            <div className={styles.left}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
                <h1>
                   Login to your account
                </h1>
                
                <input 
                type="email" 
                placeholder='Email'
                name='email'
                onChange={handleChange}
                value={data.email}
                required
                className={styles.input}
                />
                <input 
                type="password" 
                placeholder='Password'
                name='password'
                onChange={handleChange}
                value={data.password}
                required
                className={styles.input}
                 />
     <div className={styles.adminpanel}>
     <Link to="/admin/forgot-password"  style={{ alignSelf: "flex-start" }}>
							<p style={{ padding: "0 15px" }}>Forgot Password ?</p>
						   </Link>
               <Link to="/login" style={{ alignSelf: "flex-start" }}>
							<p style={{ padding: "0 15px" }}>User ?</p>
						   </Link>
     </div>
            
             
						 {error && <div className={styles.error_msg}>{error}</div>}
                <button type="submit" className={styles.green_btn}>Sign In</button>

             </form>
          </div> 
          </div> 
        </div>
    )

}

export default Login;