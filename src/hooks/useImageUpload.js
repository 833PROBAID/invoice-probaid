import { useState } from "react";
import {
	cloudinaryUploadUrl,
	cloudinaryConfig,
} from "../Shared/cloudinaryConfig";

const useImageUpload = () => {
	const [uploading, setUploading] = useState(false);

	const uploadImage = async (file) => {
		if (!file) return null;

		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", cloudinaryConfig.uploadPreset);

			const response = await fetch(cloudinaryUploadUrl, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) throw new Error("Upload failed");
			const data = await response.json();
			return data.secure_url;
		} catch (error) {
			console.error("Error uploading image:", error);
			throw error;
		} finally {
			setUploading(false);
		}
	};

	const deleteImage = async (imageUrl) => {
		if (!imageUrl) return;
		try {
			// Extract public_id from URL
			const match = imageUrl.match(
				/upload\/(?:v\d+\/)?(.+?)\.(?:jpg|jpeg|png|gif)/i,
			);
			if (!match) return true;

			const publicId = match[1];
			const timestamp = Math.round(new Date().getTime() / 1000);

			// Create string to sign in correct order
			const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryConfig.apiSecret}`;
			const encoder = new TextEncoder();
			const data = encoder.encode(stringToSign);
			const hashBuffer = await crypto.subtle.digest("SHA-1", data);
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			const signature = hashArray
				.map((b) => b.toString(16).padStart(2, "0"))
				.join("");

			const formData = new FormData();
			formData.append("public_id", publicId);
			formData.append("signature", signature);
			formData.append("api_key", cloudinaryConfig.apiKey);
			formData.append("timestamp", timestamp);

			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
				{
					method: "POST",
					body: formData,
				},
			);

			const result = await response.json();
			if (result.result === "ok") {
				return true;
			}
			throw new Error(result.error?.message || "Delete failed");
		} catch (error) {
			console.error("Error deleting image:", error);
			// If error indicates resource not found, consider it already deleted
			if (error.message?.includes("not found")) {
				return true;
			}
			throw error;
		}
	};

	return { uploadImage, deleteImage, uploading };
};

export default useImageUpload;
