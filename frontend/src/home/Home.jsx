import React, { useContext, useEffect, useState } from "react";
import { storeContext } from "../context/storeContext";
import { WishListContext } from "../context/WishlistContext";
import { orderContext } from "../context/OrderContext.js";
import styles from "./Home.module.css";
import MainSlider from "../MainSlider/MainSlider";
import phone_Category from "../assets/HomePageImgs/phones/phone-Category.jpg";
import laptop_Category from "../assets/HomePageImgs/laptops/laptop-Category.jpg";
import headphone_Category from "../assets/HomePageImgs/HeadPhones/headPhoneCategory.jpg";
import camera_Category from "../assets/HomePageImgs/cameras/camers-Category.jpg";
import discound_img from "../assets/images/model.png";
import { Link  , useLocation} from "react-router-dom";
import Footer from "../footer/Footer";
import axios from "axios";
import { usePayment } from "../context/PaymentContext.js";
import Cookies from 'js-cookie';

export default function Home() {
  let { setCounter, getCart,inCart, setInCart , cartItems , setCartItems ,deleteCart } = useContext(storeContext);
  let { setWCounter, getFromWishList,isLoved, setIsLoved } = useContext(WishListContext);
  const { isPaymentCreated ,verifyPayPalPayment ,setIsPaymentCreated } = usePayment();
  let {updateOrder}= useContext(orderContext)
 const location = useLocation();
  
  async function getPrevValues() {
    let data = await getFromWishList();
    console.log(data);
    if(data?.status==='success'){
 const loved = data.wishlistItems.map((element) => element._id);
    setIsLoved(loved);
    }
   
    let cartItems = await getCart();
    console.log(cartItems);
    if(cartItems?.status==='success'){
  setCartItems(cartItems.cartItems)
    
    let items = cartItems?.cartItems.map((element) => element.product._id);
    setInCart(items);
    setCounter(cartItems.length);
    }
  


  }

  const verifyPayment=async(updates)=>{
    try {
       let orderId=Cookies.get('orderId')
       let data=await verifyPayPalPayment(orderId)
       if(data.message=='paid'){
      //  let updates={isPaid:true}
       const response=await updateOrder(updates)
       console.log(response);
       getPrevValues()
       
       }
       console.log(data);
       
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {

     const queryParams = new URLSearchParams(location.search);
     const success = queryParams.get('success');
      if (success === 'true') {
       
        // Payment was successful
        console.log('Payment completed successfully');
     verifyPayment({isPaid:true , status:'Pending'})
        // You might want to verify the payment here


        // verifyPayment(paymentId);
      } else {
        // Payment was cancelled
        console.log('Payment was cancelled');
      }
      
      // Clean up the URL (optional)
      window.history.replaceState({}, document.title, '/Home');
   
    // هنا بتحطي الفانكشن اللي تشتغل مرة واحدة بس
    getPrevValues();
  }, [location]);
  console.log(isPaymentCreated);
  
  return (
    <>
      <div className={`  ${styles.main} pt-2`}>
        <MainSlider />
        {/* --------------------------------------start under slider --------------------------------- */}
        <div className="container  mb-5">
          <div className="row">
            <div className="col-lg-3 col-md-6 text-md-center py-2 px-4">
              <i className="fa-solid fa-cart-shopping fs-2 main-color mb-3"></i>
              <div className="text-white">
                <h4>Free delivery</h4>
                <span>to any place you want around the world</span>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-md-center p-2 px-4 ">
              <i className="fa-solid fa-tag  fs-2 main-color mb-3"></i>
              <div className="text-white">
                <h4>Daily offers</h4>
                <span>to eny place you want around the world</span>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-md-center p-2 px-4">
              <i className="fa-solid fa-medal fs-2 main-color mb-3"></i>
              <div className="text-white">
                <h4>Quality guarantee</h4>
                <span>to eny place you want around the world</span>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-md-center p-2 px-4">
              <i className="fa-solid fa-shield fs-2 main-color mb-3"></i>
              <div className="text-white">
                <h4>100% secure payment</h4>
                <span>to any place you want around the world</span>
              </div>
            </div>
          </div>
        </div>
        {/* --------------------------------------end under slider --------------------------------- */}

        {/* --------------------------------------start Category --------------------------------- */}
        <section>
          <div className="container">
            <div className="section-title overflow-hidden mb-4 main-color">
              <h3>Categories</h3>
            </div>
            <div className="row gy-4 my-5">
              {/* phone */}
              <div className="col-lg-4 col-md-3  d-flex justify-content-center">
                <div className="w-75 text-center  py-4 cursor-pointer rounded-3 main-color-border product text-white align-content-center">
                 <Link to={'/shoes'}> <img className="w-50 mb-3" src='https://assets.adidas.com/images/w_600,f_auto,q_auto/2b04943c525e4909a7a5a9fa0116153d_9366/Five_Ten_Kestrel_Lace_Mountain_Bike_Shoes_Grey_BC0770_01_standard.jpg' alt="shose" /></Link>
                  <h5>Shose</h5>
                </div>
              </div>

              {/*laptop  */}

              <div className="col-lg-4 col-md-3  d-flex justify-content-center">
                <div className="w-75 text-center  cursor-pointer rounded-3 main-color-border product text-white align-content-center">
                  <Link to={'/accessories'}><img className="w-75  mb-3" src='https://assets.adidas.com/images/w_600,f_auto,q_auto/a520df1b51384c00af9caca100489f04_9366/Trefoil_Backpack_Black_EX6752_01_standard.jpg' alt="" /></Link>
                  <h5>Accessories</h5>
                </div>
              </div>

              {/* head phones */}

              <div className="col-lg-4 col-md-3  d-flex justify-content-center">
                <div className="w-75 text-center cursor-pointer rounded-3 main-color-border product text-white align-content-center">
                  <Link to={'/clothes'}><img className="w-50 mb-3" src='https://assets.adidas.com/images/w_600,f_auto,q_auto/9f081356674948ca99f3ac820134738c_9366/Essentials_Loose_Logo_Tank_Top_White_GL0567_21_model.jpg' alt="" /></Link>
                  <h5>Clothes</h5>
                </div>
              </div>

              {/* camera */}

              {/* <div className="col-lg-3 col-md-6  d-flex justify-content-center">
                <div className="w-75 text-center  cursor-pointer rounded-3 main-color-border product text-white align-content-center">
                  <img className="w-50 mb-3" src={camera_Category} alt="" />
                  <h5>Phones</h5>
                </div>
              </div> */}
            </div>
          </div>
        </section>
        {/* --------------------------------------end Category --------------------------------- */}

        {/* --------------------------------------start best seller --------------------------------- */}

        {/* --------------------------------------end best seller --------------------------------- */}

        {/* --------------------------------------start discound --------------------------------- */}
        <div className="mt-5 mainSlider_bg py-4 ">
          <div className="container">
            <div className="row  gx-5">
              {/* fisrt col */}
              <div className="col-md-6">
                <img
                  className="w-100"
                  src={discound_img}
                  alt="apple collection"
                />
              </div>
              {/* second col */}

              <div className="col-md-5 text-white align-content-center">
                <h2 className=" fs-1">
                  <span className="main-color">30%</span> Discount on Nike
                  collection
                </h2>
                <span className=" fs-6">Harry Up And Book This Offer</span>
                <Link to="/accessories" className="btn  d-block bg-main mt-5">
                  Shop Collection
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------------end discound--------------------------------- */}
        {/*---------------------------------- start footer --------------------------------------------*/}
        <Footer />
      </div>
    </>
  );
}
