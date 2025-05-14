import React, { useContext, useEffect, useState } from 'react';
import { storeContext } from '../context/storeContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import { orderContext } from '../context/OrderContext.js';

export default function OrderList() {

   const {updateOrder,createOrder , getOrderById ,orders,setOrders,loading,setLoading,error,setError,getMyOrders ,deleteOrder} = useContext(orderContext)
let [cancelledOrders , setCancelledOrders]=useState([])
let [delivered , setdelivered]=useState([])
  // const [loading, setLoading] = useState(true);

  const updateOrderFunction=async(updates,orderId )=>{
          try {
        //  let updates={isPaid:true}
         const response=await updateOrder(updates , orderId)
         console.log(response.data);
        //  setorderStatus(response.data.status)
         fetchOrders()
         
      } catch (error) {
        console.log(error);
        
      }
  }

  const deleteOrderFunction=async(orderId)=>{
    try {
      const response = await deleteOrder(orderId)
      console.log(response);
      if(response.status=='success'){
        toast.success('order deleted successfully ✅')
      }
      await fetchOrders();
      
    } catch (error) {
       toast.error(error.response?.data?.message || 'Failed to delete order');
    }
  }

      const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setCancelledOrders(
        data.orders
          .filter(order => order.status === 'Cancelled')
          .map(order => order._id)
      );
      setdelivered(
        data.orders
          .filter(order => order.status === 'Delivered')
          .map(order => order._id)
      );
        
        if(data.status=='success'){
          setOrders(data.orders)
        }
        
        // setOrders(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
        // console.log(delivered);
        
      }
    };

  useEffect(() => {
    fetchOrders();
 
    
  }, []);


  if (loading) return <Loader />;

  return (
    <div className="Dark-Color text-white py-5">
      <div className=' my-4 pt-4 position-fixed ms-1'>
              <Link to="/cart"> <i className="fa-solid fa-circle-arrow-left main-color fs-2 pt-2"></i></Link>
            </div>
      <div className="container pt-5">
        <h2 className="mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <div className="text-center py-5">
            <h4>You have no orders yet</h4>
            <Link to="/products" className="btn bg-main text-white mt-3">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Details</th>
                  <th>Action</th>
                  
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.totalPrice.toLocaleString()} EGP</td>
                    <td>
                      <span className={`badge ${
                        order.status === 'Delivered' ? 'bg-success' :
                        order.status === 'Cancelled' ? 'bg-danger' :
                        'bg-warning'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/order/${order._id}`} className="btn btn-sm bg-main ">
                        Details
                      </Link>
                    </td>
                    <td>
                    {/* {
                      !cancelledOrders.includes(order._id) || !delivered.includes(order._id)&& (<button onClick={()=>{
                deleteOrderFunction(order._id)
                
                  }} className="btn btn-danger w-100 mb-2">Delete</button>)
                    } */}
                      {/* <button  onClick={()=> {if(cancelledOrders.includes(order._id)|| delivered.includes(order._id)){
                        deleteOrderFunction(order._id);
                      }
                      else{
                        console.log('not delete function!!!');
                        
                      }
                      }} className='btn bg-main w-100 '>
          {cancelledOrders.includes(order._id)? ' Delete' : 'Cancel'}
         
          </button> */}
          <button
          disabled={(order.isPaid===true &&  !delivered.includes(order._id))}
  onClick={() => {
    if (cancelledOrders.includes(order._id) || delivered.includes(order._id)) {
      deleteOrderFunction(order._id);
    } else {
      updateOrderFunction({status:'Cancelled'} , order._id)
    }
  }}
  className={`btn bg-main w-100 ${
    cancelledOrders.includes(order._id) || delivered.includes(order._id) 
      ? 'bg-danger text-white' 
      : 'bg-warning text-white'
  }`}
>
  {cancelledOrders.includes(order._id) ? 'Delete' : 
   delivered.includes(order._id) ? 'Delete' : 'Cancel'}
</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}