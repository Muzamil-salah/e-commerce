import React from 'react'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Products from './products/Products.jsx'
import { Offline, Online } from "react-detect-offline";
import { ToastContainer } from 'react-toastify';
import Admin from './admin/Admin.jsx'
import ManageProducts from './admin/ManageProducts/ManageProducts.jsx'
import AddProduct from './admin/addproduct/AddProduct.jsx'
import ProductContextProvider from './context/ProductContext.js'
import LiveOrders from './admin/liveOrders/LiveOrders.jsx'
import BestSeller from './admin/bestSeller/BestSeller.jsx'
import OrderDetails from './admin/orderDetails/OrderDetails.js'
import OrderContextProvider from './context/OrderContext.js'
import ProductDetails from './productDetails/ProductDetails.jsx'

export default function App() {

  const routes = createBrowserRouter([
  { path: "/", element: <Admin /> },
  { path: "/admin", element: <Admin /> },
  { path: "/liveOrders", element: <LiveOrders /> },
  { path: "/bestSeller", element: <BestSeller /> },
  { path: "/manageProducts", element: <ManageProducts /> },
  { path: "/addProduct", element: <AddProduct /> },
  { path: "/products", element: <Products /> },
  { path: "/order/:orderId", element: <OrderDetails /> },
  { path: "product-details/:id", element: <ProductDetails /> }
]);

  return (
    <>

     

    {/* detect off line */}
    <ToastContainer theme='colored' autoClose={400}/>

  <ProductContextProvider>
    <OrderContextProvider>
      <RouterProvider router={routes}/>
      </OrderContextProvider>
      </ProductContextProvider>


    <Offline>
      <div className='offline'>You are offline Now!</div>
    </Offline>

     
    </>
  )
}

