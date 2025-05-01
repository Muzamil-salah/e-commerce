import React, { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ProfileContext } from '../../context/ProfileContext.js';


export default function ChangePassword() {
  const navigate = useNavigate();
  const [Errmsg, setErrmsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const { userData } = useContext(ProfileContext);
  const [formikErrors, setFormikErrors] = useState({});

  // Clear form errors after 5 seconds
  useEffect(() => {
    if (Object.keys(formikErrors).length > 0) {
      const timer = setTimeout(() => {
        setFormikErrors({});
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formikErrors]);

  // Clear API error message after 5 seconds
  useEffect(() => {
    if (Errmsg) {
      const timer = setTimeout(() => {
        setErrmsg('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [Errmsg]);

  async function changePassword(values) {
    try {
      setLoading(false);
      const token = Cookies.get('token');
      const { data } = await axios.put('http://localhost:8000/api/v1/user/password', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.status === 'success') {
        setSuccessMsg('Password changed successfully!');
        setTimeout(() => navigate('/profile'), 2000);
      }
    } catch (err) {
      console.log(err);
      setErrmsg(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(true);
    }
  }

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: values => {
      const errors = {};
      if (!values.currentPassword) {
        errors.currentPassword = 'Current password is required';
      }
      if (!values.newPassword) {
        errors.newPassword = 'New password is required';
      } else if (values.newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      setFormikErrors(errors); // Update the formikErrors state
      return errors;
    },
    onSubmit: values => {
      changePassword(values);
    },
  });

  return (
    <div className='bg-grad mt-5'>
      <div className="container light-style flex-grow-1 container-p-y py-5">
        <h4 className="font-weight-bold py-3 mb-4 text-white">
          Change Password
        </h4>
        <form onSubmit={formik.handleSubmit}>
          <div className="card overflow-hidden Gray-Color">
            <div className="card-body">
              <div className="form-group mb-3 ">
                <label className="form-label text-white">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="currentPassword"
                  onChange={formik.handleChange}
                  value={formik.values.currentPassword}
                />
                {formikErrors.currentPassword && <div className="text-danger">{formikErrors.currentPassword}</div>}
              </div>
              <div className="form-group mb-3">
                <label className="form-label text-white">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="newPassword"
                  onChange={formik.handleChange}
                  value={formik.values.newPassword}
                />
                {formikErrors.newPassword && <div className="text-danger">{formikErrors.newPassword}</div>}
              </div>
              <div className="form-group mb-3">
                <label className="form-label text-white">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                />
                {formikErrors.confirmPassword && <div className="text-danger">{formikErrors.confirmPassword}</div>}
              </div>
              {successMsg && <div className="text-success mt-2">{successMsg}</div>}
              {Errmsg && <div className="text-danger mt-2">{Errmsg}</div>}
            </div>
          </div>
          <div className="text-right mt-3">
            <button type="submit" className="btn bg-main profile-btn" disabled={!loading}>
              {loading ? 'Change Password' : 'Updating...'}
            </button>
            <Link to="/profile" className="btn text-white">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}



// import React, { useState , useContext } from 'react';
// import { useFormik } from 'formik';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { ProfileContext } from '../../context/ProfileContext.js';

// export default function ChangePassword() {
//   const navigate = useNavigate();
//   const [Errmsg, setErrmsg] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [successMsg, setSuccessMsg] = useState('');
//   const { userData } = useContext(ProfileContext);

//   async function changePassword(values) {
//     try {
//       setLoading(false);
//       const token = Cookies.get('token');
//       const { data } = await axios.put('http://localhost:8000/api/v1/user/password', values, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (data.status === 'success') {
//         setSuccessMsg('Password changed successfully!');
//         setTimeout(() => navigate('/profile'), 2000);
//       }
//     } catch (err) {
//       console.log(err);
//       setErrmsg(err.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(true);
//     }
//   }

//   const formik = useFormik({
//     initialValues: {
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: '',
//     },
//     validate: values => {
//       const errors = {};
//       if (!values.currentPassword) {
//         errors.currentPassword = 'Current password is required';
//       }
//       if (!values.newPassword) {
//         errors.newPassword = 'New password is required';
//       } else if (values.newPassword.length < 6) {
//         errors.newPassword = 'Password must be at least 6 characters';
//       }
//       if (!values.confirmPassword) {
//         errors.confirmPassword = 'Please confirm your password';
//       } else if (values.newPassword !== values.confirmPassword) {
//         errors.confirmPassword = 'Passwords do not match';
//       }
//       return errors;
//     },
//     onSubmit: values => {
//       changePassword(values);
//     },
//   });

//   return (
//     <div className='bg-grad mt-5'>
//       <div className="container light-style flex-grow-1 container-p-y py-5">
//         <h4 className="font-weight-bold py-3 mb-4 text-white">
//           Change Password
//         </h4>
//         <form onSubmit={formik.handleSubmit}>
//           <div className="card overflow-hidden Gray-Color">
//             <div className="card-body">
//               <div className="form-group">
//                 <label className="form-label text-white">Current Password</label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   name="currentPassword"
//                   onChange={formik.handleChange}
//                   value={formik.values.currentPassword}
//                 />
//                 {formik.errors.currentPassword && <div className="text-danger">{formik.errors.currentPassword}</div>}
//               </div>
//               <div className="form-group">
//                 <label className="form-label text-white">New Password</label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   name="newPassword"
//                   onChange={formik.handleChange}
//                   value={formik.values.newPassword}
//                 />
//                 {formik.errors.newPassword && <div className="text-danger">{formik.errors.newPassword}</div>}
//               </div>
//               <div className="form-group">
//                 <label className="form-label text-white">Confirm New Password</label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   name="confirmPassword"
//                   onChange={formik.handleChange}
//                   value={formik.values.confirmPassword}
//                 />
//                 {formik.errors.confirmPassword && <div className="text-danger">{formik.errors.confirmPassword}</div>}
//               </div>
//               {successMsg && <div className="text-success mt-2">{successMsg}</div>}
//               {Errmsg && <div className="text-danger mt-2">{Errmsg}</div>}
//             </div>
//           </div>
//           <div className="text-right mt-3">
//             <button type="submit" className="btn bg-main profile-btn" disabled={!loading}>
//               {loading ? 'Change Password' : 'Updating...'}
//             </button>
//             <Link to="/profile" className="btn text-white">Cancel</Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

