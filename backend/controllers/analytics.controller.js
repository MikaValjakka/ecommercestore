import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async () => {
    // Get the total number of users in the database
    const totalUsers = await User.countDocuments({});
  
    // Get the total number of products in the database
    const totalProducts = await Product.countDocuments({});
    
    // Aggregate sales data from the orders collection
    // $group: Groups all documents to calculate:
    // - totalSales: Total number of orders (count of documents)
    // - totalRevenue: Sum of the "totalAmount" field across all orders
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null, // Group all documents together
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);
  
    // Extract totalSales and totalRevenue from the aggregation result
    // Default to 0 if no sales data is available
    const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };
  
    // Return the analytics data as a single object
    return { users: totalUsers, products: totalProducts, totalSales, totalRevenue };
  };

export const getDailySalesData = async (startDate, endDate) => {
    // Aggregate sales data from the orders collection
    // $group: Groups all documents to calculate:
    // - totalSales: Total number of orders (count of documents)
    // - totalRevenue: Sum of the "totalAmount" field across all orders

    /*
    return json object like this:
    {
        "2023-06-01": {
        "totalSales": 2,
        "totalRevenue": 100
    }}
    
    */
    try {
        const dailySalesData = await Order.aggregate([
            {
              $match: {
                  // greater than or equal to startDate and less than or equal to endDate
                createdAt: { $gte: startDate, $lte: endDate }
              }
            },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" }
              }
            },
            {
              $sort: {
                _id: 1
              }
            }
          ]);
      
          const dateArray = getDatesInRange(startDate, endDate);
      
          return dateArray.map(date => {
              const foundData = dailySalesData.find(data => data._id === date);
      
              return {
                  date,
                  totalSales: foundData?.totalSales || 0,
                  totalRevenue: foundData?.totalRevenue || 0
              }
          })
    } catch (error) {
        throw error;
    
    }
  };

  // Function to generate an array of dates between startDate and endDate
  // i.e. '2024-08-18', '2024-08-19', '2024-08-20',...
  function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }
  