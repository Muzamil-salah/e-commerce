import axios from "axios";
import { createContext, useState } from "react";
import Cookies from 'js-cookie';



export  let WishListContext=createContext(0)

// function add product to Wish list
   async function  addToWishList(productId){
      return axios.post(`http://localhost:8000/api/v1/wishlist/add/${productId}`,{},{
            headers:{
                authorization:`Bearer ${Cookies.get('token')}`,
            }
        }).then(({data})=>data).catch(err => err)
    }


    // function get product from Wish list

   async function getFromWishList(){
        return axios.get('http://localhost:8000/api/v1/wishlist/byUser',{
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
       

 export default  function WishListContextProvider({children}){
    let [WCounter , setWCounter]=useState(0)
    let [isLoved, setIsLoved] = useState([]);
    return <WishListContext.Provider value={{WCounter 
        , setWCounter,
        isLoved,
        setIsLoved,
         addToWishList ,
         getFromWishList ,
         removeWishItem
    }}>
        {children}

    </WishListContext.Provider>
}