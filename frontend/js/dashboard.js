
// ==========================================
// SecureDocs Dashboard - JWT Authentication
// ==========================================

// Change this if your backend runs at another address.
const API_BASE_URL = "http://localhost:8000";

// Read the JWT saved during login.
const accessToken = sessionStorage.getItem("access_token");
const userMessage = sessionStorage.getItem("user_message");

// ==========================================
// 1. Authentication guard
// ==========================================

function decodeJwtPayload(token) {
    try {
        const payload = token.split(".")[1];

        if (!payload) {
            return null;
        }

        // Convert Base64URL to Base64.
        let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

        while (base64.length % 4) {
            base64 += "=";
        }

        return JSON.parse(atob(base64));
    } catch (error) {
        console.error("Could not decode JWT:", error);
        return null;
    }
}

function isTokenValid(token) {
    if (!token) {
        return false;
    }

    const payload = decodeJwtPayload(token);

    if (!payload) {
        return false;
    }

    // A JWT with an expiration time must not be expired.
    if (payload.exp && Date.now() >= payload.exp * 1000) {
        return false;
    }

    return true;
}

if (!isTokenValid(accessToken)) {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user_message");

    window.location.replace("login.html");
}

// ==========================================
// 2. Protected API request helper
// ==========================================

async function apiRequest(endpoint, options = {}) {
    if (!isTokenValid(sessionStorage.getItem("access_token"))) {
        logout();
        throw new Error("Your session has expired. Please log in again.");
    }

    const token = sessionStorage.getItem("access_token");

    const headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`
    };

    // Set JSON content type only when sending a JSON body.
    // Do not set it for FormData; the browser adds its boundary.
    if (
        options.body &&
        !(options.body instanceof FormData) &&
        !headers["Content-Type"]
    ) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        logout();
        throw new Error("Session expired or token is invalid. Please log in again.");
    }

    if (response.status === 403) {
        throw new Error("You do not have permission to perform this action.");
    }

    const contentType = response.headers.get("content-type") || "";

    let data = null;

    if (contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        const errorMessage =
            typeof data === "object" && data !== null
                ? data.detail || data.message
                : data;

        throw new Error(errorMessage || `Request failed: ${response.status}`);
    }

    return data;
}

// Make the helper available for future dashboard modules.
// Example: SecureDocsAPI.request("/your-protected-endpoint")
window.SecureDocsAPI = {
    request: apiRequest
};

// ==========================================
// 3. Display user information
// ==========================================

function displayUserInformation() {
    const nameElement = document.getElementById("userName");
    const avatarElement = document.getElementById("userAvatar");
    const welcomeElement = document.getElementById("welcomeMessage");

    // Your current API returns a welcome message.
    // Example: "welcome user Deepakumar"
    let displayName = "User";

    if (userMessage) {
        const match = userMessage.match(/welcome user\s+(.+)/i);

        if (match) {
            displayName = match[1].trim();
        }
    }

    nameElement.textContent = displayName;
    avatarElement.textContent = displayName.charAt(0).toUpperCase();

    welcomeElement.textContent =
        `Hello ${displayName}, manage your documents securely from one place.`;
}

// ==========================================
// 4. Logout
// ==========================================

function logout() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user_message");

    window.location.replace("login.html");
}

document.getElementById("logoutButton").addEventListener("click", logout);

// ==========================================
// 5. Mobile sidebar
// ==========================================

const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");

menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

document.addEventListener("click", (event) => {
    const clickedInsideSidebar = sidebar.contains(event.target);
    const clickedMenuButton = menuButton.contains(event.target);

    if (!clickedInsideSidebar && !clickedMenuButton) {
        sidebar.classList.remove("open");
    }
});

// ==========================================
// 6. Notification
// ==========================================

document.getElementById("notificationButton").addEventListener("click", () => {
    showNotice("Notifications API is not connected yet.");
});

// ==========================================
// 7. Notice message
// ==========================================

const notice = document.getElementById("notice");

function showNotice(message) {
    notice.textContent = message;
    notice.classList.add("show");
}

// ==========================================
// 8. Upload document - UI only for now
// ==========================================

const fileInput = document.getElementById("fileInput");

function openFilePicker() {
    fileInput.click();
}

document.getElementById("uploadButton").addEventListener("click", openFilePicker);
document.getElementById("quickUpload").addEventListener("click", openFilePicker);

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    showNotice(
        `Selected "${file.name}". The document upload API has not been connected yet.`
    );

    // Later, after creating the backend upload endpoint:
    //
    // const formData = new FormData();
    // formData.append("file", file);
    //
    // const result = await apiRequest("/your-upload-endpoint", {
    //     method: "POST",
    //     body: formData
    // });
    //
    // Do not guess the endpoint. Use the actual route from your backend.
});

// ==========================================
// 9. Navigation placeholders
// ==========================================

document.querySelectorAll("[data-section]").forEach((element) => {
    element.addEventListener("click", (event) => {
        event.preventDefault();

        const section = element.dataset.section;

        showNotice(`${section} page will be connected when its API and page are ready.`);

        sidebar.classList.remove("open");
    });
});

// ==========================================
// 10. Search placeholder
// ==========================================

const searchInput = document.getElementById("globalSearch");

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const searchText = searchInput.value.trim();

        if (searchText) {
            showNotice(
                `Search for "${searchText}" will work after the document search API is connected.`
            );
        }
    }
});

// ==========================================
// 11. Initial dashboard setup
// ==========================================

displayUserInformation();

console.log("SecureDocs dashboard loaded.");
console.log("JWT authentication check completed.");
