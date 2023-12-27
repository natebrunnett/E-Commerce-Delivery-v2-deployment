import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStripe } from "@stripe/react-stripe-js";
import { useEffect } from "react"

let Cart = (props) => {
  	const navigate = useNavigate();
  	const stripe = useStripe();

   const calculate_total = () => {
    let total = 0;
    props.cart.forEach((ele) => (total += ele.quantity * ele.price));
    total = parseFloat(total * .01).toFixed(2);
    return total;
  };

    // 1. When we click PAY button this function triggers first
  const createCheckoutSession = async () => {
    try {
      debugger;
      // 2. Sending request to the create_checkout_session controller and passing products to be paid for
      const response = await axios.post(
        `http://localhost:3030/payment/create-checkout-session`,
        { products: props.cart }
      );
      return response.data.ok
        ? // we save session id in localStorage to get it later
          (localStorage.setItem(
            "sessionId",
            JSON.stringify(response.data.sessionId)
          ),
          // 9. If server returned ok after making a session we run redirect() and pass id of the session to the actual checkout / payment form
          redirect(response.data.sessionId))
        : navigate("/payment/error");
    } catch (error) {
      navigate("/payment/error");
    }
  };

const redirect = (sessionId) => {
    debugger;
    // 10. This redirects to checkout.stripe.com and if charge/payment was successful send user to success url defined in create_checkout_session in the controller (which in our case renders payment_success.js)
    stripe
      .redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: sessionId,
      })
      .then(function (result) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      });
  };
	let renderCart=()=>(
    props.cart.map((prod,idx)=>{
    let thisPrice = parseFloat(prod.price * .01).toFixed(2);
    return(
    <div key={idx}className="cartRow">
    	<div className="hugLeft">
    		<img src={prod.image[0]} />
    		<div className="infoContainer">
    			<p><b>{prod.name}</b></p>
   				<p>{thisPrice} €</p>
    			<p className = "quantity">Quantity: {prod.quantity}</p>
    		</div>
    	</div>
    	<button onClick={() => props.removeFromCart(prod['_id'])}> x </button>	
    </div>)})
    )

  useEffect(() => {
    if(props.user) props.getCart();
  }, [])

	return(
	<>
	<h1>Cart</h1>
	<div className="cart">
	{renderCart()}
	<div className="payment">
	<p>Total : {calculate_total()} €</p>
	<button className="payButton" onClick={() => createCheckoutSession()}>checkout</button>
	</div>
	</div>
	
	</>
	)
}

export default Cart