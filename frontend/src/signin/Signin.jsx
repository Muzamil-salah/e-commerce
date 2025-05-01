import React, { useState, useEffect } from 'react';
import styles from './Signin.module.css';
import logoImg from '../assets/img/ElecLogo.png';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Signin() {
  const [isChecked, setIsChecked] = useState(false);
  const [Errmsg, setErrmsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // Clear form errors after 5 seconds
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      const timer = setTimeout(() => {
        setFormErrors({});
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formErrors]);

  // Clear API error message after 5 seconds
  useEffect(() => {
    if (Errmsg) {
      const timer = setTimeout(() => {
        setErrmsg('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [Errmsg]);

  async function sendDataToApi(values) {
    try {
      setLoading(false);
      const { data } = await axios.post('http://localhost:8000/api/v1/user/login', values);
      
      if (data && data.token) {
        Cookies.set('token', data.token, { expires: 7 });
        // Force a full page reload to ensure all application state is reset
        window.location.href = '/Home';
      }
    } catch (err) {
      setErrmsg(err.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(true);
    }
  }

  function validate(values) {
    const errors = {};
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (!/^[A-Z][a-zA-Z0-9]{6,}$/.test(values.password)) {
      errors.password = 'Password must start with uppercase and be at least 7 characters';
    }
    
    setFormErrors(errors);
    return errors;
  }

  const login = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    onSubmit: (values) => {
      sendDataToApi(values);
    }
  });

  return (
    <div className={styles.main}>
      <div className="container pt-5 mt-5">
        <div className="row align-items-center py-5 mt-5">
          {/* Logo Section */}
          <div className="col-md-6 text-center text-white mb-5">
            <img className='w-25 me-md-5' src={logoImg} alt="ElectroniXpress" />
            <h2 className='mt-3 me-4'>ElectroniXpress</h2>
            <span>helps you find all electronics you need</span>
          </div>
          
          {/* Login Form */}
          <div className={`${styles.MyForm} col-md-6 bg-black text-light p-4 mt-s-5`}>
            <h2 className='fw-light'>Login Now</h2>
            
            <form onSubmit={login.handleSubmit} className='my-4 text-center'>
              {/* Email Input */}
              <input
                onBlur={login.handleBlur}
                value={login.values.email}
                onChange={login.handleChange}
                className={`${styles.MyInput} form-control Gray-Color rounded-5 ${formErrors.email ? 'is-invalid' : ''}`}
                type="text"
                name='email'
                id='Email'
                placeholder='Email*'
              />
              {formErrors.email && login.touched.email && (
                <div className="alert alert-danger">
                  {formErrors.email}
                </div>
              )}
              
              {/* Password Input */}
              <input
                onBlur={login.handleBlur}
                value={login.values.password}
                onChange={login.handleChange}
                className={`${styles.MyInput} form-control Gray-Color rounded-5 ${formErrors.password ? 'is-invalid' : ''}`}
                type="password"
                name='password'
                id='Password'
                placeholder='Password*'
              />
              {formErrors.password && login.touched.password && (
                <div className="alert alert-danger">
                  {formErrors.password}
                </div>
              )}
              
              {/* Error Message */}
              {Errmsg && (
                <div className="alert alert-danger">
                  {Errmsg}
                </div>
              )}
              
              {/* Submit Button */}
              <button
                disabled={!(login.dirty && login.isValid) || !loading}
                type='submit'
                className='btn bg-main text-secondary mt-3 form-control rounded-5'
              >
                {loading ? 'Sign In' : <i className='fa fa-spinner fa-spin main-color'></i>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}



// import React, { useState } from 'react'
// import styles from './Signin.module.css'
// import logoImg from'../assets/img/ElecLogo.png'
// import { useFormik } from 'formik'
// // import * as yup from 'yup';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';



// export default function Signin() {
  
// // start ckeckBox

// const [isChecked, setIsChecked] = useState(false);
// const handleCheckboxChange = () => {
//   setIsChecked(!isChecked);
// };
//   let navigate=useNavigate()
//   let [Errmsg , setErrmsg]=useState('');
//   let [loading , setloading]=useState(true);
//   //send data to api
  
//     function sendDataToApi(values){
//       setloading(false);
//    axios.post('http://localhost:8000/api/v1/user/login' , values).then(({data})=>{
//     console.log(data)
//     setloading(true);
//       //------------- if condition data.message=="success" -------------------
//    if(data){

//     Cookies.set('token', data.token, { expires: 7 });
//     navigate('/Home')

//    }
//    }).catch(err=>{
//     setErrmsg(err.response.data.message );
//     console.log(err.response.data.message )
//    })
//   }


// // validation function 

// function validate(values){
//   const myError={}

//   if(!values.email){
//     myError.email='Email is required'
//   }
// if(!/^[A-Z][a-zA-Z0-9]{6,}$/.test(values.password)){
//   myError.password='Please enter a valid Password'
// }

// return myError
// }


//   //start formik
//   let login = useFormik({
//     initialValues:{
//       email:'',
//       password:'',
//     },
//     validate
//     ,
//     onSubmit:(values)=>{
//       console.log(values)
//       //convert values to JSON then send to API
//       sendDataToApi(values)

//     }
//    })


// // end formik


//   return (
    
//     <div className={styles.main}>
//         <div className="container pt-5 mt-5">
//           <div className="row align-items-center py-5 mt-5" >
//              {/*//////////////////////////////////////////////////////////// start logo  /////////////////////////////////// */}
//             <div className="col-md-6  text-center text-white mb-5">
//               <img className='w-25 me-md-5 ' src={logoImg}alt="ElectroniXpress" />
//               <h2 className='mt-3 me-4'>ElectroniXpress</h2> <span >helps you find all electronics you need</span>
//                {/*//////////////////////////////////////////////////////////// end logo  /////////////////////////////////// */}
//             </div>
//             <div className={`${styles.MyForm}   col-md-6 bg-black text-light p-4 mt-s-5`}>
//               <h2 className='  fw-light'>login Now</h2>

//               {/*//////////////////////////////////////////////////////////// start form  /////////////////////////////////// */}
//               <form onSubmit={login.handleSubmit} className='my-4 text-center'>
//                 <input onBlur={login.handleBlur} value={login.values.email} onChange={login.handleChange} className={` ${styles.MyInput} form-control Gray-Color rounded-5    ${login.errors.email?'is-invalid':''} `} type="text" name='email' id='Email' placeholder='Email*' />
//                {login.errors.email && login.touched.email?  <div className="alert alert-danger">
//                   {login.errors.email}
//                 </div>:''}
//                 <input onBlur={login.handleBlur} value={login.values.password} onChange={login.handleChange} className={` ${styles.MyInput} form-control Gray-Color rounded-5    ${login.errors.password?'is-invalid':''} `} type="password" name='password' id='Password' placeholder='Password*' />
//                {login.errors.password && login.touched.password?  <div className="alert alert-danger">
//                   {login.errors.password}
//                 </div> :''}
          
//                 {Errmsg? <div className="alert alert-danger">
//               {Errmsg}
//             </div>:''}
        
//                 <button disabled={!(login.dirty&&login.isValid)} type='submit' className='btn bg-main text-secondary mt-3 form-control rounded-5'>
//                   {loading? 'SignIn': <i className='fa fa-spinner fa-spin main-color'></i>}
//                 </button>

              
//               </form>
//                {/*//////////////////////////////////////////////////////////// end form  /////////////////////////////////// */}
//             </div>
//           </div>
//         </div>
//     </div>
//   )
// }

