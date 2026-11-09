
// FastAPI backend URL
const API_BASE_URL = "http://localhost:8000";

// Get form elements
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const message = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");

// Show or hide password
if (togglePassword) {
    togglePassword.addEventListener("click", function () {
        const passwordInput = document.getElementById("password");

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "Hide";
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "Show";
        }
    });
}

// Display API messages
function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
}

// Handle API errors
function getErrorMessage(data) {
    if (typeof data.detail === "string") {
        return data.detail;
    }

    if (Array.isArray(data.detail)) {
        return data.detail.map(error => error.msg).join(", ");
    }

    return "Something went wrong. Please try again.";
}

// ---------------- LOGIN ----------------

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        const button = document.getElementById("loginButton");

        if (!username || !password) {
            showMessage("Please fill in all fields.", "error");
            return;
        }

        const formData = new URLSearchParams();

        formData.append("username_or_email", username);
        formData.append("password", password);

        button.disabled = true;
        button.textContent = "Signing in...";

        message.className = "message";

        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: formData.toString(),
                    credentials: "include"
                }
            );
const data = await response.json().catch(() => ({}));

if (!response.ok) {
    throw new Error(getErrorMessage(data));
}

// Verify that the API actually returned a JWT.
if (!data.access_token) {
    throw new Error("Login succeeded, but the access token is missing.");
}

// Save JWT and welcome message for this browser tab.
sessionStorage.setItem("access_token", data.access_token);
sessionStorage.setItem(
    "user_message",
    data.message || "Welcome to SecureDocs"
);

showMessage("Login successful! Redirecting...", "success");

setTimeout(() => {
    window.location.href = "dashboard.html";
}, 1000);

} catch (error) {
    showMessage(error.message || "Unable to connect to server.", "error");
} finally {

            button.disabled = false;
            button.textContent = "Sign in";

        }

    });

}

// ---------------- REGISTER ----------------

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const button = document.getElementById("registerButton");

        if (!username || !email || !password) {
            showMessage("Please fill in all fields.", "error");
            return;
        }

        if (password.length < 8) {
            showMessage("Password must contain at least 8 characters.", "error");
            return;
        }

        button.disabled = true;
        button.textContent = "Creating account...";

        message.className = "message";

        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/reg`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(getErrorMessage(data));
            }

            showMessage("Account created successfully! Please sign in.", "success");

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);

        } catch (error) {

            showMessage(error.message || "Unable to connect to server.", "error");

        } finally {

            button.disabled = false;
            button.textContent = "Create account";

        }

    });

}
