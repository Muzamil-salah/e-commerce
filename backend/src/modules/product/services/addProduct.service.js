import multer from 'multer';
import path from 'path';
import Product from '../../../DB/models/Product.model.js';
import Category from '../../../DB/models/category.model.js'


// Create Product API
const addProduct=async (req, res) => {
  const { name, price, description ,category ,countInStock , detaileddescription ,brand } = req.body;
  if (!req.body.name || !req.body.price || !req.body.description || !req.body.category || !req.body.countInStock) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const categoryName= await Category.findOne({name:category})
  // const categoryName= await category.findOne({name:category})
  console.log("categoryName : " +categoryName);
  
  
  const images = req.files.map(file => file.filename); 
  console.log(images);
  

  const newProduct = {
    name,
    price,
    description,
    detaileddescription,
    brand,
    category:categoryName._id,
    countInStock,
    images // array of filenames
  };

  const product= await Product.create(newProduct)
  return res.status(201).json({
    message:'Done',
    product
  })

}

export default addProduct;