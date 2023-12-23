import {useState} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

let Register = () => {

 	const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const navigate = useNavigate();

  let handleChange1=(e)=>{
    setInput1(e.target.value)
    console.log(input1)
  }

  let handleChange2=(e)=>{
    setInput2(e.target.value)
    console.log(input2)
  }

  let addUser=()=>{
    axios.post('http://localhost:3030/Login/add', {username:input1,
    password:input2})
    .then((res)=>{
      alert(`message: ${res.data.message}. Remember: Keep track of your
        credentials!`)
      setInput1('');
      setInput2('');
      navigate("/Login");
    })
    .catch((err)=>{
      console.log(err)
    })
  }

	return(
	<><h1>Register</h1>
      <input value={input1} onChange={handleChange1}
      placeholder="user"/>
      <input value={input2} onChange={handleChange2}
      placeholder="password"/>
      <button onClick={addUser}>Add</button>
	</>
	)
}

export default Register