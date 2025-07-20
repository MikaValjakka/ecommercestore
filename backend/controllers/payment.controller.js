import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

export const createCheckoutSession = async (req, res) => {

    try {

        const { products, couponCode } = req.body;

        //checkes if products is an array or producs length is 0
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "No products provided" });
        }

        let totalAmount = 0;

        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100);
            totalAmount += amount * product.quantity;

            return {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },

            }
        });
        let coupon = null;

        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
            if (coupon) {
                // TODO: check if coupon precentage calculation is correct
                totalAmount = Math.round(totalAmount * coupon.discountPercentage / 100);
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purcase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purcase-cancel`,
            discounts: coupon ? [{
                coupon: await createStripeCoupon(coupon.discountPercentage)
            }] : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    //using functional programming to get the id, quantity and price
                    products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price
                    }))
                )
            }

        });

        if (totalAmount >= 20000) {
            await createNewCoupon(req.user._id);
        }
        res.status(200).json({ id: session.id, totalAmout: totalAmount / 100 });
    }
    catch (error) {
        console.error("Error in createCheckoutSession controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });

    }
}

export const checkoutSuccess = async (req, res) => {

    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {

            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate({
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId
                },
                    {
                        isActive: false
                    })
            }
            //create new order
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map(p => ({
                    product: p.id,
                    quantity: p.quantity,
                    price: p.price
                })),
                totalAmount: session.amount_total / 100,
                stripeSessionId: sessionId
            })

            await newOrder.save();
            res.status(200).json({
                success: true,
                message: "Order created successfully",
                orderId: newOrder._id});
        }
    } catch (error) {
        console.error("Error in checkout success controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });

    }

}

async function createStripeCoupon(discountPercentage) {
    const stripeCoupon = await stripe.coupons.create({
        duration: "once",
        duration_in_months: null,
        percent_off: discountPercentage,
    });
    return stripeCoupon.id;
}

async function createNewCoupon(userId) {
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        userId: userId
    })

    await newCoupon.save();
    return newCoupon;

}
