import Order from "../../../DB/models/order.model.js";

const bestSeller=async(req , res , next)=>{
    try {
        console.log('im here');
        
        const orders= await Order.find().select('orderItems -_id');
        console.log(orders);
        const productSales = {}; 
        orders.forEach(order => {
  order.orderItems.forEach(item => {
    const id = item.product;
    const qty = item.quantity;
    productSales[id] = (productSales[id] || 0) + qty;
  });
});

const bestSellers = Object.entries(productSales)
  .sort((a, b) => b[1] - a[1]) // sort by quantity descending
  .slice(0, 3) // top 3 products
  .map(([productId, count]) => ({ productId, sold: count }));

console.log(bestSellers);
        
        return res.status(200).json({status:'success' , bestSellers ,productSales})
        
    } catch (error) {
        return res.status(500).json({status:'fail' , message:error.message})
    }
}


export default bestSeller