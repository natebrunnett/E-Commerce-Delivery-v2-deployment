const Products = require('../models/Products.js');


class Product {

	async findAllReturn(req, res){
		try{
			const prods = await Products.find({});
			res.send(prods)
		}catch(e){
			res.send({e})
		}
	}





}

module.exports = new Product()