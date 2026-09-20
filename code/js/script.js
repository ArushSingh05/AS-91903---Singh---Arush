// ======================================
// MOBILE NAVIGATION
// ======================================

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

const navAnchors = document.querySelectorAll(".nav-links a");
navAnchors.forEach((link) => {
    link.addEventListener("click", () => {
        if (navLinks) navLinks.classList.remove("active");
    });
});

// ======================================
// STICKY NAVBAR
// ======================================

const header = document.querySelector("header");
window.addEventListener("scroll", () => {
    if (!header) return;

    if (window.scrollY > 80) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// ======================================
// FAQ
// ======================================

const faqQuestions = document.querySelectorAll(".faq-question");
faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
        const answer = question.nextElementSibling;
        if (!answer) return;

        const isVisible = answer.style.display === "block";
        answer.style.display = isVisible ? "none" : "block";
    });
});

// ======================================
// AUTH / USER SESSION HELPERS
// ======================================

function getUserSession() {
    try {
        return JSON.parse(localStorage.getItem("gabruUser") || "null");
    } catch {
        return null;
    }
}

function setUserSession(user) {
    try { localStorage.setItem("gabruUser", JSON.stringify(user)); } catch {}
}

function clearUserSession() {
    try { localStorage.removeItem("gabruUser"); } catch {}
}

function localGetAccounts() {
    try {
        return JSON.parse(localStorage.getItem("gabruAccounts") || "[]");
    } catch {
        return [];
    }
}

function localSaveAccounts(accounts) {
    try {
        localStorage.setItem("gabruAccounts", JSON.stringify(accounts));
    } catch {}
}

function ensureDefaultAdminAccount() {
    const accounts = localGetAccounts();
    const adminEmail = "arushsingh6795@gmail.com";
    const adminPassword = "Arush123";
    const existingAdmin = accounts.find((account) => (account.email || "").toLowerCase() === adminEmail.toLowerCase());

    if (existingAdmin) {
        if (!existingAdmin.role) existingAdmin.role = "admin";
        if (!existingAdmin.password) existingAdmin.password = adminPassword;
        if (!existingAdmin.name) existingAdmin.name = "Arush Singh";
        localSaveAccounts(accounts);
        return existingAdmin;
    }

    accounts.push({
        id: "admin-arush-singh",
        name: "Arush Singh",
        email: adminEmail,
        password: adminPassword,
        role: "admin"
    });

    localSaveAccounts(accounts);
    return accounts[accounts.length - 1];
}

function localRegisterAccount(name, email, password, phone = "") {
    const accounts = localGetAccounts();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (accounts.find((account) => String(account.email || "").trim().toLowerCase() === normalizedEmail)) {
        return { success: false, message: "Email already registered. Please log in instead." };
    }

    const user = {
        id: Date.now(),
        name: name || email.split("@")[0],
        email: normalizedEmail,
        phone: String(phone || "").trim(),
        role: "customer",
        password
    };

    accounts.push(user);
    localSaveAccounts(accounts);

    const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
    };

    setUserSession(sessionUser);
    return { success: true, user: sessionUser };
}

function localLoginAccount(email, password) {
    const accounts = localGetAccounts();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const account = accounts.find((item) => String(item.email || "").trim().toLowerCase() === normalizedEmail);

    if (!account) {
        return { success: false, message: "No account with that email." };
    }

    if (account.password !== password) {
        return { success: false, message: "Invalid password." };
    }

    const sessionUser = {
        id: account.id,
        name: account.name,
        email: account.email,
        phone: account.phone || "",
        role: account.role
    };

    setUserSession(sessionUser);
    return { success: true, user: sessionUser };
}

// Ensure default admin exists as soon as the script runs.
ensureDefaultAdminAccount();

// ======================================
// BOOKING SUMMARY LIVE UPDATE
// ======================================

const servicePriceMap = {
    "Classic Cut": 35,
    "Skin Fade": 45,
    "Taper Fade": 40,
    "Kids Cut": 25,
    "Kids Fade": 30,
    "Teen Style Cut": 35,
    "Beard Trim": 20,
    "Hot Towel Shave": 40,
    "Beard Line-Up": 18,
    "Full Colour": 90,
    "Highlights": 120,
    "Grey Blending": 65,
    "The Gabru Experience": 70,
    "VIP Grooming": 95
};

function getSelectedTime24Hour() {
    const hourSelect = document.getElementById("timeHour");
    const minuteSelect = document.getElementById("timeMinute");
    const periodSelect = document.getElementById("timePeriod");
    const hiddenTimeInput = document.getElementById("time");

    if (!hourSelect || !minuteSelect || !periodSelect || !hiddenTimeInput) return "";

    const hour = hourSelect.value;
    const minute = minuteSelect.value;
    const period = periodSelect.value;

    if (!hour || !minute || !period) {
        hiddenTimeInput.value = "";
        return "";
    }

    let hour24 = Number(hour);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;

    const formatted = `${String(hour24).padStart(2, "0")}:${minute}`;
    hiddenTimeInput.value = formatted;
    return formatted;
}

function formatTime12Hour(value) {
    if (!value) return "--";

    const [hoursValue, minutesValue] = value.split(":");
    let hours = Number(hoursValue);
    const minutes = Number(minutesValue || 0);
    const suffix = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${hours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function updateBookingSummary() {
    const service = document.getElementById("service");
    const barber = document.getElementById("barber");
    const date = document.getElementById("date");
    const summaryService = document.getElementById("summary-service");
    const summaryPrice = document.getElementById("summary-price");
    const summaryBarber = document.getElementById("summary-barber");
    const summaryDate = document.getElementById("summary-date");
    const summaryTime = document.getElementById("summary-time");

    if (!service || !barber || !date || !summaryService || !summaryPrice || !summaryBarber || !summaryDate || !summaryTime) {
        return;
    }

    const selectedService = service.value || "";
    const selectedPrice = selectedService && servicePriceMap[selectedService] !== undefined ? `$${servicePriceMap[selectedService]}` : "--";
    const timeValue = getSelectedTime24Hour();

    summaryService.textContent = selectedService || "Not Selected";
    summaryPrice.textContent = selectedPrice;
    summaryBarber.textContent = barber.value || "No Preference";
    summaryDate.textContent = date.value || "--";
    summaryTime.textContent = timeValue ? formatTime12Hour(timeValue) : "--";
}

const bookingFields = [
    document.getElementById("service"),
    document.getElementById("barber"),
    document.getElementById("date"),
    document.getElementById("timeHour"),
    document.getElementById("timeMinute"),
    document.getElementById("timePeriod")
].filter(Boolean);

bookingFields.forEach((field) => {
    field.addEventListener("input", updateBookingSummary);
    field.addEventListener("change", updateBookingSummary);
});

// ======================================
// LOGIN / REGISTER FORMS
// ======================================

function bindLoginPage() {
    const form = document.getElementById("loginPageForm");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.getElementById("login_email")?.value.trim();
        const pass = document.getElementById("login_pass")?.value || "";

        if (!email || !pass) {
            alert("Please enter both email and password.");
            return;
        }

        const result = localLoginAccount(email, pass);
        if (result.success) {
            window.location.href = "index.html";
            return;
        }

        alert(result.message || "Login failed.");
    });
}

function bindRegisterPage() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value || "";
        const passwordConfirm = document.getElementById("password_confirm")?.value || "";

        if (!name || !email || !password || !passwordConfirm) {
            alert("Please complete all fields.");
            return;
        }

        if (password !== passwordConfirm) {
            alert("Passwords do not match.");
            return;
        }

        const result = localRegisterAccount(name, email, password);
        if (result.success) {
            window.location.href = "index.html";
            return;
        }

        alert(result.message || "Unable to create account");
        if ((result.message || "").toLowerCase().includes("already registered")) {
            window.location.href = "login.html";
        }
    });
}

function setupPageScripts() {
    bindLoginPage();
    bindRegisterPage();
    updateBookingSummary();
}

document.addEventListener("DOMContentLoaded", () => {
    setupPageScripts();
    const dateInput = document.getElementById("date");
    if (dateInput) {
        dateInput.min = new Date().toISOString().split("T")[0];
    }
});

// ======================================
// LEGACY / OPTIONAL COMPONENTS
// ======================================

const authModal = document.getElementById("authModal");
const profilePanel = document.getElementById("profilePanel");

function renderAuthNav() {
    const navs = document.querySelectorAll(".nav-links");
    navs.forEach((nav) => {
        const authItem = nav.querySelector(".nav-auth-item");
        if (!authItem) return;

        const user = getUserSession();
        if (user) {
            authItem.innerHTML = `<a href="profile.html" class="nav-profile-link">Profile</a>`;
        } else {
            authItem.innerHTML = '<a href="login.html" class="nav-profile-link">Login</a>';
        }
    });
}

function renderProfilePanel() {
    if (!profilePanel) return;

    const user = getUserSession();
    if (!user) {
        profilePanel.classList.remove("open");
        return;
    }

    const nameNode = document.getElementById("profileName");
    const emailNode = document.getElementById("profileEmail");
    if (nameNode) nameNode.textContent = user.name || "Customer";
    if (emailNode) emailNode.textContent = user.email || "user@example.com";
}

if (document.readyState !== "loading") {
    renderAuthNav();
    renderProfilePanel();
} else {
    document.addEventListener("DOMContentLoaded", () => {
        renderAuthNav();
        renderProfilePanel();
    });
}

// ======================================
// END
// ======================================
