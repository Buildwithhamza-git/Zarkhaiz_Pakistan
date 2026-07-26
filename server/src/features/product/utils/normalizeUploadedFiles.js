const getUploadedImageUrls = (files = []) => {
  if (!Array.isArray(files)) return [];

  return files
    .map((file) => file?.path || file?.secure_url || file?.url)
    .filter(Boolean);
};

module.exports = {
  getUploadedImageUrls,
};
