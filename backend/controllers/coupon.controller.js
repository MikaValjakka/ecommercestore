import Coupon from "../models/coupon.model.js";

export const getCoupons = async (req, res) => {
    try {
        // finds coupons for the user based on isActive and userId
        // findOne returns the first document that matches the query
        const coupon = await Coupon.findOne({
            userId: req.user._id,
            isActive: true
        });
        // respond with json coupon or null
        res.json(coupon || null);
    } catch (error) {
        console.log("Error in getCoupons controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }


};

// validate coupon
export const validateCoupon = async (req, res) => {
    try {
        // finds coupon based on code, userId and isActive
        const { code } = req.body;
        const coupon = await Coupon.findOne({
            code: code,
            userId: req.user._id,
            isActive: true
        });
        // if coupon not found return 404
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        // if coupons expiration date is less than current date
        // change isActive to false and return 400
        if (coupon.expirationDate < Date.now()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({ message: "Coupon has expired" });
        }
        // respond with json
        res.json({
            message: "Coupon is valid",
            discountPercentage: coupon.discountPercentage,
            code: coupon.code
        });

    } catch (error) {
        console.log("Error in validateCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });

    }
};