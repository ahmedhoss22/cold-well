const fs = require("fs");
const path = require("path");

async function deleteOldImages(imagePaths) {
  for (const filePath of imagePaths) {
    try {
      await fs.promises.unlink(path.join(__basedir, `uploads/${filePath}`));
    } catch (err) {
      console.error(`Failed to delete image at ${filePath}:`, err);
    }
  }
}

async function deleteImages(doc) {
  // Initialize an array to hold all file paths
  let mediaPaths = [];

  // Collect image paths
  if (doc.images && doc.images.length > 0) {
    mediaPaths = mediaPaths.concat(doc.images.map((image) => image.url));
  }

  // Collect video paths
  if (doc.video && doc.video.length > 0) {
    mediaPaths = mediaPaths.concat(doc.video.map((video) => video.url));
  }

  // Collect thumbnail paths
  if (doc.thumbnails && doc.thumbnails.length > 0) {
    mediaPaths = mediaPaths.concat(doc.thumbnails.map((thumbnail) => thumbnail.url));
  }

  // Iterate through all file paths and delete them
  for (const filePath of mediaPaths) {
    try {
      await fs.promises.unlink(path.join(__basedir, `uploads/${filePath}`));
    } catch (err) {
      console.error(`Failed to delete file at ${filePath}:`, err);
    }
  }
}


async function uploadImages(type, req) {
  if (req.files && req.files[type]) {
    const filenames = req.files[type].map((file) => ({ url: file.filename }));
    req.body[type] = filenames;
  } else {
    console.log(`No files uploaded for type: ${type}`);
  }
}

async function updateAndSet(doc, type, req) {
  // Collect old image paths
  const oldImagePaths = doc[type] ? doc[type].map((image) => image.url) : [];

  // Upload new images and set them to req.body
  await uploadImages(type, req);
console.log("ffffffffffffffffffffffffffffffffff",req.body);
  // Update the document with new images
  doc[type] = req.body[type];

  // Collect new image paths
  const newImagePaths = req.body[type]
    ? req.body[type].map((image) => image.url)
    : [];

  // Determine which old images are no longer used and delete them
  const imagesToDelete = oldImagePaths.filter(
    (path) => !newImagePaths.includes(path)
  );
  await deleteOldImages(imagesToDelete);
}

module.exports = {
  deleteOldImages,
  deleteImages,
  uploadImages,
  updateAndSet,
};
