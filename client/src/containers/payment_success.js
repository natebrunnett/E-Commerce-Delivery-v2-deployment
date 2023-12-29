import React, { useEffect } from "react";
import axios from "axios";
//config
import URL from '../config.js';


const PaymentSuccess = (props) => {
  useEffect(() => {
    const getSessionData = async () => {
      // 11. Now when payment was successful we need to get back to Stripe to know what was paid for and who is the customer
      try {
        debugger;

        // 12. we get the session id from the localStorage
        const sessionId = JSON.parse(localStorage.getItem("sessionId"));
        // 13. And send request to checkout_session controller to get info from Stripe by session ID
        const response = await axios.get(
          URL+`payment/checkout-session?sessionId=${sessionId}`
        );
        // Then removing session id from localStorage
        localStorage.removeItem("sessionId");
        // 18. response from the server will contain data for the customer and the session with the order's info
        console.log("== response ==>", response);
        // 19. So from here we continue with whatever action is needed to be done after successful payment

        //if you need the products list in this page, you can find them in : response.data.session.display_items or in response.data.session.line_items depends on the version of API you are using
      } catch (error) {
        //handle the error here, in case of network error
        debugger;
      }
    };
    getSessionData();
  }, []);

  useEffect(()=> {
    const clearCart = async () => {
      try{
        props.setCart([]);
        const response = await axios.post(
          URL+`Login/clear`, {username: props.user}
        );
        console.log(response);
    //props.setCart
    //and also in the db
    //axios request to db to remove the cart
    //userController needs clearCart route 

      }catch(e){
        console.log("clear cart catching")}
    }
    //execute here
    if(props.user){
      console.log("clearing cart for..." + props.user); 
      clearCart(); 
    }
  }, [props.user])

  return (
    <div className="message_container">
      <div style={{ border: "2px solid  #35BFDE" }} className="message_box">
        <div className="message_box_left">
          <img
            alt="smile_icon"
            className="image"
            src={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Mr._Smiley_Face.svg/800px-Mr._Smiley_Face.svg.png"
            }
          />
        </div>
        <div style={{ color: "#35BFDE" }} className="message_box_right">
          Payment Successfull
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
