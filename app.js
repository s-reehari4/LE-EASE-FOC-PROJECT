//LOCAL STORAGE KEYS AND DEFAULT DATA
const STORAGE_KEYS = {
  users: "motorent_users",
  currentUser: "motorent_currentUser",
  selectedVehicle: "motorent_selectedVehicle",
  bookings: "motorent_bookings",
  vehicles: "motorent_vehicles",
};

// Default vehicles to DISPLAY ON WEBPAGE INITIAL LOAD (can be edited/removed by user later)
const DEFAULT_VEHICLES = [
  {
    id: 1,
    name: "Honda Activa 6G",
    type: "bike",
    fuel: "petrol",
    pricePerDay: 30,
    seats: 2,
    badge: "Popular",
    imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LR5TSzZ_Wsve1LjW6XyNwjDtKUsiP1_sKg&s",
    description: "Reliable scooter perfect for daily city rides"
  },
  {
    id: 2,
    name: "TVS Jupiter",
    type: "bike",
    fuel: "petrol",
    pricePerDay: 28,
    seats: 2,
    badge: "Comfort",
    imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZV2PLSxa66KSYj0LDBhsEyzKOHSNaDAgQg&s",
    description: "Comfortable and fuel-efficient scooter"
  },
  {
    id: 3,
    name: "Hero Splendor Plus",
    type: "bike",
    fuel: "petrol",
    pricePerDay: 25,
    seats: 2,
    badge: "Economy",
    imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxBE1k_L2SlNWYW297pc6130clZQhwykAHaA&s",
    description: "India’s most trusted commuter bike"
  },
  {
    id: 4,
    name: "Maruti Suzuki Alto 800",
    type: "car",
    fuel: "petrol",
    pricePerDay: 70,
    seats: 4,
    badge: "Budget",
    imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH8Y--W8xYb6V48YtSkiN7jSO_emqCJJfcGA&s",
    description: "Affordable and compact city car"
  },
  {
    id: 5,
    name: "Hyundai i10",
    type: "car",
    fuel: "petrol",
    pricePerDay: 85,
    seats: 5,
    badge: "City",
    imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwPOy6WbtosM1gI8IxbDmCLFMh0Fkv04MiaA&s",
    description: "Smooth and comfortable hatchback"
  },
  {
    id: 6,
    name: "Maruti Suzuki Swift",
    type: "car",
    fuel: "petrol",
    pricePerDay: 95,
    seats: 5,
    badge: "Popular",
    imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROASys5M2NjwDEm0dYWhwiAP0fHeYtXqCH6A&s",
    description: "Stylish hatchback with great mileage"
  }
];

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);

// ==============================
// INITIALIZATION FUNCTION
// ==============================
function initApp() {
  renderAuthBars();
  bindAuthModal();
  bindGlobalActions();
  renderVehiclesPage();
  renderBookingPage();
  renderDashboard();
  renderAddVehiclePage();
  renderCustomVehiclesList();
}

// ==============================
// LOCAL STORAGE HELPERS
// ==============================
// Load JSON data from localStorage
function loadJSON(key, fallback) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ==============================
// DATA GETTERS & SETTERS
// ==============================

function getVehicles() {
  return loadJSON(STORAGE_KEYS.vehicles, DEFAULT_VEHICLES);
}

function saveVehicles(list) {
  saveJSON(STORAGE_KEYS.vehicles, list);
}

function getUsers() {
  return loadJSON(STORAGE_KEYS.users, []);
}

function saveUsers(users) {
  saveJSON(STORAGE_KEYS.users, users);
}

function getBookings() {
  return loadJSON(STORAGE_KEYS.bookings, []);
}

function saveBookings(bookings) {
  saveJSON(STORAGE_KEYS.bookings, bookings);
}

function getCurrentUser() {
  return loadJSON(STORAGE_KEYS.currentUser, null);
}

function setCurrentUser(user) {
  saveJSON(STORAGE_KEYS.currentUser, user);
}

function getSelectedVehicle() {
  return loadJSON(STORAGE_KEYS.selectedVehicle, null);
}

function setSelectedVehicle(vehicle) {
  saveJSON(STORAGE_KEYS.selectedVehicle, vehicle);
}

// ==============================
// UTILITY FUNCTIONS
// ==============================

// Show temporary toast message

function toast(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Capitalize first letter
function capitalize(text) {
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

/* AUTH / NAVBAR */
/* ==============================
   AUTH / NAVBAR SECTION
   ============================== */

// Render login/signup buttons or user greeting
function renderAuthBars() {
  const user = getCurrentUser();
  document.querySelectorAll(".auth").forEach((auth) => {
    if (!auth) return;
    if (user) {
      auth.innerHTML = `<span class="welcome">Hi, ${escapeHtml(user.name)}</span>
        <button class="btn secondary js-logout">Logout</button>`;
    } else {
      auth.innerHTML = `<button class="btn secondary js-open-auth" data-mode="login">Login</button>
        <button class="btn primary js-open-auth" data-mode="signup">Sign Up</button>`;
    }
  });
}

// Bind authentication modal events (login/signup switching)
function bindAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const closeBtn = document.getElementById("close-modal");
  const switchToSignup = document.getElementById("show-signup-link");
  const switchToLogin = document.getElementById("show-login-link");

  closeBtn?.addEventListener("click", closeAuthModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeAuthModal();
  });

  loginForm?.addEventListener("submit", handleLogin);
  signupForm?.addEventListener("submit", handleSignup);

  switchToSignup?.addEventListener("click", (event) => {
    event.preventDefault();
    openAuthModal("signup");
  });

  switchToLogin?.addEventListener("click", (event) => {
    event.preventDefault();
    openAuthModal("login");
  });
}

function openAuthModal(mode = "login") {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  loginForm?.classList.toggle("hidden", mode === "signup");
  signupForm?.classList.toggle("hidden", mode !== "signup");

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email")?.value.trim().toLowerCase();
  if (!email) return toast("Enter your email.");

  const user = getUsers().find((item) => item.email === email);
  if (!user) return toast("No account found. Please sign up first.");

  setCurrentUser(user);
  closeAuthModal();
  renderAuthBars();
  refreshAuthenticatedViews();
  toast(`Welcome back, ${user.name}!`);
}

function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById("signup-name")?.value.trim();
  const email = document.getElementById("signup-email")?.value.trim().toLowerCase();

  if (!name || !email) return toast("Please fill in both name and email.");

  const users = getUsers();
  if (users.some((item) => item.email === email)) return toast("That email already exists. Please log in.");

  const user = { name, email };
  users.push(user);
  saveUsers(users);
  setCurrentUser(user);
  closeAuthModal();
  renderAuthBars();
  refreshAuthenticatedViews();
  toast(`Account created. Welcome, ${name}!`);
}

function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
  renderAuthBars();
  refreshAuthenticatedViews();
  toast("Logged out.");
}

function refreshAuthenticatedViews() {
  renderBookingPage();
  renderDashboard();
  renderAddVehiclePage();
  renderCustomVehiclesList();
}

/* GLOBAL ACTIONS */
function bindGlobalActions() {
  document.addEventListener("click", (event) => {
    const openAuthBtn = event.target.closest(".js-open-auth");
    if (openAuthBtn) {
      event.preventDefault();
      openAuthModal(openAuthBtn.dataset.mode || "login");
      return;
    }

    const logoutBtn = event.target.closest(".js-logout");
    if (logoutBtn) {
      event.preventDefault();
      logoutUser();
      return;
    }

    const scrollBtn = event.target.closest(".js-scroll-features");
    if (scrollBtn) {
      event.preventDefault();
      document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const bookBtn = event.target.closest(".js-book-now");
    if (bookBtn) {
      event.preventDefault();
      const id = Number(bookBtn.dataset.id);
      const vehicle = getVehicles().find((item) => item.id === id);
      if (!vehicle) return;
      setSelectedVehicle(vehicle);
      window.location.href = "booking.html";
      return;
    }

    const deleteBtn = event.target.closest(".js-delete-vehicle");
    if (deleteBtn) {
      event.preventDefault();
      const id = Number(deleteBtn.dataset.id);
      const vehicles = getVehicles().filter(v => v.id !== id);
      saveVehicles(vehicles);
      toast("Vehicle deleted");
      renderVehiclesPage();
      renderCustomVehiclesList();
      return;
    }

    const confirmBtn = event.target.closest(".js-confirm-booking");
    if (confirmBtn) {
      event.preventDefault();
      confirmBooking();
      return;
    }

    const cancelBtn = event.target.closest(".js-cancel-booking");
    if (cancelBtn) {
      event.preventDefault();
      cancelBooking(cancelBtn.dataset.id);
      return;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAuthModal();
  });
}

/* VEHICLES PAGE */
function renderVehiclesPage() {
  const container = document.getElementById("vehicles-container");
  if (!container) return;

  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const fuelFilter = document.getElementById("fuelFilter");
  const applyBtn = document.getElementById("applyFiltersBtn");

  const renderList = () => {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const type = typeFilter?.value || "all";
    const fuel = fuelFilter?.value || "all";

    const filtered = getVehicles().filter((vehicle) => {
      const matchesQuery =
        vehicle.name.toLowerCase().includes(query) ||
        vehicle.description.toLowerCase().includes(query);
      const matchesType = type === "all" || vehicle.type === type;
      const matchesFuel = fuel === "all" || vehicle.fuel === fuel;
      return matchesQuery && matchesType && matchesFuel;
    });

    if (!filtered.length) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3>No vehicles match your filters</h3>
          <p>Try changing your search, type, or fuel preference.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered
      .map(
        (vehicle) => `
          <article class="vehicle-card">
            <div class="vehicle-media">
              <img src="${vehicle.imageURL}" alt="${escapeHtml(vehicle.name)}" />
              <span class="badge">${escapeHtml(vehicle.badge)}</span>
            </div>
            <div class="vehicle-body">
              <div class="vehicle-top">
                <div>
                  <h3>${escapeHtml(vehicle.name)}</h3>
                  <p class="sub">${escapeHtml(vehicle.description)}</p>
                </div>
                <div class="price">$${vehicle.pricePerDay}<small>/day</small></div>
              </div>
              <div class="tags">
                <span>${capitalize(vehicle.type)}</span>
                <span>${capitalize(vehicle.fuel)}</span>
                <span>${vehicle.seats} Seats</span>
              </div>
              <div class="vehicle-actions">
                <button type="button" class="btn primary full js-book-now" data-id="${vehicle.id}">
                  Book Now
                </button>
              </div>
            </div>
          </article>
        `
      )
      .join("");

    renderCustomVehiclesList();
  };

  searchInput?.addEventListener("input", renderList);
  typeFilter?.addEventListener("change", renderList);
  fuelFilter?.addEventListener("change", renderList);
  applyBtn?.addEventListener("click", renderList);
  renderList();
}

/* BOOKING PAGE */
function renderBookingPage() {
  const details = document.getElementById("booking-details");
  const form = document.getElementById("booking-form");
  if (!details || !form) return;

  const vehicle = getSelectedVehicle();

  if (!vehicle) {
    details.innerHTML = `
      <div class="empty-state">
        <h3>No vehicle selected</h3>
        <p>Go back to the fleet and choose a vehicle first.</p>
        <a href="vehicles.html" class="btn primary">Browse Vehicles</a>
      </div>
    `;
    form.innerHTML = "";
    return;
  }

  details.innerHTML = `
    <img src="${vehicle.imageURL}" alt="${escapeHtml(vehicle.name)}" />
    <h2>${escapeHtml(vehicle.name)}</h2>
    <p>${escapeHtml(vehicle.description)}</p>
    <p><strong>Type:</strong> ${capitalize(vehicle.type)}</p>
    <p><strong>Fuel:</strong> ${capitalize(vehicle.fuel)}</p>
    <p><strong>Seats:</strong> ${vehicle.seats}</p>
    <p class="price">$${vehicle.pricePerDay}/day</p>
  `;

  const user = getCurrentUser();
  if (!user) {
    form.innerHTML = `
      <div class="empty-state">
        <h3>Login required</h3>
        <p>Please log in to confirm this booking.</p>
        <button type="button" class="btn primary js-open-auth" data-mode="login">Login to Book</button>
      </div>
    `;
    return;
  }

  form.innerHTML = `
    <h3>Booking Summary</h3>
    <label for="start-date">Start Date</label>
    <input type="date" id="start-date" required />
    <label for="end-date">End Date</label>
    <input type="date" id="end-date" required />
    <div class="booking-summary">
      <p><strong>Daily rate:</strong> $${vehicle.pricePerDay}</p>
      <p><strong>Total:</strong> $<span id="total-price">0</span></p>
    </div>
    <button type="button" class="btn primary full js-confirm-booking">Confirm Booking</button>
  `;

  const startEl = document.getElementById("start-date");
  const endEl = document.getElementById("end-date");
  const totalPrice = document.getElementById("total-price");

  function updateTotal() {
    if (!startEl.value || !endEl.value) {
      totalPrice.textContent = "0";
      return;
    }

    const sd = new Date(startEl.value);
    const ed = new Date(endEl.value);

    if (ed < sd) {
      totalPrice.textContent = "0";
      return;
    }

    const diff = Math.floor((ed - sd) / (1000 * 60 * 60 * 24)) + 1;
    totalPrice.textContent = String(diff * vehicle.pricePerDay);
  }

  startEl.addEventListener("change", updateTotal);
  endEl.addEventListener("change", updateTotal);
}

function confirmBooking() {
  const user = getCurrentUser();
  const vehicle = getSelectedVehicle();
  if (!user || !vehicle) {
    toast("Please log in and select a vehicle first.");
    return;
  }

  const startDate = document.getElementById("start-date")?.value;
  const endDate = document.getElementById("end-date")?.value;

  if (!startDate || !endDate) {
    toast("Please select both start and end dates.");
    return;
  }

  const sd = new Date(startDate);
  const ed = new Date(endDate);

  if (ed < sd) {
    toast("End date must be after start date.");
    return;
  }

  const days = Math.floor((ed - sd) / (1000 * 60 * 60 * 24)) + 1;
  const total = days * vehicle.pricePerDay;

  const booking = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userEmail: user.email,
    userName: user.name,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    vehicleType: vehicle.type,
    fuel: vehicle.fuel,
    imageURL: vehicle.imageURL,
    startDate,
    endDate,
    days,
    pricePerDay: vehicle.pricePerDay,
    total,
    createdAt: new Date().toLocaleString(),
    invoiceGenerated: false,
    invoiceDate: ""
  };

  const bookings = getBookings();
  bookings.unshift(booking);
  saveBookings(bookings);

  toast("Booking confirmed!");
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 700);
}

/* DASHBOARD */
function renderDashboard() {
  const list = document.getElementById("bookings-list");
  if (!list) return;

  const user = getCurrentUser();
  if (!user) {
    list.innerHTML = `
      <div class="empty-state">
        <h3>Please log in</h3>
        <p>Your bookings will appear here after you sign in.</p>
        <button type="button" class="btn primary js-open-auth" data-mode="login">Login</button>
      </div>
    `;
    return;
  }

  const allBookings = getBookings();
  const today = new Date().toISOString().split("T")[0];

  let changed = false;
  const bookings = allBookings.map((bk) => {
    if (bk.userEmail === user.email && !bk.invoiceGenerated && bk.endDate && today > bk.endDate) {
      changed = true;
      return {
        ...bk,
        invoiceGenerated: true,
        invoiceDate: today
      };
    }
    return bk;
  });

  if (changed) saveBookings(bookings);

  const userBookings = bookings.filter((booking) => booking.userEmail === user.email);

  if (!userBookings.length) {
    list.innerHTML = `
      <div class="empty-state">
        <h3>No bookings yet</h3>
        <p>Start by selecting a vehicle from the fleet.</p>
        <a href="vehicles.html" class="btn primary">Browse Vehicles</a>
      </div>
    `;
    return;
  }

  const totalSpent = userBookings.reduce((sum, booking) => sum + booking.total, 0);

  list.innerHTML = `
    <div class="stats" style="margin-bottom: 1rem;">
      <div><strong>${userBookings.length}</strong><span>Bookings</span></div>
      <div><strong>$${totalSpent}</strong><span>Total Spent</span></div>
    </div>
  `;

  userBookings.forEach((booking) => {
    list.insertAdjacentHTML("beforeend", `
      <article class="booking-card">
        <div class="booking-card-top">
          <div>
            <h3>${escapeHtml(booking.vehicleName)}</h3>
            <p class="sub">${capitalize(booking.vehicleType)} · ${capitalize(booking.fuel)}</p>
          </div>
          <div class="price">$${booking.total}</div>
        </div>
        <p><strong>Start Date:</strong> ${booking.startDate}</p>
        <p><strong>End Date:</strong> ${booking.endDate}</p>
        <p><strong>Days:</strong> ${booking.days}</p>
        <p><strong>Daily rate:</strong> $${booking.pricePerDay}</p>
        <p><strong>Booked on:</strong> ${escapeHtml(booking.createdAt)}</p>
        ${booking.invoiceGenerated ? `<p><strong>Invoice date:</strong> ${booking.invoiceDate}</p>` : `<p><strong>Invoice:</strong> Pending</p>`}
        <div class="booking-actions">
          <button type="button" class="btn secondary js-cancel-booking" data-id="${booking.id}">
            Cancel booking
          </button>
        </div>
      </article>
    `);
  });
}

function cancelBooking(id) {
  const user = getCurrentUser();
  if (!user) return;

  const bookings = getBookings().filter((b) => !(b.id === id && b.userEmail === user.email));
  saveBookings(bookings);
  renderDashboard();
  toast("Booking cancelled.");
}

/* ADD VEHICLE */
function renderAddVehiclePage() {
  const form = document.getElementById("add-vehicle-form");
  const preview = document.getElementById("vehicle-preview");
  if (!form) return;

  form.addEventListener("input", () => {
    if (!preview) return;

    const name = document.getElementById("v-name").value || "Vehicle Name";
    const price = document.getElementById("v-price").value || "0";
    const image = document.getElementById("v-image").value || "";
    const desc = document.getElementById("v-desc").value || "Description";

    preview.innerHTML = `
      <div class="card">
        <img src="${image || "https://via.placeholder.com/300x200"}" alt="Preview">
        <h3>${name}</h3>
        <p>${desc}</p>
        <p>$${price}/day</p>
      </div>
    `;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("v-name").value.trim();
    const type = document.getElementById("v-type").value;
    const fuel = document.getElementById("v-fuel").value;
    const price = Number(document.getElementById("v-price").value);
    const seats = Number(document.getElementById("v-seats").value);
    const badge = document.getElementById("v-badge").value.trim() || "New";
    const image = document.getElementById("v-image").value.trim();
    const desc = document.getElementById("v-desc").value.trim();

    if (!name || !image || !price || !seats) {
      toast("Fill all required fields!");
      return;
    }

    if (price <= 0 || seats <= 0) {
      toast("Invalid price or seats!");
      return;
    }

    const vehicles = getVehicles();
    vehicles.push({
      id: Date.now(),
      name,
      type,
      fuel,
      pricePerDay: price,
      seats,
      badge,
      imageURL: image,
      description: desc || "No description",
    });

    saveVehicles(vehicles);
    toast("Vehicle added successfully!");
    form.reset();
    if (preview) preview.innerHTML = "";

    renderVehiclesPage();
    renderCustomVehiclesList();
  });
}

function renderCustomVehiclesList() {
  const listDiv = document.getElementById("custom-vehicles-list");
  if (!listDiv) return;

  const allVehicles = getVehicles();
  const defaultIDs = DEFAULT_VEHICLES.map(v => v.id);
  const custom = allVehicles.filter(v => !defaultIDs.includes(v.id));

  if (!custom.length) {
    listDiv.innerHTML = "<p>No custom vehicles added yet.</p>";
    return;
  }

  listDiv.innerHTML = custom.map(v => `
    <div class="card" style="margin: 0.5rem;">
      <img src="${v.imageURL}" alt="${escapeHtml(v.name)}" style="height: 120px; width: auto;">
      <h4>${escapeHtml(v.name)}</h4>
      <p>$${v.pricePerDay}/day</p>
      <button class="btn secondary js-delete-vehicle" data-id="${v.id}">
        Delete
      </button>
    </div>
  `).join("");
}

window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEYS.vehicles) {
    renderVehiclesPage();
    renderCustomVehiclesList();
  }
});