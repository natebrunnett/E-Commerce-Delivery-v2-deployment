const Users = require('../models/User.js');
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
class User {
	
	/*
async addItemToCart
params: username, productName
Users.find to see if user exists
if(!user) then send an ok false
Users.updateOne(username, some
how push to the array with product 
name)

async removeItemFromCart
*/
	
	async findAllUsers(req, res){
		try{
			const users = await Users.find({});
			res.send(users)
		}catch(e){
			res.send({e})
		}
	}

	async addUser(req,res){
		const salt = "321dsa"
		let {username: name, password: passName}=req.body
		try{
			const user = await Users.findOne({username: name});
			if (user) return res.json({ ok: false, message: "User exists!"});
			const hash = await argon2.hash(passName, salt);
			const user_added = await Users.create({
				username: name,
				password: hash,
			})
			res.send({ok: true, message: "User successfully added"})
		}
		catch(e){
			res.send({ok: false, e});
		}
	}

	async delete (req, res){
		let { username: name } = req.body;
		try{
			const removed = await Users.deleteOne({username: name});
			res.send({name});
		}
		catch(error){
			res.send({error})
		};
	}

	async getCart(req, res){
		let { username: name } = req.body;
		try{
		   const user = await Users.findOne({username: name});
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
           const user = await Users.findOne({username: name});
           if(!user) res.send("cannot find user");
           let newCart = user.cart;
           newCart.push(prodObject);
           const updatedUser = await Users.updateOne(
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

	async removeItemFromCart(req, res){
		let { username: name, id: prodId} = req.body;
		try{
           const user = await Users.findOne({username: name});
           if(!user) res.send("cannot find user");
           let newCart = user.cart;
           for(let i = 0; i < newCart.length; i++)
           {
           	// console.log("idx " + String(newCart[i]['_id']));
           	// console.log("key " + String(prodId))
           	if(String(newCart[i]['_id']) === String(prodId)){
           		newCart.splice(i, 1);
           	}
           }
           const updatedUser = await Users.updateOne(
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
			const user = await Users.findOne({username: name})
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