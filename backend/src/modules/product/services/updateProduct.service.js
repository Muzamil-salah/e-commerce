import Product from "../../../DB/models/Product.model.js";

const updateProduct=async(req , res , next)=>{
    try {
        console.log('i enterd');
        
         const updates = req.body;
         const productId=req.params.productId;
         console.log(updates);
         
         
        const productToUpdate= await Product.findById(productId)

          if(!productToUpdate){
            return res.status(404).json({status:'fail' , message:'order not found'})
        }

        let productAfterUpdates= await Product.findByIdAndUpdate(productId , updates , {new:true})
         res.status(200).json({ status: 'success', productAfterUpdates });
        } catch (error) {
             return res.status(500).json({status:'fail' , message:error.message})
        
    }
}


export default updateProduct