// This is the address of our Django backend.
// Make sure the backend server is running before this page will work.
const API_URL = "http://127.0.0.1:8000/api/items/";

// Grab all the HTML elements we need to work with
const form = document.getElementById("item-form");
const itemIdField = document.getElementById("item-id");
const nameField = document.getElementById("item_name");
const descriptionField = document.getElementById("description");
const categoryField = document.getElementById("category");
const statusField = document.getElementById("status");
const locationField = document.getElementById("location");
const contactField = document.getElementById("contact_info");

const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formMessage = document.getElementById("form-message");

const itemListDiv = document.getElementById("item-list");
const listMessage = document.getElementById("list-message");
const searchBox = document.getElementById("search-box");
const statusFilter = document.getElementById("status-filter");

// Load the items as soon as the page opens
document.addEventListener("DOMContentLoaded", loadItems);

// ---------- READ: fetch and display items ----------
async function loadItems() {
  const search = searchBox.value.trim();
  const status = statusFilter.value;

  // Build the URL with optional search/status filters
  let url = API_URL + "?";
  if (search) url += "search=" + encodeURIComponent(search) + "&";
  if (status) url += "status=" + encodeURIComponent(status) + "&";

  try {
    const response = await fetch(url);
    const items = await response.json();
    renderItems(items);
  } catch (error) {
    listMessage.textContent = "Could not load items. Is the backend server running?";
    listMessage.className = "message error";
  }
}

function renderItems(items) {
  itemListDiv.innerHTML = "";

  if (items.length === 0) {
    listMessage.textContent = "No items found.";
    listMessage.className = "message";
    return;
  }
  listMessage.textContent = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "item-card status-" + item.status.toLowerCase();

    card.innerHTML = `
      <div class="item-info">
        <h3>${escapeHtml(item.item_name)}</h3>
        <p>
          <span class="item-tag">${escapeHtml(item.status)}</span>
          <span class="item-tag">${escapeHtml(item.category)}</span>
        </p>
        <p>${escapeHtml(item.description || "No description provided")}</p>
        <p><strong>Location:</strong> ${escapeHtml(item.location)}</p>
        <p><strong>Contact:</strong> ${escapeHtml(item.contact_info)}</p>
      </div>
      <div class="item-actions">
        <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
        <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
      </div>
    `;

    itemListDiv.appendChild(card);
  });
}

// A small helper to avoid showing raw HTML if someone types < or > in a field
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---------- CREATE / UPDATE: form submit ----------
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const itemData = {
    item_name: nameField.value,
    description: descriptionField.value,
    category: categoryField.value,
    status: statusField.value,
    location: locationField.value,
    contact_info: contactField.value,
  };

  const editingId = itemIdField.value;

  try {
    let response;
    if (editingId) {
      // UPDATE an existing item
      response = await fetch(API_URL + editingId + "/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
    } else {
      // CREATE a new item
      response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
    }

    if (response.ok) {
      formMessage.textContent = editingId ? "Item updated successfully." : "Item added successfully.";
      formMessage.className = "message success";
      resetForm();
      loadItems();
    } else {
      const errorData = await response.json();
      formMessage.textContent = "Error: " + JSON.stringify(errorData);
      formMessage.className = "message error";
    }
  } catch (error) {
    formMessage.textContent = "Could not reach the backend server.";
    formMessage.className = "message error";
  }
});

// ---------- UPDATE: load item data into the form ----------
async function editItem(id) {
  try {
    const response = await fetch(API_URL + id + "/");
    const item = await response.json();

    itemIdField.value = item.id;
    nameField.value = item.item_name;
    descriptionField.value = item.description;
    categoryField.value = item.category;
    statusField.value = item.status;
    locationField.value = item.location;
    contactField.value = item.contact_info;

    formTitle.textContent = "Edit Item";
    submitBtn.textContent = "Save Changes";
    cancelBtn.hidden = false;

    // Scroll up to the form so the user can see it
    form.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    formMessage.textContent = "Could not load this item.";
    formMessage.className = "message error";
  }
}

// ---------- DELETE ----------
async function deleteItem(id) {
  const confirmed = confirm("Are you sure you want to delete this item?");
  if (!confirmed) return;

  try {
    const response = await fetch(API_URL + id + "/", { method: "DELETE" });
    if (response.ok) {
      loadItems();
    } else {
      alert("Could not delete this item.");
    }
  } catch (error) {
    alert("Could not reach the backend server.");
  }
}

// ---------- Cancel edit mode ----------
cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  form.reset();
  itemIdField.value = "";
  formTitle.textContent = "Report an Item";
  submitBtn.textContent = "Add Report";
  cancelBtn.hidden = true;
}

// ---------- Search and filter ----------
let searchTimeout;
searchBox.addEventListener("input", function () {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(loadItems, 300); // wait a little after typing stops
});

statusFilter.addEventListener("change", loadItems);
