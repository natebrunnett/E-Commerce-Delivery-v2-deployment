import './App.css';
import {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login"
import Admin from "./components/Admin"
import Navbar from "./components/Navbar.js"
import Products from "./components/Products.js"
import Register from "./components/Register"
import Cart from "./components/Cart"
import * as jose from "jose";
import bulgogi from "./media/bulgogi.png"
import injeolmi from "./media/Injeolmi.png"
import sundubu from "./media/sundubu_jjigae.png"

//stripe
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import PaymentSuccess from "./containers/payment_success";
import PaymentError from "./containers/payment_error";

//magicLink
import Enter from './components/Enter.js'
import ForgottenPassword from "./components/ForgottenPassword.js"

function App() {

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [user, setUser] = useState(null)
const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
const [cart, setCart] = useState([]);

//stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);


useEffect(() => {
  const verify_token = async () => {
    try {
      if(!token){
        setIsLoggedIn(false)
        console.log("no token")
        console.log(token)
      } else {
        console.log("token found")
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.post('http://localhost:3030/Login/verifyToken');
        //console.log(response);
        return response.data.ok ? login(token) : logout();
      }
    }catch(error){
      console.log(error)
    }
  }
  verify_token();
  console.log("useEffect1=" + user)
}, [token]);

useEffect(()=>{
  const getCart = async () => {
    axios.post('http://localhost:3030/Login/getCart', 
      {username:user})
    .then((res) => {
      // console.log("user " + user)
      // console.log("res: " + res.data)
      if (res.data !== "cannot find user") setCart(res.data);
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  console.log("useEffect2=" + user)
  if(user) getCart();
}, [user])

let UserInfo = () => {
  return (
    <>
      {
        isLoggedIn === true && <> 
        <div className="UserInfo">
        <p><b>{user}</b></p>
        <button onClick={logout}>logout</button>
        </div> 
        </>
      }
    </>
  );
}

let checkToken = () => {
  console.log(token)
}

let logout = () => {
  localStorage.removeItem("token");
  setUser(null);
  setIsLoggedIn(false);
  setCart([]);
  alert("You have logged out");
}

let login = (token) => {
  let decodedToken = jose.decodeJwt(token);
  setUser(decodedToken.username);
  setIsLoggedIn(true);
  localStorage.setItem("token", JSON.stringify(token));
  alert('Welcome back!')
}


  let thisProducts = [
  { 
  image: [sundubu],
  name: "Sundubu Jjigae Tofu Stew",
  description: "Spicey soup with tofu, mushrooms, clams and vegetables",
  price: 1599, 
  quantity: 1
  },
  { 
  image: [injeolmi],
  name: "Injeolmi",
  description: "Brown sugar rice cakes. Dessert dish or appetizer! 6 pieces.",
  price: 799,
  quantity: 1
  },
  {
  image: [bulgogi],
  name: "Bulgogi Beef Dish",
  description: "Rib-eye beef 600 grams",
  price: 1699,
  quantity: 1
  }
  ];

/*
let removeFromCart = (idx) => {
get idx from cart, play around with
the idx from cart, see if we cann
remove a cart through the backend
with the exact index...
This means I would need to return
an index from Cart.js that is
and index from the Cart array.

*/


//after a payment, plug id: all into this function and we will call a delete all function in the controller if id === all 
let removeFromCart = (thisId) => {
  axios.post('http://localhost:3030/Login/deleteCartItem', 
      {username:user, id: thisId})
    .then((res) => {
      setCart(res.data);
      alert("Dish removed");
    })
    .catch((err)=>{
      console.log(err)
    })
}

  // let updateCart=()=>{
  //   axios.post('http://localhost:3030/Login/update', 
  //     {username:inputUpdate, product: inputNewPass})
  //   .then((res) => {
  //     console.log(res.data)
  //     setInputUpdate('');
  //     setInputNewPass('');
  //   })
  //   .catch((err)=>{
  //     console.log(err)
  //   })
  // }

//user must be logged in to click button

let AddToCart = (idx) =>
{
  if(isLoggedIn){
  let newItem = {}
  newItem = thisProducts[parseInt(idx.idx)];
  //axios post will add newItem to cart in db
  //then it will return the updated cart
  //setCart with the newcart response
  axios.post('http://localhost:3030/Login/update', 
      {username:user, product: newItem})
    .then((res) => {
      setCart(res.data);
      alert("Dish added to your cart")
      console.log(cart);
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  else{
    alert("Please login to continue")
  }
  
}

//magic link
let [thisEmail, setEmail] = useState('')

let sendLink = async (email, magicLink, props) => {
  try{
    let res = await axios.post(`http://localhost:3030/Login/enter`,
      {email: email ,magicLink})
    if(res.data.ok)
    {
      login(res.data.token)
    }
    else
      alert(res.data.message)
  }catch(e){alert(e)}
}

  return (
   <Router>
      <UserInfo />
      <Navbar isLoggedIn={isLoggedIn}/>
      <Routes>
        <Route path="/" element={<Navigate to="/Categories" />} />
        <Route path="/Login" element={<Login login={login}/>} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Categories" element={<Products AddToCart={AddToCart} thisProducts={thisProducts}/>} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Cart" element={
          <Elements stripe={stripePromise}>
            <Cart 
            removeFromCart={removeFromCart} cart={cart}/>
          </Elements>
        } />
        <Route
          path="/payment/success"
          element={<PaymentSuccess />}
        />
        <Route
          path="/payment/error"
          element={<PaymentError />}
        />
        <Route
          path="/ForgottenPassword"
          element={<ForgottenPassword 
          login={login}
          sendLink={sendLink}
          thisEmail={thisEmail}
          setEmail={setEmail}/>}
        />
        <Route
          path="enter/:email/:link"
          element={<Enter sendLink={sendLink} thisEmail={thisEmail}/>}
        />
      </Routes>
    </Router>
  );
}

export default App;
