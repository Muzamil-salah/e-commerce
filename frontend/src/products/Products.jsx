import axios from 'axios'
import React, { useEffect, useState , useContext } from 'react'
import { storeContext } from '../context/storeContext.js';
import { WishListContext } from '../context/WishlistContext.js';
import Loader from '../Loader/Loader'
import Product from '../product/Product';
import { useQuery } from 'react-query';
export default function Products() {

    let { setCounter, getCart, setInCart, setCartItems } = useContext(storeContext);
    let {  getFromWishList, setIsLoved } = useContext(WishListContext);
 async function getProducts(){
    return axios.get('http://localhost:8000/api/v1/product/all')
  }

 let {data , isError , isLoading , isFetching}=  useQuery('getProducts' , getProducts , {
  cacheTime:1000
})


  async function getPrevValues() {
    let data = await getFromWishList();
    const loved = data.wishlistItems.map((element) => element._id);
    setIsLoved(loved);
    // //////////////////////
    let cartItems = await getCart();
    setCartItems(cartItems.cartItems)
    
    let items = cartItems.cartItems.map((element) => element.product._id);
    setInCart(items);
    setCounter(cartItems.length);


  }

    useEffect(() => {
  

      getPrevValues();
    }, []);


  if(isLoading) return <Loader/>
  return (
    <div className='Dark-Color pt-5'>
     
     <div className="container py-5">
      <div className="row">
     {data?.data?.products?.map(item=>{
      return <Product item={item} key={item._id}/>
     })}
      </div>
     </div>
    </div>
  )
}
