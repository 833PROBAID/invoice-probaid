// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:2000/api";
// const API_BASE_URL = import.meta.env.VITE_API_URL || "https://invoice.833probate.com/api";

// Custom error class for API errors
class APIError extends Error {
	constructor(message, status, data = null) {
		super(message);
		this.name = "APIError";
		this.status = status;
		this.data = data;
	}
}

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
	const url = `${API_BASE_URL}${endpoint}`;

	// Get auth token from localStorage
	const token = localStorage.getItem("token");

	const config = {
		headers: {
			"Content-Type": "application/json",
			...(token && { Authorization: `Bearer ${token}` }),
			...options.headers,
		},
		...options,
	};

	try {
		const response = await fetch(url, config);
		const data = await response.json().catch(() => null);

		if (!response.ok) {
			// Handle unauthorized - redirect to login
			if (response.status === 401) {
				localStorage.removeItem("invoiceAuthToken");
				localStorage.removeItem("invoiceAdmin");
				window.location.href = "/invoice-login";
			}

			throw new APIError(
				data?.message || `HTTP error! status: ${response.status}`,
				response.status,
				data,
			);
		}

		return data;
	} catch (error) {
		if (error instanceof APIError) {
			throw error;
		}
		// Network or other errors
		throw new APIError(error.message || "Network error occurred", 0, null);
	}
}

// Invoice API
export const invoiceAPI = {
	/**
	 * Get all invoices with pagination and filtering
	 * @param {Object} params - Query parameters
	 * @param {number} params.page - Page number (default: 1)
	 * @param {number} params.limit - Items per page (default: 10)
	 * @param {string} params.search - Search term
	 * @param {string} params.startDate - Start date filter (YYYY-MM-DD)
	 * @param {string} params.endDate - End date filter (YYYY-MM-DD)
	 * @param {string} params.sortBy - Sort field (default: createdAt)
	 * @param {string} params.sortOrder - Sort order (asc/desc, default: desc)
	 * @returns {Promise<Object>} Paginated invoices response
	 */
	getAll: async (params = {}) => {
		const queryString = new URLSearchParams(
			// eslint-disable-next-line no-unused-vars
			Object.entries(params).filter(([_key, v]) => v !== undefined && v !== ""),
		).toString();
		return apiRequest(`/invoices${queryString ? `?${queryString}` : ""}`);
	},

	/**
	 * Get single invoice by ID
	 * @param {string} id - Invoice MongoDB ID
	 * @returns {Promise<Object>} Invoice object
	 */
	getById: async (id) => {
		if (!id) throw new APIError("Invoice ID is required", 400);
		return apiRequest(`/invoices/${id}`);
	},

	/**
	 * Create new invoice
	 * @param {Object} data - Invoice data
	 * @returns {Promise<Object>} Created invoice
	 */
	create: async (data) => {
		if (!data.invoiceNumber)
			throw new APIError("Invoice number is required", 400);
		if (!data.date) throw new APIError("Date is required", 400);

		return apiRequest("/invoices", {
			method: "POST",
			body: JSON.stringify(data),
		});
	},

	/**
	 * Update invoice status
	 * @param {string} id - Invoice MongoDB ID
	 * @param {string} status - New status (draft, sent, paid, overdue, cancelled)
	 * @returns {Promise<Object>} Updated invoice
	 */
	updateStatus: async (id, status) => {
		if (!id) throw new APIError("Invoice ID is required", 400);
		if (!status) throw new APIError("Status is required", 400);

		return apiRequest(`/invoices/${id}/status`, {
			method: "PATCH",
			body: JSON.stringify({ status }),
		});
	},

	/**
	 * Update existing invoice
	 * @param {string} id - Invoice MongoDB ID
	 * @param {Object} data - Updated invoice data
	 * @returns {Promise<Object>} Updated invoice
	 */
	update: async (id, data) => {
		if (!id) throw new APIError("Invoice ID is required", 400);

		// Remove MongoDB internal fields before update
		// eslint-disable-next-line no-unused-vars
		const { _id, __v, createdAt, updatedAt, ...updateData } = data;

		return apiRequest(`/invoices/${id}`, {
			method: "PUT",
			body: JSON.stringify(updateData),
		});
	},

	/**
	 * Delete invoice
	 * @param {string} id - Invoice MongoDB ID
	 * @returns {Promise<Object>} Deletion confirmation
	 */
	delete: async (id) => {
		if (!id) throw new APIError("Invoice ID is required", 400);
		return apiRequest(`/invoices/${id}`, {
			method: "DELETE",
		});
	},

	/**
	 * Get suggestions for autocomplete fields
	 * @param {string} field - Field name to get suggestions for
	 * @param {string} query - Optional search query
	 * @returns {Promise<string[]>} Array of suggestion values
	 */
	getSuggestions: async (field, query = "") => {
		const allowedFields = [
			"billingContact",
			"fromAddress",
			"companyName",
			"toAddress",
			"phone",
			"phone2",
			"email",
			"payableTo",
			"mailingAddress",
			"nameZelle",
			"phoneZelle",
			"emailZelle",
			"descriptions",
			"includedServices",
			"invoiceNumber",
			"notes",
			"disclaimer",
		];

		if (!allowedFields.includes(field)) {
			console.warn(`Invalid field for suggestions: ${field}`);
			return [];
		}

		try {
			const queryString = query ? `?query=${encodeURIComponent(query)}` : "";
			const data = await apiRequest(
				`/invoices/suggestions/${field}${queryString}`,
			);
			return Array.isArray(data) ? data.map((item) => item.value) : [];
		} catch (error) {
			console.error(`Error fetching suggestions for ${field}:`, error);
			return [];
		}
	},

	/**
	 * Generate next invoice number
	 * @returns {Promise<string>} Next invoice number
	 */
	getNextInvoiceNumber: async () => {
		try {
			const data = await apiRequest("/invoices/next-number");
			return data.nextNumber;
		} catch {
			// Fallback to date-based number if endpoint fails
			const date = new Date();
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const random = Math.floor(Math.random() * 1000)
				.toString()
				.padStart(3, "0");
			return `INV-${year}${month}-${random}`;
		}
	},

	/**
	 * Get invoice statistics/summary
	 * @returns {Promise<Object>} Invoice statistics
	 */
	getStats: async () => {
		try {
			return await apiRequest("/invoices/stats");
		} catch {
			return { total: 0, totalAmount: 0, thisMonth: 0, thisMonthAmount: 0 };
		}
	},
};

// Auth API
export const authAPI = {
	/**
	 * Login admin
	 * @param {string} username - Admin username
	 * @param {string} password - Admin password
	 * @returns {Promise<Object>} Login response with token and admin data
	 */
	login: async (username, password) => {
		if (!username || !password) {
			throw new APIError("Username and password are required", 400);
		}

		return apiRequest("/auth/login", {
			method: "POST",
			body: JSON.stringify({ username, password }),
		});
	},

	/**
	 * Register new admin (for initial setup)
	 * @param {Object} data - Registration data
	 * @returns {Promise<Object>} Registration response
	 */
	register: async (data) => {
		const { username, password, email, role } = data;

		if (!username || !password || !email) {
			throw new APIError("Username, password, and email are required", 400);
		}

		return apiRequest("/auth/register", {
			method: "POST",
			body: JSON.stringify({ username, password, email, role }),
		});
	},

	/**
	 * Verify token and get admin data
	 * @returns {Promise<Object>} Admin data
	 */
	verify: async () => {
		return apiRequest("/auth/verify");
	},

	/**
	 * Logout admin
	 * @returns {Promise<Object>} Logout response
	 */
	logout: async () => {
		try {
			await apiRequest("/auth/logout", { method: "POST" });
		} finally {
			localStorage.removeItem("invoiceAuthToken");
			localStorage.removeItem("invoiceAdmin");
		}
	},

	/**
	 * Change password
	 * @param {string} currentPassword - Current password
	 * @param {string} newPassword - New password
	 * @returns {Promise<Object>} Response
	 */
	changePassword: async (currentPassword, newPassword) => {
		if (!currentPassword || !newPassword) {
			throw new APIError("Current and new password are required", 400);
		}

		return apiRequest("/auth/change-password", {
			method: "PUT",
			body: JSON.stringify({ currentPassword, newPassword }),
		});
	},

	/**
	 * Check if user is authenticated
	 * @returns {boolean} Authentication status
	 */
	isAuthenticated: () => {
		return !!localStorage.getItem("token");
	},

	/**
	 * Get stored admin data
	 * @returns {Object|null} Admin data or null
	 */
	getAdminData: () => {
		try {
			const name = localStorage.getItem("adminName");
			return name ? { username: name } : null;
		} catch {
			return null;
		}
	},
};

export { APIError };
export default invoiceAPI;
