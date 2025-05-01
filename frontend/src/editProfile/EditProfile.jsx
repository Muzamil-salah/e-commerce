import React, { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ProfileContext } from '../context/ProfileContext.js';

export default function EditProfile() {
  const navigate = useNavigate();
  const [Errmsg, setErrmsg] = useState('');
  const [loading, setLoading] = useState(true);
  const { getProfileData , userData ,setUserData} = useContext(ProfileContext);


  useEffect(() => {
    (async () => {
      let data = await getProfileData();
      if (data.status === 'success') {
        setUserData(data.userData);
      }
    })();
  }, []);

  async function updateProfile(values) {
    try {
      setLoading(false);
      const token = Cookies.get('token');
      const { data } = await axios.put('http://localhost:8000/api/v1/user/update', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.status === 'success') {
        alert('Profile updated successfully!');
        navigate('/profile');
      } else {
        console.log('Profile update failed!');
      }
    } catch (err) {
      console.error(err);
      setErrmsg(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(true);
    }
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
    },
    validate: values => {
      const errors = {};
      if (!values.email) {
        errors.email = 'Email is required';
      }
      if (!values.name) {
        errors.name = 'Name is required';
      }
      return errors;
    },
    onSubmit: values => {
      updateProfile(values);
    },
  });

  useEffect(() => {
    if (userData.name && userData.email) {
      formik.setValues({
        name: userData.name,
        email: userData.email,
      });
    }
  }, [userData]);

  return (
    <div className='bg-grad mt-5'>
      <div className="container light-style flex-grow-1 container-p-y py-5">
        <h4 className="font-weight-bold py-3 mb-4 text-white">
          Account settings
        </h4>
        <form onSubmit={formik.handleSubmit}>
          <div className="card overflow-hidden Gray-Color">
            <div className="card-body">
              <div className="form-group mb-4">
                <label className="form-label text-white">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                {formik.errors.name && <div className="text-danger">{formik.errors.name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label text-white">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.errors.email && <div className="text-danger">{formik.errors.email}</div>}
              </div>
             
              {Errmsg && <div className="text-danger mt-2">{Errmsg}</div>}
            </div>
          </div>
          <div className=' d-flex justify-content-between'>
          <div className="text-right mt-3">
            <button type="submit" className="btn bg-main profile-btn" disabled={!loading}>
              {loading ? 'Save changes' : 'Updating...'}
            </button>
            <Link to="/profile" className="btn text-white">Cancel</Link>
           
          </div>
          <div className="mt-3">
                <Link to="/changepassword" className="btn btn-secondary">
                  Change Password
                </Link>
              </div>
          </div>
          
        </form>
      </div>
    </div>
  );
}



// import React, { useState, useContext, useEffect } from 'react';
// import { useFormik } from 'formik';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { ProfileContext } from '../context/ProfileContext.js';

// export default function EditProfile() {
//   const navigate = useNavigate();
//   const [Errmsg, setErrmsg] = useState('');
//   const [loading, setLoading] = useState(true);
//   const { getProfileData } = useContext(ProfileContext);
//   const [userData, setUserData] = useState({});

//   useEffect(() => {
//     (async () => {
//       let data = await getProfileData();
//       if (data.status === 'success') {
//         setUserData(data.userData);
//       }
//     })();
//   }, []);

//   async function updateProfile(values) {
//     try {
//       setLoading(false);
//       const token = Cookies.get('token');
//       const { data } = await axios.put('http://localhost:8000/api/v1/user/update', values, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (data.status === 'success') {
//         alert('Profile updated successfully!');
//         navigate('/profile');
//       } else {
//         console.log('Profile update failed!');
//       }
//     } catch (err) {
//       console.error(err);
//       setErrmsg(err.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(true);
//     }
//   }

//   const formik = useFormik({
//     initialValues: {
//       name: '',
//       email: '',
//     },
//     validate: values => {
//       const errors = {};
//       if (!values.email) {
//         errors.email = 'Email is required';
//       }
//       if (!values.name) {
//         errors.name = 'Name is required';
//       }
//       return errors;
//     },
//     onSubmit: values => {
//       updateProfile(values);
//     },
//   });

//   // Update formik values when userData is available
//   useEffect(() => {
//     if (userData.name && userData.email) {
//       formik.setValues({
//         name: userData.name,
//         email: userData.email,
//       });
//     }
//   }, [userData]);

//   return (
//     <div className='bg-grad mt-5'>
//       <div className="container light-style flex-grow-1 container-p-y py-5">
//         <h4 className="font-weight-bold py-3 mb-4 text-white">
//           Account settings
//         </h4>
//         <form onSubmit={formik.handleSubmit}>
//           <div className="card overflow-hidden Gray-Color">
//             <div className="card-body">
//               <div className="form-group">
//                 <label className="form-label text-white">Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="name"
//                   onChange={formik.handleChange}
//                   value={formik.values.name}
//                 />
//                 {formik.errors.name && <div className="text-danger">{formik.errors.name}</div>}
//               </div>
//               <div className="form-group">
//                 <label className="form-label text-white">E-mail</label>
//                 <input
//                   type="email"
//                   className="form-control"
//                   name="email"
//                   onChange={formik.handleChange}
//                   value={formik.values.email}
//                 />
//                 {formik.errors.email && <div className="text-danger">{formik.errors.email}</div>}
//               </div>
//               {Errmsg && <div className="text-danger mt-2">{Errmsg}</div>}
//             </div>
//           </div>
//           <div className="text-right mt-3">
//             <button type="submit" className="btn bg-main profile-btn" disabled={!loading}>
//               {loading ? 'Save changes' : 'Updating...'}
//             </button>
//             <Link to="/profile" className="btn text-white">Cancel</Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

