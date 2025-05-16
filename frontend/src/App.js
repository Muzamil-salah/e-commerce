import React from 'react'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Home from './home/Home'
import Products from './products/Products'
import Cart from './cart/Cart'
import MainLayOut from './layouts/MainLayOut'
import NotFoundPage from './NotFoundPage/NotFoundPage'
import Categories from './categories/Categories'
import Brands from './brands/Brands'
import AuthLayOut from './layouts/AuthLayOuts/AuthLayOut'
import Signin from './signin/Signin'
import SignUp from './signup/SignUp'
import LogOut from './logout/LogOut'
import { Offline, Online } from "react-detect-offline";
import ProtectedRoutes from './ProtectedRoutes/ProtectedRoutes'
import ProductDetails from './productDetails/ProductDetails'
import StoreContextProvider from './context/storeContext'
import OrderContextProvider from './context/OrderContext.js'
import WishListContextProvider from './context/WishlistContext'
import ProductContextProvider from './context/ProductContext.js'
import ProfileContextProvider from './context/ProfileContext.js'
import { PaymentProvider } from './context/PaymentContext.js'
import Phone from './categories/phone/Phone'
import Laptop from './categories/laptop/Laptop'
import Camera from './categories/camera/Camera'
import Headphone from './categories/headphone/Headphone'
import WishList from './wishlist/WishList'
import { ToastContainer } from 'react-toastify';
import EmptyCart from './EmptyCart/EmptyCart'
import Profile from './profile/Profile'
import Address from './address/Address'
import EditProfile from './editProfile/EditProfile'
import ChangePassword from './editProfile/changePassword/ChangePassword.jsx'
import CategoryLayOut from './layouts/categoryLayOut/CategoryLayOut'
import HeadPhones from './categories/headphone/HeadPhones'
import OrderList from './order/OrderList.js'
import OrderDetails from './order/OrderDetails.js'
import PlaceOrder from './order/PlaceOrder.js'

export default function App() {
  const routes = createBrowserRouter([

    { path:'/',element:<AuthLayOut/>,children:[
      { index:true,element:<Signin/>},
      {path:'signin',element:<Signin/>},
      {path:'signup',element:<SignUp/>},
     
    ]},
    { path:'/', element:<MainLayOut/>,errorElement:<NotFoundPage/>, children:[
      { path:'home',element:<ProtectedRoutes><Home/></ProtectedRoutes>},
      { path:'products',element:<ProtectedRoutes><Products/></ProtectedRoutes>},
      { path:'cart',element:<ProtectedRoutes><Cart/></ProtectedRoutes>},
      {path:'category',element:<ProtectedRoutes><Categories/></ProtectedRoutes>},
      // { path:'brands',element :<ProtectedRoutes><Brands/></ProtectedRoutes>},
      {path:'logout',element:<ProtectedRoutes><LogOut/></ProtectedRoutes>},
      {path:'product-details/:id',element:<ProtectedRoutes><ProductDetails/></ProtectedRoutes>},
      // {path:'phone',element:<ProtectedRoutes><Phone/></ProtectedRoutes>},
      { path:'accessories',element:<ProtectedRoutes><Laptop/></ProtectedRoutes>},
      { path:'shoes',element:<ProtectedRoutes><Camera/></ProtectedRoutes>},
      { path:'clothes',element:<ProtectedRoutes><HeadPhones/></ProtectedRoutes>},
      { path:'wishlist',element:<ProtectedRoutes><WishList/></ProtectedRoutes>},
      { path:'emptycart' , element:<ProtectedRoutes><EmptyCart/></ProtectedRoutes>},
      { path:'Profile' , element:<ProtectedRoutes><Profile/></ProtectedRoutes>},
      { path:'address/:id',element:<ProtectedRoutes><Address/></ProtectedRoutes>},
      { path:'editprofile',element:<ProtectedRoutes><EditProfile/>  </ProtectedRoutes>},
      {path:'changepassword', element : <ProtectedRoutes><ChangePassword/>  </ProtectedRoutes>},
      {path:'placeorder' , element:<ProtectedRoutes><PlaceOrder/>  </ProtectedRoutes>},
      {path:'order/:orderId' , element:<ProtectedRoutes><OrderDetails/>  </ProtectedRoutes>},
      {path:'orders' , element:<ProtectedRoutes><OrderList/>  </ProtectedRoutes>}

    ]},
    // {path:'/', element:<CategoryLayOut/>,errorElement:<NotFoundPage/>,children:[
    //     {
    //       path:'phone',element:<Phone/>    
         
    //     },
    //     {
    //       path:'laptop' , element:<Laptop/>
    //     },
    //     {
    //       path:'camera' , element:<Camera/>
    //     },
    //     {
    //       path:'headphone', element:<Headphone/>
    //     }
    //   ]
    // }
    {path:'/', element:<CategoryLayOut/>,errorElement:<NotFoundPage/>,children:[
      
      {  path:'accessories' , element:<Laptop/>},
      {  path:'shoes' , element:<Camera/>},
     { path:'clothes', element :<HeadPhones/>}
    ]
      
    }
   
  ])
  return (
    <>

    

    {/* detect off line */}
    <ToastContainer theme='colored' autoClose={400}/>
    <StoreContextProvider>
      <ProductContextProvider>
      <WishListContextProvider>
        <ProfileContextProvider>
          <OrderContextProvider>
            <PaymentProvider>
      <RouterProvider router={routes}/>
      </PaymentProvider>
      </OrderContextProvider>
      </ProfileContextProvider>
      
      </WishListContextProvider>
      </ProductContextProvider>
      
    </StoreContextProvider>

    <Offline>
      <div className='offline'>You are offline Now!</div>
    </Offline>

     
    </>
  )
}

