// import React from 'react'
// import { Link } from 'react-router-dom'

// export default function BestSeller() {
//   return (
//     <>
//        <div className=' mt-5 pt-5 bg-grad text-white'>
//       <Link to="/admin"> <i className="fa-solid fa-circle-arrow-left main-color fs-2 "></i></Link>
//         <h2>
//             Best sellet


//         </h2>


//    <input type='text' placeholder='enter your name ' > </input>


//       </div>
//     </>
//   )
// }


import React, { useEffect, useState , useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { productContext } from '../../context/ProductContext.js';

export default function BestSeller() {
  let {getBastsellers}= useContext(productContext)
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await getBastsellers()
        
        setBestSellers(response.bestSellers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch best sellers.');
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <div className=' pt-5 bg-grad text-white p-4'>
      <Link to="/admin">
        <i className="fa-solid fa-circle-arrow-left main-color fs-2"></i>
      </Link>
      <div className=''>
        <h2 className="my-5 ms-3">Best Sellers :</h2>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
       <div className='rounded-5  d-flex justify-content-center'>
         <table className="table w-75 text-white Gray-Color main-color-border ">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Sold Quantity</th>
            </tr>
          </thead>
          <tbody>
            {bestSellers.map((item, index) => (
              <tr key={index}>
                <td>{item.productId}</td>
                <td>{item.sold}</td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
      )}
    </div>
  );
}
