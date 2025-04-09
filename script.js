// ===========================
// Tasks - CRUD Operations
// ===========================

const getList = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("user-circle").textContent = user.name
    .slice(0, 2)
    .toUpperCase();

  const url = `http://localhost:5000/tasks?id=${user.id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      populateTable(data.tasks)
    })
    .catch((err) => console.error("Error:", err));
};

const postTask = async (inputName, inputDescription) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const formData = new FormData();

  formData.append("name", inputName);
  formData.append("description", inputDescription);
  formData.append("status", "Ready");
  formData.append("userEmail", user.email);

  const url = "http://localhost:5000/task";

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.message) {
        alert("Error: " + data.message);
      } else {
        getList();
        countTaskStatus();
      }
    })
    .finally(() => closeModal("register"));
};

const deleteTask = async (taskId) => {
  const url = `http://localhost:5000/task?id=${taskId}`;

  fetch(url, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.error) {
        alert("Error: " + data.error);
      } else {
        getList();
        countTaskStatus();
      }
    })
    .catch((err) => console.error("Error:", err));
};

const putTask = async (taskId, taskStatus) => {
  const formData = new FormData();
  formData.append("id", taskId);
  formData.append("status", taskStatus);

  const url = "http://localhost:5000/task";

  fetch(url, {
    method: "PUT",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.message) {
        alert("Error: " + data.message);
      } else {
        getList();
        countTaskStatus();
        closeModal("edit");
      }
    });
};

const countTaskStatus = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const url = `http://localhost:5000/tasks/status?id=${user.id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("readyCount").innerText = data.Ready || 0;
      document.getElementById("doingCount").innerText = data.Doing || 0;
      document.getElementById("doneCount").innerText = data.Done || 0;
    })
    .catch((err) => console.error("Error:", err));
};

// ===========================
// Tasks - Helper Functions
// ===========================

const truncate = (text, maxLength = 30) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day   = String(date.getDate()).padStart(2, '0');
  const year  = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const populateTable = (tasks) => {
  const tableBody = document.querySelector("#task-table-body");
  tableBody.innerHTML = "";

  tasks.forEach((task) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${truncate(task.name)}</td>
      <td>${truncate(task.description)}</td>
      <td>${task.status}</td>
      <td>${formatDate(task.creation_date)}</td>
      <td>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        <button class="edit-btn" onclick="showEditModal('edit', ${task.id}, '${task.name}', '${task.description}', '${task.status}')">Edit</button>
      </td>`;
    tableBody.appendChild(row);
  });
};

// ===========================
// Authentication - Register & Login
// ===========================

const postUser = async (name, email, password) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);

  const url = "http://localhost:5000/user";

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.message) {
        alert("Error: " + data.message);
      } else {
        alert("User Created");
      }
    })
    .finally(() => closeModal("user-register"));
};

const postUserLogin = async (email, password) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const url = "http://localhost:5000/user/login";

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.message) {
        alert("Error: " + data.message);
      } else {
        alert("User Logged In");
        localStorage.setItem("user", JSON.stringify(data.user));
        getList();
        countTaskStatus();
      }
    })
    .finally(() => closeModal("user-login"));
};

const logoutUser = () => {
  localStorage.removeItem("user");

  document.getElementById("readyCount").innerText = 0;
  document.getElementById("doingCount").innerText = 0;
  document.getElementById("doneCount").innerText = 0;
  document.querySelector("#task-table-body").innerHTML = "";
  document.getElementById("user-circle").textContent = "?";
};

// ===========================
// Form Input Handlers
// ===========================

const addNewTask = (event) => {
  event.preventDefault();
  const name = document.getElementById("input-name").value;
  const desc = document.getElementById("input-description").value;
  postTask(name, desc);
};

const updateTask = (event) => {
  event.preventDefault();
  const id = document.getElementById("input-edit-id").value;
  const status = document.getElementById("input-edit-status").value;
  putTask(id, status);
};

const registerUser = (event) => {
  event.preventDefault();
  const name = document.getElementById("input-register-username").value;
  const email = document.getElementById("input-register-email").value;
  const password = document.getElementById("input-register-password").value;
  postUser(name, email, password);
};

const loginUser = (event) => {
  event.preventDefault();
  const email = document.getElementById("input-login-email").value;
  const password = document.getElementById("input-login-password").value;
  postUserLogin(email, password);
};

// ===========================
// Modal Handlers
// ===========================

function showModal(modalName) {
  const modal = document.getElementById(`${modalName}-modal`);
  if (modal) modal.style.display = "block";
  else console.error("Modal not found!");
}

function closeModal(modalName) {
  const modal = document.getElementById(`${modalName}-modal`);
  if (modal) modal.style.display = "none";
}

function showEditModal(modalName, id, name, description, status) {
  event.preventDefault();
  const modal = document.getElementById(`${modalName}-modal`);
  if (!modal) return console.error("Modal not found!");

  modal.style.display = "block";
  document.getElementById("input-edit-id").value = id;
  document.getElementById("input-edit-name").value = name;
  document.getElementById("input-edit-description").value = description;
  document.getElementById("input-edit-status").value = status;
}

// ===========================
// Initialization
// ===========================
getList();
countTaskStatus();
