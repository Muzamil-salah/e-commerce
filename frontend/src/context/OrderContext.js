import axios from "axios";
import { createContext, useState } from "react";
import { baseURL } from "../utiles/baseUrl";
import Cookies from 'js-cookie';



export  let orderContext=createContext(0)

// function add product to Wish list
   async function  createOrder(orderData){
      return axios.post(`http://localhost:8000/api/v1/order/add`,orderData,{
            headers:{
                authorization:`Bearer ${Cookies.get('token')}`,
            }
        }).then(({data})=>data).catch(err => err)
    }


    // function get product from Wish list

   async function getOrderById(){
        return axios.get('http://localhost:8000/api/v1/order/getById',{
              headers:{
                authorization:`Bearer ${Cookies.get('token')}`,
              }
          }).then(({data})=>data).catch(err => err)
      }
  


      // function remove from Wish list
   async function removeWishItem(productId){
        return axios.delete(`http://localhost:8000/api/v1/wishlist/delete/${productId}`,{
              headers:{
                authorization:`Bearer ${Cookies.get('token')}`,
              }
          }).then(({data})=>data).catch(err => err)
      }

      async function getOrderPrices() {
         return axios.get(`http://localhost:8000/api/v1/order/getPrices`,{
              headers:{
                authorization:`Bearer ${Cookies.get('token')}`,
              }
          }).then(({data})=>data).catch(err => err)
      }
         async function getOrder(orderId) {
         return axios.get(`http://localhost:8000/api/v1/order/${orderId}`,{
              headers:{
                authorization:`Bearer ${Cookies.get('token')}`,
              }
          }).then(({data})=>data).catch(err => err)
      }


       

 export default  function OrderContextProvider({children}){
    const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    return <orderContext.Provider value={{orders,
        setOrders,
        loading,
        setLoading,
        error,
        setError,
        createOrder,
        getOrderById,
        getOrderPrices,
        getOrder
         
    }}>
        {children}

    </orderContext.Provider>
}