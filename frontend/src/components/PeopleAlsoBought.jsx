import React from "react";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";

function PeopleAlsoBought() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get("/products/recommendations");
        console.log("Recommendations:", response.data.products);
        setRecommendations(response.data.products);
      } catch (error) {
        toast.error(error.response.data.message || "An error occurred");
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People Also Bought
      </h3>
      <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-col-3">
        {recommendations.map((products) => (
          <ProductCard key={products._id} product={products} />
        ))}
      </div>
    </div>
  );
}

export default PeopleAlsoBought;
