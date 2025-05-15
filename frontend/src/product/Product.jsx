import React, { useContext, useState , useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import { storeContext } from '../context/storeContext'
import { toast } from 'react-toastify'
import { WishListContext } from '../context/WishlistContext'
import axios from 'axios'
import { useQuery } from 'react-query'


export default function Product({item}) {
// console.log(item.images[0]);

  let { Counter ,setCounter , addToCart , getCart , inCart ,setInCart ,setCartItems , setTotalPrice}=useContext(storeContext)
 let {addToWishList , setWCounter , removeWishItem ,getFromWishList ,isLoved ,setIsLoved }= useContext(WishListContext)
 
  let [btnLoading , setBtnLoading]=useState(true)
  // const [isLoved, setIsLoved] = useState([]);
  // const [inCart, setInCart] = useState([]);

  // async function getPrevValues(){
  //   let data=  await getFromWishList()
    
  //   const loved = await data.wishlistItems.map(element => element._id);
    
  //     setIsLoved(loved);

  //     // //////////////////////
  //     let cartItems= await getCart();
  //     let items=await cartItems.cartItems.map(element => element.product._id);
  //      setInCart(items)
     
      
  //     setCounter(cartItems.length)


  // }
  // useEffect(() => {
  //   // هنا بتحطي الفانكشن اللي تشتغل مرة واحدة بس
  //   getPrevValues()
    
    
   
   
  // }, []);
  // console.log(data)
// ---------------------------- now i am heeeeeeeeereeeeeeeeeeeeeeeee -------------------------------------------
// add to cart function
 async function addProductToCart( productId){
  setBtnLoading(false)
    let data=  await addToCart(productId)
    if(data?.status=='success'){

      let items=data.cartItems.map(element => element.product._id);
      setInCart(items)
      setCounter(data.length)
      setBtnLoading(true)
      toast.success("Product added successfully !")
    }
    else if(data?.status=='remove'){
      let items=data.cartItems.map(element => element.product._id);
      setInCart(items)
      setCounter(data.length)
      setBtnLoading(true)
      toast.error("Product deleted successfully !")

    }
     setCartItems(data.cartItems)
     setTotalPrice(data.totalPrice)
    // if(data.status=='success'){
    //   setBtnLoading(true)
    //   setCounter(data.numOfCartItems)
    //   toast.success("Product added successfully !")
    // }
 } 

// add to WishList function

async function addProductToWishList(productId){
  
  console.log(item);
  
    let data=  await addToWishList(productId)
    console.log(data);
    if(data.status=='success'){

      setWCounter(data.length)
      console.log(data.wishlist );
      const loved = data.wishlist.map(element => element);
      console.log(loved);
      
      setIsLoved(loved);

      toast.success("Product added successfully !")
    }
    else if(data.status=='deleted'){
      setWCounter(data.length)
      const loved = data.wishlist.map(element => element);
      setIsLoved(loved);
      console.log(data.wishlist);
      toast.warning("Product deleted successfully !")

    }
 } 

 async function deleteWishItem(id) {
  let data = await removeWishItem(id);
  console.log(data);
  if(data.status=='success'){
    setWCounter(data.length);
    // console.log(`isLoved before deleting ${isLoved}` );
    // setIsLoved(!isLoved);
    // console.log(`isLoved after deleting ${isLoved}` );
    toast.warning("Product deleted successfully !")
  }

}

  return (
    <>
      <div className="col-lg-2 col-sm-4 h-10" >
      <div className="product h-10 text-white p-2 cursor-pointer rounded-3 gray-border my-3">
        {/* start link to product details */}
      <Link className='un-underline' to={'/product-details/'+item._id}>
      <img className='w-100' src={item.images[0]} alt="" />
      {/* <span className='main-color'>{item.category.name}</span> */}
        <h5 className='my-2 fw-bold'>{item.description.split(' ').slice(0,2).join(' ')}</h5>
      
        {/* start details */}
        <div className=' d-flex justify-content-between'>
          <div>
            {/*   Total Cart Price : {Number(data?.totalPrice || 0).toLocaleString('en-EG', { style: 'currency', currency: 'EGP' })} */}
            {Number(item.price).toLocaleString()} EGP
          </div>
          <div>
          <i className="fa-solid fa-star ratingColor"></i>
            {/* {item.rating} */}
            {typeof item.rating === 'number' ? item.rating.toFixed(1) : '0.0'}
          </div>
        </div>
        {/* end details */}
      </Link>
        {/* end link to product details */}
      
        <i className={`icon-link fa-solid fa-heart ms-2 mb-3 ${isLoved.includes(item._id) ? 'text-danger' : ''}`} onClick={()=>{ addProductToWishList(item._id)}}></i>
        <button disabled={!btnLoading} onClick={()=> addProductToCart(item._id)} className='btn bg-main w-100 '>
          {inCart.includes(item._id) ? ' Remove item' : 'Add To Cart'}
         
          </button>
      </div>
    </div>
    </>
  )
}
