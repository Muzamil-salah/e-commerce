import axios from "axios";
import { createContext, useState } from "react";
import Cookies from 'js-cookie';



export  let orderContext=createContext(0)

    // function get product from Wish list

   async function getOrderById(){
        return axios.get('http://localhost:8000/api/v1/order/getById',{
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

      async function getMyOrders() {
         return axios.get(`http://localhost:8000/api/v1/order/getById`,{
              headers:{
                authorization:`Bearer ${Cookies.get('token')}`,
              }
          }).then(({data})=>data).catch(err => err)
      }


      
      async function updateOrder(updates , orderId = Cookies.get('orderId')) {
      //  let orderId= Cookies.get('orderId')
         return axios.put(`http://localhost:8000/api/v1/order/update/${orderId}`,updates,{
              headers:{
                authorization:`Bearer ${Cookies.get('token')}`,
              }
          }).then(({data})=>data).catch(err => err)
      }




       

 export default  function OrderContextProvider({children}){
    const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let [isDeleted, setIsDeleted] = useState([]);
    return <orderContext.Provider value={{orders,
        setOrders,
        loading,
        setLoading,
        error,
        setError,
        isDeleted,
        setIsDeleted,
        getOrderById,
        getOrderPrices,
        getOrder,
        getMyOrders,
        updateOrder
         
    }}>
        {children}

    </orderContext.Provider>
}