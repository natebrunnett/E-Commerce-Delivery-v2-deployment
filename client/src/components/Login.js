/*
Here we have the token exchange between client and server.
We are going to put the inputs into a form
and on submit we will run our backend logic

first we make a post request to the correct route
with the username and password

the backend checks if the user exists
and uses argon to compare the passwords
Upon success the token is created with jwt
and sent back as a response

with the client 
we decode the token using jose to extract the username
we set the user with the user decoded from the token
and we use localStorage.setItem and pass in the token
we also set isLoggedIn to true

now that isLoggedIn is set to true
we can use it to conditionally render the page

since the token is store in local storage until
the user clicks logout, we can useEffect() to keep
the user logged in when the page is refreshed 
or redirected

*/
import axios from "axios";
import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

let Login = (props) => {
  const [form, setValues] = useState({
    username: "",
    password: "",
  });

  let navigate = useNavigate();

	let handleSubmit = async (e) => {
		e.preventDefault();
		console.log("submit")
		try{
		const response = await 
		axios.post('http://localhost:3030/Login/login', 
		{username: form.username,
        password: form.password,});
		if(response.data.ok){
			//password match
			console.log(response.data)
			//navigate in 2 seconds
			setTimeout(() => {
			props.login(
			response.data.token)
			navigate('/Categories')
			}, 10);
		}else{
			console.log("data false")
			console.log(response.data)}
		}
		catch(error){console.log(error)}
	}

	let handleChange= (e) =>{
		setValues({ ...form, 
			[e.target.name]: e.target.value });
		console.log(form.username);
		console.log(form.password);
	}

	return (
	<>
	<form onSubmit={handleSubmit}
	onChange={handleChange}>
	<h1>Login</h1>
	<div className="Login">
		<input placeholder="username"
		name="username" />
		<input placeholder="password"
		name="password" />
		<button>Submit</button>
	</div>
	</form>
	<div className="Login">
		<NavLink to={"/ForgottenPassword"}>
			Forgot my password</NavLink>
	</div>
	</>)
}

export default Login