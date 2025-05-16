
import React, { useContext, useEffect, useState } from 'react';
import { productContext } from '../context/ProductContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function Products() {
  let { getProducts, reomveProductItem, updateProduct } = useContext(productContext);
  const [productsItems, setProductItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';
  // Check if it's already a full URL (for seeded data maybe)
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise construct the proper URL
  return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/uploads/${imagePath}`;
};
  // Validation schema
  const productSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
    countInStock: Yup.number().min(0, 'Stock must be positive').required('Stock is required'),
    category: Yup.string().required('Category is required'),
    brand: Yup.string().required('Brand is required'),
    discount: Yup.number().min(0, 'Discount must be positive').max(100, 'Discount cannot exceed 100'),
  });

  // Fetch products, categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        let data = await getProducts();
        if (data) {
          setProductItems(data.products);
        }
        
        // Mock data for categories and brands
        setCategories(['Shoes', 'Clothing', 'Accessories']);
        setBrands(['Nike', 'Adidas', 'Puma']);
      } catch (error) {
        toast.error('Error fetching data');
      }
    };

    fetchData();
  }, []);

  async function deleteProductItem(id) {
    try {
      let data = await reomveProductItem(id);
      setProductItems(data.products);
      toast.error('Product deleted successfully');
    } catch (error) {
      toast.error('Error deleting product');
    }
  }

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentProduct(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await updateProduct(currentProduct._id, values);
      
      if (response.status === 'success') {
        // Update the product in the local state
        setProductItems(productsItems.map(item => 
          item._id === currentProduct._id ? response.productAfterUpdates : item
        ));
        toast.success('Product updated successfully');
        handleCloseEditModal();
      } else {
        toast.error(response.message || 'Failed to update product');
      }
    } catch (error) {
      toast.error(error.message || 'Error updating product');
    } finally {
      setSubmitting(false);

      
    }
  };

  return (
    <div className='bg-blackAndGray'>
      <div className='d-flex justify-content-between px-5 py-5'>
        <Link to="/admin"> 
          <i className="fa-solid fa-circle-arrow-left main-color fs-2"></i>
        </Link>
        <Link to="/addProduct" className='un-underline'>
          <i className="fa-solid fa-plus text-black bg-main rounded-5 p-2"></i>
        </Link>
      </div>
      
      <div className="container main-color-border p-3">
        
        {productsItems?.map(item => (

          <div key={item._id} className="row border-bottom py-2">
            {      console.log('Image path:', item.images[0], 'Full URL:', getImageUrl(item.images[0]))}
            <div className="col-md-1">
              {/* src={item.images[0] ||`http://localhost:8000/uploads/${item.images[0]}`} */}
              <img className='w-100' src={getImageUrl(item.images?.[0])}  alt={item.name} />
            </div>
            <div className="col-md-8 d-flex justify-content-between align-items-center">
              <div className='px-4'>
                <h5>{item.name}</h5>
                <p className='fs-6 main-color m-0'>Price: {item.price} EGP</p>
                <p className={`fs-6 m-0 ${item.countInStock < 5 ? 'text-danger' : 'main-color'}`}>
                  Stock: {item.countInStock}
                </p>
              </div>
            </div>
            <div className="col-md-3 d-flex justify-content-end align-items-center gap-2">
              <button 
                onClick={() => handleEditClick(item)} 
                className='btn bg-main'
              >
                Edit
              </button>
              <button 
                onClick={() => deleteProductItem(item._id)} 
                className='btn btn-danger'
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Modal */}
      {showEditModal && currentProduct && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark main-color-border text-white">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product: {currentProduct.name}</h5>
                <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
              </div>
              <div className="modal-body bg-black">
                <Formik
                  initialValues={{
                    name: currentProduct.name,
                    description: currentProduct.description,
                    price: currentProduct.price,
                    countInStock: currentProduct.countInStock,
                    category: currentProduct.category,
                    brand: currentProduct.brand,
                    discount: currentProduct.discount || 0,
                  }}
                  validationSchema={productSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Name</label>
                          <Field type="text" name="name" className="form-control" />
                          <ErrorMessage name="name" component="div" className="text-danger small" />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Price (EGP)</label>
                          <Field type="number" name="price" className="form-control" />
                          <ErrorMessage name="price" component="div" className="text-danger small" />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Stock Quantity</label>
                          <Field type="number" name="countInStock" className="form-control" />
                          <ErrorMessage name="countInStock" component="div" className="text-danger small" />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Discount (%)</label>
                          <Field type="number" name="discount" className="form-control" />
                          <ErrorMessage name="discount" component="div" className="text-danger small" />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Category</label>
                          <Field as="select" name="category" className="form-select">
                            <option value="">Select Category</option>
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="category" component="div" className="text-danger small" />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Brand</label>
                          <Field as="select" name="brand" className="form-select">
                            <option value="">Select Brand</option>
                            {brands.map(brand => (
                              <option key={brand} value={brand}>{brand}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="brand" component="div" className="text-danger small" />
                        </div>

                        <div className="col-12 mb-3">
                          <label className="form-label">Description</label>
                          <Field as="textarea" name="description" className="form-control" rows="3" />
                          <ErrorMessage name="description" component="div" className="text-danger small" />
                        </div>
                      </div>

                      <div className="d-flex justify-content-end mt-4">
                        <button 
                          type="button" 
                          className="btn btn-secondary me-2" 
                          onClick={handleCloseEditModal}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}