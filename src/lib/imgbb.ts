import { api } from "./api";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

/**
 * Uploads an image file to ImgBB and returns the optimized CDN URL.
 * Automatically tries direct browser upload first; falls back to server endpoint if needed.
 */
export async function uploadImageToImgBB(file: File): Promise<string> {
  if (!file) {
    throw new Error("No image file provided.");
  }

  // 1. Direct browser upload to ImgBB
  if (IMGBB_API_KEY) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data && data.success && data.data) {
        const url = data.data.display_url || data.data.url;
        if (url) return url;
      }
    } catch (directErr) {
      console.warn("Direct ImgBB upload fallback to server:", directErr);
    }
  } else {
    console.warn(
      "NEXT_PUBLIC_IMGBB_API_KEY is not defined. Routing upload through server proxy."
    );
  }

  // 2. Server proxy fallback
  const serverFormData = new FormData();
  serverFormData.append("image", file);

  const res = await api.post("/services/upload-image", serverFormData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const uploadedUrl = res.data?.data?.url || res.data?.data?.imageUrl;
  if (res.data?.success && uploadedUrl) {
    return uploadedUrl;
  }

  throw new Error("Failed to upload image. Please try again.");
}
