const Customer = require('../models/Customer.js');
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
//magic link
const validator = require("validator");
const {send_magic_link} = require('./emails.js')
const { v4: uuidv4 } = require('uuid');

class User {

	//magiclink
	async loginWithMagicLink(req, res){
		const { email, magicLink } = req.body;
		if (!email){
			return res.send({ ok: false, message: "All field are required" });
		}
		if (!validator.isEmail(email))
			return res.send({ ok: false, 
				message: "inavlid email provided"})
		//if we have a valid email and an email
		try{
			//find the username in the db
			const user = await Customer.findOne({ 
			username:email });
			if(!user){
				//option: add user
				res.send({ ok: false,
					message: "username not found"})
			}else if(!magicLink)
			{
				//if magicLink is not passed
				//into this function
				//we will send it to the provided email
				try{
					//set the magicLink id in the Customerchema
					//set the magiclink expired to false
					//send magiclink
					const user = await Customer.findOneAndUpdate(
							{username:email}, 
							{MagicLink: uuidv4(), MagicLinkExpired: false}, 
							{returnDocument:'after'}
							);
		    		// send email with magic link
		    		send_magic_link(email,user.MagicLink)
					res.send({ok:false,message:'Hit the link in email to sign in, can take up to 10mins')
				}catch(e){res.send({e, ok: false, 
					message:"failed to send mail"})}
				//send back a signed token using user
			}else if(user.MagicLink == magicLink && !user.MagicLinkExpired) {
		      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: "1h" }); //{expiresIn:'365d'}
		      //set the variable to expired, and send back the token
		      await Customer.findOneAndUpdate(
		      	{username:email}, 
		      	{MagicLinkExpired: true}
		      	)
		      res.json({ ok: true, message: "Welcome back", token, email });
		    }
		} catch(e)
		{
			console.log(e)
		res.send({e, ok:false})}
		//this same function is used to return
		//the token to the client

	}

	async findAllUsers(req, res){
		try{
			const user = await Customer.find({});
			res.send(user)
		}catch(e){
			res.send({e})
		}
	}

	async addUser(req,res){
		//creat salt for the hash
		const salt = "321dsa"
		//import our params which we recieve from the client
		let {username: name, password: passName}=req.body
		try{
			//first find if the username is taken
			const user = await Customer.findOne({username: name});
			if (user) return res.json({ ok: false, message: "User exists!"});
			//next we will use validator
			if (!validator.isEmail(name))
				return res.json({ ok: false, message: "invalid email provided" });
			const hash = await argon2.hash(passName, salt);
			const user_added = await Customer.create({
				username: name,
				password: hash,
			})
			res.send({ok: true, message: "User successfully added"})
		}
		catch(e){
			res.send({ok: false, e, message: "error"});
		}
	}

	async delete (req, res){
		let { username: name } = req.body;
		try{
			const removed = await Customer.deleteOne({username: name});
			res.send({name});
		}
		catch(error){
			res.send({error})
		};
	}

	async getCart(req, res){
		let { username: name } = req.body;
		try{
		   const user = await Customer.findOne({username: name});
	       if(!user) res.send("cannot find user");
	       let currentCart = user.cart;
	       res.send(currentCart);

		}catch(error){
			res.send(error);
		}
	}

	async addItemToCart(req, res){
		let { username: name, product: prodObject} = req.body;
		try{
	       const user = await Customer.findOne({username: name});
	       if(!user) res.send("cannot find user");
	       let newCart = user.cart;
	       prodObject.id = uuidv4();
	       newCart.push(prodObject);
	       const updatedUser = await Customer.updateOne(
	       	{username: name},
	       	{
	       		cart: newCart
	       	})
	       res.send(newCart);
	    }
	    catch(error){
	        res.send({error});
	    };
	}

	async clearCart(req, res){
		let {username: name} = req.body;
		try{
			const user = await Customer.findOne({username: name});
	       if(!user){
	       	res.send({ok:false, message:"cannot find user"});
	       } 
	       if(true){
			try{
				await Customer.updateOne(	{username: name},
	        	{ cart: []  })
				res.send({ok: true, message: "success"})
			}
			 catch(e){res.send({e, ok: false, message:"errir"})}
		}}catch(e){res.send({e, ok:false,
			message:"clear cart error"})}
		}

	async removeItemFromCart(req, res){
		let { username: name, id: prodId} = req.body;
		try{
	       const user = await Customer.findOne({username: name});
	       if(!user){
	       	res.send({ok:false, message:"cannot find user"});
	       } 
	       
		let newCart = user.cart;
	       for(let i = 0; i < newCart.length; i++)
	       {
	       	// console.log("idx " + String(newCart[i]['_id']));
	       	// console.log("key " + String(prodId))
	       	if(String(newCart[i].id) === String(prodId)){
	       		newCart.splice(i, 1);
	       	}
	       }
	       const updatedUser = await Customer.updateOne(
	       	{username: name},
	       	{
	       		cart: newCart
	       	})
	       res.send(newCart);
	    }
	    catch(error){
	        res.send({error});
	    };
	}

	async login(req, res){
		let {username: name, password: passName}=req.body
		try{
			const user = await Customer.findOne({username: name})
			if(!user) return res.json({ok:false, message:"User not found!"})
			const match = await argon2.verify(user.password, passName);
			if(match){
			// once user is verified and confirmed we send back the token to keep in localStorage in the client and in this token we can add some data -- payload -- to retrieve from the token in the client and see, for example, which user is logged in exactly. The payload would be the first argument in .sign() method. In the following example we are sending an object with key userEmail and the value of email coming from the "user" found in line 47
	  		const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
	    	expiresIn: "1h",
	  		}); //{expiresIn:'365d'}
	  		// after we send the payload to the client you can see how to get it in the client's Login component inside handleSubmit function
	  		res.json({ ok: true, message: "login success", token, user });
			}else{
				res.json({ok:false,
				message:"incorrect password"})
			}
		}catch(e){
			res.send({e})
		}
	}

	async verifyToken(req, res){
		const token = req.headers.authorization;
		jwt.verify(token, process.env.JWT_SECRET, (err, succ) => {
			err
	  		  ? res.json({ ok: false, message: "Token is corrupted" })
	  		  : res.json({ ok: true, succ });
	});
	}
}

module.exports = new User()