/**
 * Build a full 1..5 rating distribution map from
 * aggregate rows like [{ _id: 5, count: 3 }, ...].
 */
const buildRatingDistribution = (distributionRows = []) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const row of distributionRows) {
        if (distribution[row._id] !== undefined) {
            distribution[row._id] = row.count;
        }
    }

    return distribution;
};

/**
 * Compute the weighted average rating (1 decimal place).
 */
const computeAverage = (distribution, total) => {
    if (!total) {
        return 0;
    }

    const sum = Object.entries(distribution).reduce(
        (acc, [rating, count]) => acc + Number(rating) * count,
        0
    );

    return Math.round((sum / total) * 10) / 10;
};

module.exports = {
    buildRatingDistribution,
    computeAverage,
};
