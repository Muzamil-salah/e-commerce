import axios from "axios";
import { createContext, useState } from "react";
import Cookies from 'js-cookie';



export  let orderContext=createContext(0)

    // function get product from Wish list
  
    
         async function getOrder(orderId) {
         return axios.get(`http://localhost:8000/api/v1/order/${orderId}`,{
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
    return <orderContext.Provider value={{orders,
        setOrders,
        loading,
        setLoading,
        error,
        setError,
        getOrder,
        updateOrder
         
    }}>
        {children}

    </orderContext.Provider>
}