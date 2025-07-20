import {create} from 'zustand';
import toast from "react-hot-toast";
import axios from "../lib/axios";

const useProductStore = create((set) =>
({
    products: [],
    loading: false,

    // function to  set products
    setProducts: (products) => set({products}),

    
    createProduct: async (productData)=>{
        set({loading: true});
        try {
            const res = await axios.post('/products', productData);
            set((prevState)=>({
                products: [...prevState.products, res.data],
                loading: false,
            }))
            console.log(res.data);
        } catch (error) {
            toast.error(error.response.data.message) || "An error occurred";
            set({loading: false});
        }
    },

    deleteProduct: async (productId) => {
        set({loading: true});
        try {
            await axios.delete(`/products/${productId}`);
            set((prevState)=>({
                products: prevState.products.filter((product)=>product._id !== productId),
                loading: false,
            }))
        } catch (error) {
            toast.error(error.response.data.message) || "An error occurred";
            set({loading: false});
        }
    },

    toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
		}
	},

    fetchAllProducts: async () => {
        set({loading: true});
        try {
            const res = await axios.get('/products');
            set({products: res.data.products, loading: false});
        } catch (error) {
            toast.error(error.response.data.message) || "An error occurred";
            set({ error: "Failed to fetch products", loading: false});
        }
    },
    
    fetchProductsByCategory: async (category) => {
        set({loading: true});
        try {
            const res = await axios.get(`/products/category/${category}`);
            set({products: res.data.products, loading: false});
        } catch (error) {
            toast.error(error.response.data.message) || "An error occurred";
            set({ error: "Failed to fetch products", loading: false});
        }
    },
}))

export default useProductStore;