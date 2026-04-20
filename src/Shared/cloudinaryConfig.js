export const cloudinaryConfig = {
	cloudName: "dbc-of-tony",
	uploadPreset: "BLOGS-833PROBAID",
	apiKey: "597384449579479",
	apiSecret: "k0q5NOcj7_rIfOvODUOkyrwfDAY",
};

export const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`;

export const generateSignature = async (publicId, timestamp) => {
	const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryConfig.apiSecret}`;

	// Use the SubtleCrypto API to create SHA-1 hash
	const encoder = new TextEncoder();
	const data = encoder.encode(stringToSign);
	const hashBuffer = await crypto.subtle.digest("SHA-1", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return hashHex;
};
