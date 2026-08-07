const Seller = require("../../seller/model/seller.model");

const {
    createNotificationsForUsersService,
} = require("../../notification/notification.service");

/**
 * Notify the seller (their User account) that a product received a review.
 * Best effort — failures are logged, never thrown.
 */
const notifySellerOfReview = async (review, product) => {
    try {
        const seller = await Seller.findById(review.seller).select("user");

        if (!seller?.user) {
            return;
        }

        await createNotificationsForUsersService([seller.user], {
            type: "review",
            title: "New review on your product",
            message: `${product.name} received a ${review.rating}-star rating.`,
            data: {
                productId: product._id,
                reviewId: review._id,
                rating: review.rating,
            },
        });
    } catch (error) {
        console.error("Review notification error:", error);
    }
};

module.exports = notifySellerOfReview;
