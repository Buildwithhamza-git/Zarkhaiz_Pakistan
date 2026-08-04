require("dotenv").config();
const mongoose = require("mongoose");
const Conversation = require("./src/features/chat/model/conversation.model");
const Seller = require("./src/features/seller/model/seller.model");
const Product = require("./src/features/product/product.model");
const User = require("./src/features/users/user.model");

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("connected\n");

        const sellers = await Seller.find({}).select("_id user storeName status").lean();
        const sellerByUser = {};
        for (const s of sellers) {
            sellerByUser[String(s.user)] = s;
        }
        console.log("=== SELLERS (user -> store) ===");
        for (const s of sellers) {
            console.log(`  user=${String(s.user)}  seller=${String(s._id)}  store="${s.storeName}"  status=${s.status}`);
        }

        const conversations = await Conversation.find({})
            .populate("seller", "storeName user")
            .populate("participants.user", "firstname lastname email")
            .lean();

        console.log("\n=== ALL CONVERSATIONS ===");
        for (const c of conversations) {
            const convSellerUser = String(c.seller?.user || "");
            const parts = (c.participants || []).map((p) => ({
                id: String(p.user?._id || p.user),
                name: `${p.user?.firstname || ""} ${p.user?.lastname || ""}`.trim() || (p.user?.email || "?"),
            }));
            const isSellerDocLinked = sellerByUser[convSellerUser] && String(sellerByUser[convSellerUser]._id) === String(c.seller?._id);

            console.log(`\nconv=${String(c._id)}  created=${c.createdAt.toISOString()}`);
            console.log(`  seller(sellerDoc)=${String(c.seller?._id)} store="${c.seller?.storeName}" sellerUser=${convSellerUser}  [consistent=${isSellerDocLinked}]`);
            console.log(`  participants: ${parts.map((p) => `${p.name}(${p.id})`).join("  <->  ")}`);
        }
    } catch (err) {
        console.error("DIAGNOSE ERROR:", err);
    } finally {
        await mongoose.disconnect();
    }
})();
