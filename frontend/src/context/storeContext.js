import axios from "axios";
import { createContext, useState } from "react";
import Cookies from 'js-cookie';

export  let storeContext=createContext(0)
const token = Cookies.get('token');
// function add to cart
async function addToCart(productId , quantity=1){
   return axios.post(`http://localhost:8000/api/v1/cart/add/${productId}` ,{quantity},{
    headers:{
      authorization:`Bearer ${Cookies.get('token')}`
    }
   })
  .then(({data})=>data).catch(err => err)
}


// function get items form cart
 async function getCart(){
  return axios.get('http://localhost:8000/api/v1/cart/all',{
   headers:{
     authorization:`Bearer ${Cookies.get('token')}`
   }
  }).then(({data})=>data).catch(err => err)
}



// function Remove from cart
 async function reomveCartItem(productId){
  return axios.delete(`http://localhost:8000/api/v1/cart/delete/${productId}` ,{
   headers:{
     authorization:`Bearer ${Cookies.get('token')}`
   }
  })
 .then(({data})=>data).catch(err => err)
}


// function Update Quantity
async function UpdateQuantity(productId , operation){
  return axios.put(`http://localhost:8000/api/v1/cart/update/${productId}`,{operation} ,{
   headers:{
     authorization:`Bearer ${Cookies.get('token')}`
   }
  })
 .then(({data})=>data).catch(err => err)
}


// function Delete cart
async function deleteCart(){
  return axios.delete('http://localhost:8000/api/v1/cart/reset',{
   headers:{
     authorization:`Bearer ${Cookies.get('token')}`
   }
  })
 .then(({data})=>data).catch(err => err)
}


 export default  function StoreContextProvider({children}){

    let [Counter , setCounter]=useState(0)
    let [inCart, setInCart] = useState([]);
    let [cartItems, setCartItems] = useState([]);
    let [totalPrice , setTotalPrice]=useState(0)
    return <storeContext.Provider
     value={{Counter, 
        setCounter ,
        inCart,
        setInCart,
        cartItems,
        setCartItems,
        totalPrice,
        setTotalPrice,
        addToCart ,
        getCart ,
        reomveCartItem ,
        UpdateQuantity ,
        deleteCart,
        }}>
        {children}

    </storeContext.Provider>
}