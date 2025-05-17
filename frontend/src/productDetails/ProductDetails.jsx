
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Form, Link, useParams } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { storeContext } from '../context/storeContext';
import { WishListContext } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styles from './ProductDetails.module.css';
import Cookies from 'js-cookie';

export default function ProductDetails() {
    // Existing context and state
    let { setCartItems, setTotalPrice, Counter, setCounter, addToCart, getCart, inCart, setInCart } = useContext(storeContext);
    let { addToWishList, setWCounter, removeWishItem, getFromWishList, isLoved, setIsLoved } = useContext(WishListContext);
    let [btnLoading, setBtnLoading] = useState(true);
    let x = useParams();
    const queryClient = useQueryClient();

    // Review state
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);


    
    const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';
  // Check if it's already a full URL (for seeded data maybe)
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise construct the proper URL
  return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/uploads/${imagePath}`;
};

         async function getPrevValues(){
        let data=  await getFromWishList()
        if(data?.status==='success'){
        const loved = data.wishlistItems.map(element => element._id);
          setIsLoved(loved);
        }
      let cartItems= await getCart();
      if(cartItems?.status==='success'){
     let items=cartItems.cartItems.map(element => element.product._id);
      setInCart(items)
      setCounter(cartItems.length)
      }
  
      }
      useEffect(() => {
        // هنا بتحطي الفانكشن اللي تشتغل مرة واحدة بس
        getPrevValues()
      }, []);

    // Fetch product data
    async function getProduct() {
        return await axios.get(`http://localhost:8000/api/v1/product/${x.id}`);
    }

    let { data, isError, isLoading, isFetching } = useQuery('getProduct', getProduct, {
        cacheTime: 3000,
        refetchOnWindowFocus: false
    });

    // Add review mutation
    const addReviewMutation = useMutation(
        (reviewData) => axios.post(`http://localhost:8000/api/v1/review/add/${x.id}`, reviewData, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('getProduct');
                setReviewText('');
                setRating(0);
                toast.success('Review added successfully!');
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || 'Failed to add review');
            }
        }
    );

    // Add to cart function
    async function addProductToCart(productId) {
        setBtnLoading(false);
        let data = await addToCart(productId);
        if (data?.status === 'success') {
            let items = data.cartItems.map(element => element.product._id);
            setInCart(items);
            setCounter(data.length);
            setBtnLoading(true);
            toast.success("Product added successfully!");
        } else if (data?.status === 'remove') {
            let items = data.cartItems.map(element => element.product._id);
            setInCart(items);
            setCounter(data.length);
            setBtnLoading(true);
            toast.error("Product removed successfully!");
        }
        setCartItems(data.cartItems);
        setTotalPrice(data.totalPrice);
    }

    // Add to wishlist function
    async function addProductToWishList(productId) {
        let data = await addToWishList(productId);
        if (data.status === 'success') {
            setWCounter(data.length);
            const loved = data.wishlist.map(element => element.product);
            setIsLoved(loved);
            toast.success("Product added to wishlist!");
            getPrevValues()
        } else if (data.status === 'deleted') {
            setWCounter(data.length);
            const loved = data.wishlist.map(element => element.product);
            setIsLoved(loved);
            toast.warning("Product removed from wishlist!");
        }
    }

    // Star Rating Component
    const StarRating = ({ onRatingChange }) => {
        return (
            <div className="star-rating my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                        onClick={() => onRatingChange(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                            cursor: 'pointer',
                            fontSize: '24px',
                            color: star <= (hoverRating || rating) ? '#ffc107' : '#e4e5e9',
                            marginRight: '5px'
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    // Handle review submission
    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!rating) {
            toast.error('Please select a rating');
            return;
        }
        if (!reviewText.trim()) {
            toast.error('Please write a review');
            return;
        }
        addReviewMutation.mutate({ rating, comment: reviewText });
    };

    if (isLoading) return <Loader />;

    return (
        <div className='ProductDetails Dark-Color text-white h-100vh Details pt-5'>
            <div className=' my-4 pt-4 position-fixed ms-5'>
                <Link to="/products"> <i className="fa-solid fa-circle-arrow-left main-color fs-2"></i></Link>
            </div>
            <div className="container py-5 mb-5">
                <div className="row mt-5 gx-5">
                    <div className="col-md-3 product text-white p-2 rounded-3 my-3 main-color-border">
                        {/* src={data?.data?.product.images[0]} */}
                        <img className='w-100' src={getImageUrl(data?.data?.product.images?.[0])}  alt={data?.data?.product.name} />
                    </div>
                    <div className="col-md-9 mt-5">
                        <div className='d-flex justify-content-between'>
                            <div>
                                <h4 className='my-2 fw-bold'>{data?.data?.product.name}</h4>
                            </div>
                            <div>
                                <i 
                                    onClick={() => addProductToWishList(data?.data?.product._id)} 
                                    className={`heart-icon mt-2 me-2 fs-4 icon-link fa-solid fa-heart ${isLoved.includes(data?.data?.product._id) ? 'text-danger' : ''}`}
                                ></i>
                            </div>
                        </div>
                        <p className='my-3'>{data?.data?.product.description}</p>
                        <div className='d-flex justify-content-between my-4'>
                            <div>
                                {/* <span className='main-color'>{data?.data?.product.category}</span> */}
                                <div>{Number(data?.data?.product.price).toLocaleString()} EGP</div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            style={{
                                                color: star <= data?.data?.product.rating ? '#ffc107' : '#e4e5e9',
                                                fontSize: '20px'
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <div className='ms-3'>{data?.data?.product.rating?.toFixed(1)}</div>
                            </div>
                        </div>
                        <p className={`fs-6 fw-semibold m-0 ${data?.data?.product.countInStock === 0 ? 'text-danger' : 'main-color'}`}>
  {data?.data?.product.countInStock === 0 ? 'Not available' : `In Stock: ${data?.data?.product.countInStock}`}
</p>
                        <button 
                            disabled={!btnLoading || data?.data?.product.countInStock === 0} 
                            onClick={() => addProductToCart(data?.data?.product._id)} 
                            className='icon btn bg-main w-100 border-secondary'
                        >
                            {inCart.includes(data?.data?.product._id) ? 'Remove from Cart' : 'Add To Cart'}
                        </button>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section mt-5">
                    <h3 className="mb-4">Customer Reviews</h3>
                    
                    {/* Add Review Form */}
                    {Cookies.get('token') && (
                        <div className="add-review mb-5 p-4 rounded" style={{ backgroundColor: '#2a2a2a' }}>
                            <h4 className='text-white' >Write a Review</h4>
                            <form onSubmit={handleReviewSubmit}>
                                <StarRating onRatingChange={(rating) => setRating(rating)} />
                                <div className="form-group mt-3">
                                    <textarea
                                        className="form-control bg-dark text-white"
                                        rows="4"
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Share your thoughts about this product..."
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary mt-3"
                                    disabled={addReviewMutation.isLoading}
                                >
                                    {addReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>
                    )}
                    
                    {/* Reviews List */}
                    <div className="reviews-list">
                        {data?.data?.product.reviews?.length > 0 ? (
                            <>
                                {data.data.product.reviews
                                    .slice(0, showAllReviews ? data.data.product.reviews.length : 3)
                                    .map((review) => (
                                        <div key={review._id} className="review-item mb-4 p-3 rounded" style={{ backgroundColor: '#2a2a2a' }}>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h5 className="mb-0">{review.userName}</h5>
                                                <div className="rating">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <span 
                                                            key={i} 
                                                            style={{ 
                                                                color: i < review.rating ? '#ffc107' : '#e4e5e9',
                                                                fontSize: '18px'
                                                            }}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mb-2">{review.comment}</p>
                                            <small className="text-muted">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </small>
                                        </div>
                                    ))
                                }
                                
                                {data.data.product.reviews.length > 3 && (
                                    <button 
                                        className="btn btn-outline-secondary mt-3"
                                        onClick={() => setShowAllReviews(!showAllReviews)}
                                    >
                                        {showAllReviews ? 'Show Less' : `View All Reviews (${data.data.product.reviews.length})`}
                                    </button>
                                )}
                            </>
                        ) : (
                            <p>No reviews yet. Be the first to review this product!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}