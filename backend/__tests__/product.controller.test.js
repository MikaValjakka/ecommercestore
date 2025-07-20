import request from "supertest";
import express from "express";

import { getRecommendedProducts, getAllProducts  } from "../controllers/product.controller";
import Product from "../models/product.model"; // Mock this for testing

// Create an Express app for testing
const app = express();
app.use(express.json());
app.get("/api/products/recommended", getRecommendedProducts);
app.get("/api/products", getAllProducts);
// Mock the Product.aggregate method
jest.mock("../models/product.model");

describe("GET /api/products/recommended", () => {
  it("should return 3 recommended products", async () => {
    // Mock product data
    const mockProducts = [
      { _id: "1", name: "Product 1", description: "Desc 1", price: 10, image: "image1.jpg" },
      { _id: "2", name: "Product 2", description: "Desc 2", price: 20, image: "image2.jpg" },
      { _id: "3", name: "Product 3", description: "Desc 3", price: 30, image: "image3.jpg" },
    ];

    // Set up mock implementation
    Product.aggregate.mockImplementationOnce(() => Promise.resolve(mockProducts));

    // Perform the API call
    const response = await request(app).get("/api/products/recommended");

    // Assertions
    expect(response.status).toBe(200); // Ensure success status
    expect(response.body.products).toHaveLength(3); // Ensure exactly 3 products
    expect(response.body.products).toEqual(mockProducts); // Ensure data matches
  });

  it("should return a 500 error if an exception occurs", async () => {
    // Simulate an error in Product.aggregate
    Product.aggregate.mockImplementationOnce(() => Promise.reject(new Error("Database error")));

    // Perform the API call
    const response = await request(app).get("/api/products/recommended");

    // Assertions
    expect(response.status).toBe(500); // Ensure server error status
    expect(response.body.message).toBe("Server error"); // Ensure error message
  });
});

describe("GET /api/products", () => {
  it("should return all products as JSON", async () => {
    // Mock product data
    const mockProducts = [
      { _id: "1", name: "Product 1", description: "Desc 1", price: 10, image: "image1.jpg" },
      { _id: "2", name: "Product 2", description: "Desc 2", price: 20, image: "image2.jpg" },
      { _id: "3", name: "Product 3", description: "Desc 3", price: 30, image: "image3.jpg" },
    ];

    // Set up mock implementation for Product.find
    Product.find.mockImplementationOnce(() => Promise.resolve(mockProducts));

    // Perform the API call
    const response = await request(app).get("/api/products");

    // Assertions
    expect(response.status).toBe(200); // Ensure success status
    expect(response.body.products).toHaveLength(3); // Ensure all products are returned
    expect(response.body.products).toEqual(mockProducts); // Ensure data matches
  });

  it("should return a 500 error if an exception occurs", async () => {
    // Simulate an error in Product.find
    Product.find.mockImplementationOnce(() => Promise.reject(new Error("Database error")));

    // Perform the API call
    const response = await request(app).get("/api/products");

    // Assertions
    expect(response.status).toBe(500); // Ensure server error status
    expect(response.body.message).toBe("Server error"); // Ensure error message
  });
});

