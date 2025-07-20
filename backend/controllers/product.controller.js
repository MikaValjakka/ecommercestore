import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); //find all products
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getfeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");

    if (featuredProducts) {
      return res.json({ products: JSON.parse(featuredProducts) });
    }

    // .lean(); to convert Mongoose objects to plain JavaScript objects
    featuredProducts = await Product.find({ featured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in redis for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.json({ products: featuredProducts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
 try {
  const {name, description, price, image, category} = req.body;
  let cloudinaryResponse = null

  if (image) {
    cloudinaryResponse= await cloudinary.uploader.upload(image,{folder:"products"})
    }

  const product = await Product.create({
    name,
    description,
    price,
    image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
    category,
  });
  res.status(201).json({ product });
 } catch (error) {
  console.log("Error in createProduct controller", error.message);
  res.status(500).json({ message: "Server error", error: error.message });
  
 }
};

export const deleteProduct = async (req, res) => {
  /* 
  This function deletes a product from the database
   and also deletes the image from Cloudinary
  */
 
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);
  
  // If the product is not found, return a 404 error
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  // Delete the image from Cloudinary
  if(product.image){
    const publicId = product.image.split("/").pop().split(".")[0]; // this will get the public id from the image url
    try {
      await cloudinary.uploader.destroy(`products/${publicId}`);
      console.log("Image deleted from Cloudinary");
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      
    }
  }

  // Delete the product from the database
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted successfully" });

} catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {

  try {
    //aggregate means that we can perform multiple operations on the data
    const products = await Product.aggregate([
      
      {
        // $sample is used to randomly select a specified number of documents
      $sample:{ size: 4 }
      },
      {
        // $project is used to include specific fields in the output
        $project:{
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1
        }
      }
    ])
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    
  }
}

export const getProductsByCategory = async (req, res) => {
  // get the category from the request -> /api/products/category/:category
  const { category } = req.params;

  try {

    // get products by category
    const products = await Product.find({ category });

    // return the products
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const toggleFeaturedProduct = async (req, res) => {

  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    await updatedFeaturedProductCache();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function updatedFeaturedProductCache() {

  try {
    // get all featured products by featured: true
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in upodate cache function", error.message);
  }
}