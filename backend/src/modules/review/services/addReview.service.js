import Product from "../../../DB/models/Product.model.js";

const addReview= async(req , res , next)=>{
    try {
        const { rating,comment } = req.body;
        
        const product = await Product.findById(req.params.productId);
        if(!product){
            return res.status(404).json({status:'fail' , message:'product not found'})
        }


      const numericRating = Number(rating);

      
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ status: "fail", message: "Rating must be between 1 and 5" });
    }
     const newReview = {
      userId: req.user._id,
      userName: req.user.name,
      rating: numericRating,
      comment,
    };
    product.reviews.push(newReview);
    
        const totalRatings = product.reviews.reduce((sum, review) => {
  // Ensure each review.rating is a valid number, default to 0 if invalid
  const rating = Number(review.rating) || 0;
  return sum + rating;
}, 0);
    console.log(totalRatings);
    

    product.rating = totalRatings / product.reviews.length;
    product.numReviews = product.reviews.length;


    await product.save();
    res.status(201).json({ status:'success', newReview });

    } catch (error) {
        return res.status(500).json({status:'fail' , message:'server error' , error:error.message})
    }
}

export default addReview