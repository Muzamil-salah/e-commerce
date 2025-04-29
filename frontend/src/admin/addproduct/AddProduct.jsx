import React, { useState } from 'react'
import axios from 'axios';
import styles from './AddProduct.module.css'
import { useFormik } from 'formik'
import { Link, useNavigate } from 'react-router-dom';
export default function AddProduct() {
    let navigate = useNavigate()
    let [Errmsg, setErrmsg] = useState('');
    let [loading, setloading] = useState(true);
    const [image, setImage] = useState(null);


    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    //send data to api

    const sendDataToApi = async (values) => {
        setloading(false);
        const formData = new FormData();
        formData.append('category', values.category);
        formData.append('description', values.description);
        formData.append('image', image);
        formData.append('name', values.name);
        formData.append('detaileddescription', values.detaileddescription);
        formData.append('brand', values.brand);
        formData.append('price', values.price);
        formData.append('countInStock', values.countInStock);
        formData.append('rating', values.rating);
        formData.append('numReviews', values.numReviews);

        try {
            const response = await axios.post('http://localhost:8000/api/v1/product/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data);
            setloading(true);
            navigate('/manageProducts');
        } catch (err) {
            setErrmsg(err?.response?.data?.message);
            console.log(err?.response?.data?.message);
        }
    };



    // validation function 

    function validate(values) {
        const myError = {}

        if (!values.category) {
            myError.category = 'Category is required'
        }
        if (!values.description) {
            myError.description = 'Description is required'
        }


        if (!values.name) {
            myError.name = 'Name is required'
        }
        if (!values.brand) {
            myError.brand = 'Brand is required'
        }
        if (!values.price) {
            myError.price = 'Price is required'
        }
        if (!values.countInStock) {
            myError.countInStock = 'Count In Stock is required'
        }
        if (!values.rating) {
            myError.rating = 'Rating is required'
        }
        if (!values.numReviews) {
            myError.numReviews = 'NumReviews is required'
        }

        return myError
    }


    //start formik
    let Register = useFormik({
        initialValues: {
            category: '',
            description: '',
            name: '',
            detaileddescription: '',
            brand: '',
            price: '',
            countInStock: '',
            rating: '',
            numReviews: '',

        },
        validate
        ,
        onSubmit: (values) => {
            console.log(values)
            //convert values to JSON then send to API
            sendDataToApi(values)
            // {isChecked? <AdminLayOut/> :<MainLayOut/>}
        }
    })


    console.log(Register.errors)
    // end formik
    return (
        <div className='bg-blackAndGray mt-5 py-5'>

            <Link to="/manageProducts"> <i className="fa-solid fa-circle-arrow-left main-color fs-2 ms-4"></i></Link>

            {/*------------------------------ start form ---------------------------------*/}
       <div className="container">
       <form onSubmit={Register.handleSubmit} className='my-4 text-center'>


{/*------------------------------- start category ---------------------------- */}

<select name="category" onBlur={Register.handleBlur} value={Register.values.category} onChange={Register.handleChange} className={` ${styles.MyInput} form-control Gray-Color rounded-5 text-white  ${Register.errors.category ? 'is-invalid' : ''}  placeholder='category*' `}>
    <option className='text-dark' value="">Select Category</option>
    <option className='text-dark' value="phones">Phones</option>
    <option className='text-dark' value="laptop">Laptops</option>
    <option className='text-dark' value="camera">Cameras</option>
    <option className='text-dark' value="headphone">Head Phone</option>

</select>
{Register.errors.category && Register.touched.category ? <div className="alert alert-danger">
    {Register.errors.category}
</div> : ''}

{/*  ---------------------------------  end category ------------------------------ */}

{/* ------------------------------------ start description -------------------------- */}

<input onBlur={Register.handleBlur} value={Register.values.description} onChange={Register.handleChange} className={` ${styles.MyInput} form-control Gray-Color rounded-5    ${Register.errors.description ? 'is-invalid' : ''} `} type="text" name='description' id='description' placeholder='description*' />
{Register.errors.description && Register.touched.description ? <div className="alert alert-danger">
    {Register.errors.description}
</div> : ''}

{/* ------------------------------------------ end description ---------------------------- */}

{/*-------------------------------------------  start  name -------------------------------*/}
<input onBlur={Register.handleBlur} value={Register.values.name} onChange={Register.handleChange} className={` ${styles.MyInput} form-control Gray-Color rounded-5    ${Register.errors.name ? 'is-invalid' : ''} `} type="text" name='name' id='name' placeholder='name*' />
{Register.errors.name && Register.touched.name ? <div className="alert alert-danger">
    {Register.errors.name}
</div> : ''}

{/* ----------------------------------------------- end name ------------------------------------- */}

{/* -------------------------------------------  start  detailed description  -------------------------------*/}

<input onBlur={Register.handleBlur} value={Register.values.detaileddescription} onChange={Register.handleChange} className={` ${styles.MyInput} form-control Gray-Color rounded-5    ${Register.errors.detaileddescription ? 'is-invalid' : ''} `} type="text" name='detaileddescription' id='detaileddescription' placeholder='detaileddescription*' />
{Register.errors.detaileddescription && Register.touched.detaileddescription ? <div className="alert alert-danger">
    {Register.errors.detaileddescription}
</div> : ''}
{/* ----------------------------------------------- end detailed description ------------------------------------- */}

{/* -------------------------------------------  start  brand   -------------------------------*/}
<input onBlur={Register.handleBlur} value={Register.values.brand} onChange={Register.handleChange} className={` ${styles.MyInput} form-control Gray-Color rounded-5    ${Register.errors.brand ? 'is-invalid' : ''} `} type="text" name='brand' id='brand' placeholder='brand*' />
{Register.errors.brand && Register.touched.brand ? <div className="alert alert-danger">
    {Register.errors.brand}
</div> : ''}

{/* ----------------------------------------------- end brand ------------------------------------- */}

{/* ----------------------------------------------- start price ---------------------------------- */}

<input onBlur={Register.handleBlur} value={Register.values.price} onChange={Register.handleChange} className={` ${styles.MyInput} form-control Gray-Color rounded-5    ${Register.errors.price ? 'is-invalid' : ''} `} type="text" name='price' id='price' placeholder='price*' />
{Register.errors.price && Register.touched.price ? <div className="alert alert-danger">
    {Register.errors.price}
</div> : ''}

{/* ----------------------------------------------- end price ---------------------------------- */}

{/* ----------------------------------------------- start count in stock ---------------------------------- */}
<input onBlur={Register.handleBlur} value={Register.values.countInStock} onChange={Register.handleChange} className={` ${styles.MyInput} form-control Gray-Color rounded-5    ${Register.errors.countInStock ? 'is-invalid' : ''} `} type="text" name='countInStock' id='countInStock' placeholder='countInStock*' />
{Register.errors.countInStock && Register.touched.countInStock ? <div className="alert alert-danger">
    {Register.errors.countInStock}
</div> : ''}
{/* ----------------------------------------------- end count in stock ---------------------------------- */}

{/* ----------------------------------------------- start rating  ---------------------------------- */}
<input onBlur={Register.handleBlur} value={Register.values.rating} onChange={Register.handleChange} className={` ${styles.MyInput} form-control Gray-Color rounded-5    ${Register.errors.rating ? 'is-invalid' : ''} `} type="text" name='rating' id='rating' placeholder='rating*' />
{Register.errors.rating && Register.touched.rating ? <div className="alert alert-danger">
    {Register.errors.rating}
</div> : ''}
{/* ----------------------------------------------- end rating  ---------------------------------- */}

{/* ----------------------------------------------- start numReviews  ---------------------------------- */}
<input onBlur={Register.handleBlur} value={Register.values.numReviews} onChange={Register.handleChange} className={` ${styles.MyInput} form-control Gray-Color rounded-5    ${Register.errors.numReviews ? 'is-invalid' : ''} `} type="text" name='numReviews' id='numReviews' placeholder='numReviews*' />
{Register.errors.numReviews && Register.touched.numReviews ? <div className="alert alert-danger">
    {Register.errors.numReviews}
</div> : ''}
{/* ----------------------------------------------- end numReviews  ---------------------------------- */}

{/* ----------------------------------------------- start image  ---------------------------------- */}

<input onBlur={Register.handleBlur} value={Register.values.image} onChange={handleImageChange} className={` ${styles.MyInput} form-control  rounded-5 text-white    ${Register.errors.image ? 'is-invalid' : ''} `} type="file" name='image' id='image' placeholder='please select image' />
{Register.errors.image && Register.touched.image ? <div className="alert alert-danger">
    {Register.errors.image}
</div> : ''}
{/* ----------------------------------------------- end image  ---------------------------------- */}

{Errmsg ? <div className="alert alert-danger">
    {Errmsg}
</div> : ''}
<button disabled={!(Register.dirty && Register.isValid)} type='submit' className='btn bg-main text-secondary mt-3 form-control rounded-5'>
    {loading ? 'Submit' : <i className='fa fa-spinner fa-spin main-color'></i>}
</button>
{/* <label ><input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} /> admin</label> */}

</form>
       </div>
            {/*------------------------------ end form ---------------------------------*/}
        </div>
    )
}
