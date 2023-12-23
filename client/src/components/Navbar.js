import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({isLoggedIn}) => {
	return (
	<div className="navbar">
	<NavLink to={"/Categories"}
	style={ ({isActive}) => (
    isActive ? linkStyles.activeLink : linkStyles.defaultLink
  )}>Order</NavLink>
	{isLoggedIn === false && <>
	<NavLink to={"/Register"}
	style={ ({isActive}) => (
    isActive ? linkStyles.activeLink : linkStyles.defaultLink
  )}>Register</NavLink>
	<NavLink to={"/Login"}
	style={ ({isActive}) => (
    isActive ? linkStyles.activeLink : linkStyles.defaultLink
  )}>Login</NavLink>
	</>}
	<NavLink to={"/Admin"}
	style={ ({isActive}) => (
    isActive ? linkStyles.activeLink : linkStyles.defaultLink
  )}>Admin</NavLink> 
	<NavLink to={"/Cart"}style={ ({isActive}) => (
    isActive ? linkStyles.activeLink : linkStyles.defaultLink
  )}>Cart</NavLink>
	</div>
	)
}

export default Navbar

const linkStyles = {
  activeLink: {
    color: "gray",
  },
  defaultLink: {
    textDecoration: "none",
    color: "white",
  },
};