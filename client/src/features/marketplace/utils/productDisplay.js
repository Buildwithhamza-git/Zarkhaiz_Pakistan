const isAbsoluteUrl = (value) =>
  typeof value === "string" && /^(https?:|data:)/i.test(value);

export function formatPKR(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return "0";
  return new Intl.NumberFormat("en-PK").format(Number(amount));
}

export function getProductDisplayData(product = {}, options = {}) {
  const safeProduct = product || {};
  const apiUrl = options.apiUrl || "";

  const images = Array.isArray(safeProduct.images)
    ? safeProduct.images.filter(Boolean)
    : [];

  // ✅ FIXED IMAGE HANDLING (supports both object + string)
  const firstImage = images[0];

  const rawImage =
    typeof firstImage === "string"
      ? firstImage
      : firstImage?.url;

  const imageUrl = rawImage
    ? isAbsoluteUrl(rawImage)
      ? rawImage
      : `${apiUrl}/${String(rawImage)
          .replace(/\\/g, "/")
          .replace(/^\/+/, "")}`
    : "/placeholder-product.png";

  const stock = Number(safeProduct.stock ?? safeProduct.quantity ?? 0);
  const price = Number(safeProduct.price ?? 0);
  const unit = safeProduct.unit || "unit";
  const status = safeProduct.status || "Active";
  const featured = Boolean(safeProduct.featured);
  const outOfStock = stock <= 0;
  const lowStock = stock > 0 && stock <= 10;

  const productName =
    safeProduct.name?.trim() || "Unnamed Product";

  const categoryName =
    safeProduct.category?.name ||
    safeProduct.category ||
    "Uncategorized";

  const description =
    safeProduct.description?.trim() ||
    "High-quality product with reliable delivery and verified seller support.";

  const seller = safeProduct.seller || {};

  const sellerName =
    seller.storeName ||
    seller.businessName ||
    seller.shopName ||
    seller.name ||
    (seller.user
      ? `${seller.user.firstname || ""} ${seller.user.lastname || ""}`.trim()
      : "Seller") ||
    "Seller";

  const sellerLocation =
    [seller.city, seller.province].filter(Boolean).join(", ") ||
    "Pakistan";

  return {
    imageUrl,
    productName,
    categoryName,
    description,
    price,
    quantity: stock,
    unit,
    status,
    featured,
    outOfStock,
    lowStock,
    sellerName,
    sellerLocation,
    averageRating: Number(safeProduct.averageRating ?? 0),
    totalReviews: Number(safeProduct.totalReviews ?? 0),
  };
}

export function getStockMeta(quantity, unit = "unit") {
  if (quantity <= 0) {
    return {
      label: "Out of stock",
      tone: "text-red-600",
      iconTone: "text-red-500",
    };
  }

  if (quantity <= 10) {
    return {
      label: `Only ${quantity} ${unit} left`,
      tone: "text-amber-600",
      iconTone: "text-amber-500",
    };
  }

  return {
    label: `${quantity} ${unit} available`,
    tone: "text-emerald-600",
    iconTone: "text-emerald-500",
  };
}