  // name: "Bulgogi Beef Dish",
  // description: "Rib-eye beef 600 grams",
  // price: 1699 
  // quantity: 1

let Products = (props) => {

	let renderProducts=()=>(
    props.thisProducts.map((prod,idx)=>{
    let thisPrice = parseFloat(prod.price * .01).toFixed(2);
    return(
    <div key={idx} className="product">
    <div className="top">
        <img src={prod.image[0]} />
        <div className="productTitle" 
        
         
        ><b>{prod.name}</b></div>
        <p 
        style={{ fontSize: '14px'}}
        ><b>{thisPrice}€</b></p>
        <p className="description" 
        >{prod.description}</p>
        <p>Quantity: {prod.quantity}</p>
        {/*<p key={idx}>Idx: {idx}</p>*/}
    </div>
    <div className="bottom">
        <button onClick={() => props.AddToCart({idx})}>Add to cart</button>	
    </div>
    </div>)})
    )
	return (
	<><h1>Dishes</h1>
	<div className="productGrid">
	{renderProducts()}
	</div>
	</>)
}

export default Products