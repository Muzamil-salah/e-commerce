
import axios from 'axios'
import React, { useContext, useState , useEffect} from 'react'
import { useQuery } from 'react-query'
import Loader from '../../Loader/Loader'
import { Link, useParams } from 'react-router-dom'
import { storeContext } from '../../context/storeContext.js'
import { toast } from 'react-toastify'
import { WishListContext } from '../../context/WishlistContext'
import CategoryNavbar from '../categoryNavbar/CategoryNavbar.jsx'


export default function Laptop() {

   let {setCartItems,setTotalPrice, Counter ,setCounter , addToCart , getCart , inCart ,setInCart}=useContext(storeContext)
   let {addToWishList , setWCounter , removeWishItem ,getFromWishList ,isLoved ,setIsLoved }= useContext(WishListContext)
    let [btnLoading, setBtnLoading] = useState(true)

     const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';
  // Check if it's already a full URL (for seeded data maybe)
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise construct the proper URL
  return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/uploads/${imagePath}`;
};
      // const [isLoved, setIsLoved] = useState([]);
      // const [inCart, setInCart] = useState([]);


      // async function getPrevValues(){
      //   let data=  await getFromWishList()
      //   const loved = data.wishlistItems.map(element => element._id);
      //     setIsLoved(loved);
      //     // //////////////////////
      //     let cartItems= await getCart();
      //     let items=cartItems.cartItems.map(element => element.product._id);
      //     setInCart(items)
          
      //     setCounter(cartItems.length)
    
      // }    

      //   useEffect(() => {
      //     // هنا بتحطي الفانكشن اللي تشتغل مرة واحدة بس
      //     getPrevValues()
         
         
      //   }, []);


    function getProducts(){
        return axios.get('http://localhost:8000/api/v1/category/name?name=Accessories')
      }
    
    let {data , isError , isLoading , isFetching}=  useQuery('getProducts' , getProducts , {
      cacheTime:1000
    })

   
    if(isLoading) return <Loader/>


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
       } 


      async function addProductToWishList(productId){
        
          let data=  await addToWishList(productId)
          console.log(data);
          if(data.status=='success'){
      
            setWCounter(data.length)
            console.log(data.wishlist );
            const loved = data.wishlist.map(element => element);
            setIsLoved(loved);
            console.log(loved);
            // setIsLoved(!isLoved);
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

  return (
    <>

 <CategoryNavbar/>
 
      <div className='Dark-Color pt-5'>
     
     <div className="container py-5">
     <Link to="/Home"> <i className="fa-solid fa-circle-arrow-left main-color fs-2 ms-4"></i></Link>
      <div className="row">
     {data?.data?.products.map(item=>{
      return   <div key={item._id} className="col-lg-2 col-sm-4 h-10" >
      <div className="product h-10 text-white p-2 cursor-pointer rounded-3 gray-border my-3">
        {/* start link to product details */}
        <Link className='un-underline' to={'/product-details/' + item._id}>
          <img className='w-100' src={getImageUrl(item.images?.[0])} alt="" />
          {/* <span className='main-color'>{item.category.name}</span> */}
          <h5 className='my-2 fw-bold'>{item.description.split(' ').slice(0, 2).join(' ')}</h5>

          {/* start details */}
          <div className=' d-flex justify-content-between'>
            <div>
              {item.price} EGP
            </div>
            <div>
              <i className="fa-solid fa-star ratingColor"></i>
              {item.rating}
            </div>
          </div>
          {/* end details */}
        </Link>
        {/* end link to product details */}
        <i className={`icon-link fa-solid fa-heart ms-2 mb-3 ${isLoved.includes(item._id) ? 'text-danger' : ''}`} onClick={() => {
          addProductToWishList(item._id)
        }}></i>
         <p
            className={`fs-6 fw-semibold m-0 ${
              item.countInStock === 0 ? "text-danger" : "main-color"
            }`}
          >
            {item.countInStock === 0
              ? "Not available"
              : `In Stock: ${item.countInStock}`}
          </p>
        <button disabled={!btnLoading} onClick={() => addProductToCart(item._id)} className='btn bg-main w-100 '>
        {inCart.includes(item._id) ? ' Remove item' : 'Add To Cart'}

        </button>
      </div>
    </div>
     })}
      </div>
     </div>
    </div>
    </>
  )
}
