import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import EmailVerify from "./components/EmailVerify";
import ForgotPassword from "./components/ForgotPassword";
import PasswordReset from "./components/PasswordReset";
import Home from "./components/Main/Home";
import History from "./components/Main/History";
import Contact from "./components/Main/Contact";
import Admin from "./components/Admin/index";
import Adminforgot from "./components/Admin/adminforgot";
import Adminreset from "./components/Admin/adminreset";
// import Adminsignup from "./components/Admin/Signup";
import Adminhome from "./components/Admin/Adminhome";

function App() {
	const user = localStorage.getItem("token");
	const admin = localStorage.getItem("token1")
	console.log(user,admin);
  
	return (
		<Routes>	
			{
				 !user && !admin &&
				 <>
			<Route path="/signup" exact element={<Signup />} />	
			<Route path="/login" exact element={<Login />} />
			<Route path="/:id/verify/:token" element={<EmailVerify />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route path="/password-reset/:userId/:token" element={<PasswordReset />} />
			
			<Route path="/admin/forgot-password" element={<Adminforgot />} />
			
			<Route path="/admin/password-reset/:userId/:token" element={<Adminreset/>} />
				 </>
			}
			
			
			
				
			{/* <Route path="/admin/signup" exact element={<Adminsignup />} /> */}
			
			{user && <Route path="/" exact element={<Home />} />}
			{user && <Route path="/home" exact element={<Home/>} />}
			{user && <Route path="/history" exact element={<History/>} />}
			{user && <Route path="/contact" exact element={<Contact/>} />}
			
			{
				user &&
				<Route path="*" element={<Navigate replace to="/home" /> } />
			}
		{
			!user && !admin &&
			<Route path="/admin" exact element={<Admin />} />
		}	
			{admin && <Route path="/adminhome" exact element={<Adminhome/>} />}
			{
				admin &&
			<Route path="*" element={<Navigate replace to="/adminhome" /> } />
			}
			<Route path="*" element={<Navigate replace to="/login" /> } />

		</Routes>
	);
}

export default App;