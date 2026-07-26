const test = require("node:test");
const assert = require("node:assert/strict");

const { getUploadedImageUrls } = require("./normalizeUploadedFiles");

test("collects image URLs from uploaded files", () => {
  const files = [
    { path: "https://res.cloudinary.com/demo/image1.jpg" },
    { secure_url: "https://res.cloudinary.com/demo/image2.jpg" },
    { url: "https://res.cloudinary.com/demo/image3.jpg" },
  ];

  assert.deepStrictEqual(getUploadedImageUrls(files), [
    "https://res.cloudinary.com/demo/image1.jpg",
    "https://res.cloudinary.com/demo/image2.jpg",
    "https://res.cloudinary.com/demo/image3.jpg",
  ]);
});

test("ignores files without a URL", () => {
  assert.deepStrictEqual(getUploadedImageUrls([{ originalname: "test.jpg" }]), []);
});
