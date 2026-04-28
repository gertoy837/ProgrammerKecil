import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetail(){

  const [product,setProduct] = useState(null);

  useEffect(()=>{

    axios.get("http://localhost:5000/api/products/1")
      .then(res => setProduct(res.data));

  },[]);

  if(!product) return <p>Loading...</p>;

  return(
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
    </div>
  );
}