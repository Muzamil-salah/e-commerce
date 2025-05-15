import axios from "axios";
import { createContext, useState } from "react";
import Cookies from 'js-cookie';

export  let productContext=createContext(0)




// function Remove product
 async function reomveProductItem(productId){
  return axios.delete(`http://localhost:8000/api/v1/product/${productId}`).then(({data})=>data).catch(err => err)
}

async function getProducts(){
  return axios.get('http://localhost:8000/api/v1/product/all').then(({data})=>data).catch(err => err)
}
   async function getBastsellers(){
        return axios.get(`http://localhost:8000/api/v1/product/bestSeller`,{
              headers:{
                authorization:`Bearer ${Cookies.get('token')}`,
              }
          }).then(({data})=>data).catch(err => err)
      }

 export default  function ProductContextProvider({children}){

    const [Counter , setCounter]=useState(0)


    return <productContext.Provider
     value={{getProducts,
      reomveProductItem,
      getBastsellers
      
        }}>
        {children}

    </productContext.Provider>
}

