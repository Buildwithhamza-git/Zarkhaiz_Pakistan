const Product = require("../../product/product.model");

const reviewRepository = require("../repository/review.repository");
const { buildRatingDistribution, computeAverage } = require("./reviewStats");

/**
 * Recompute a product's averageRating, totalReviews and
 * ratingDistribution from its approved reviews, then persist.
 */
const recalculateProductRating = async (productId) => {
    const [distributionRows, totalReviews] = await Promise.all([
        reviewRepository.aggregateProductApprovedRatings(productId),
        reviewRepository.countProductApproved(productId),
    ]);

    const ratingDistribution = buildRatingDistribution(distributionRows);
    const averageRating = computeAverage(ratingDistribution, totalReviews);

    await Product.updateOne(
        { _id: productId },
        { averageRating, totalReviews, ratingDistribution }
    );

    return { averageRating, totalReviews, ratingDistribution };
};

module.exports = recalculateProductRating;
