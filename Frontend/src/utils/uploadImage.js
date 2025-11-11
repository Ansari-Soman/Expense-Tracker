import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";

const uploadImage = async (image) => {
  const formData = new FormData();

  // Append image file to form data
  formData.append("image", image);
  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error uploading the image");
    throw err; // Re-throw error for handling
  }
};

export default uploadImage;
