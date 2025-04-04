// ===========================
// Initialization
// ===========================
getList();
countTaskStatus();

// ===========================
// Tasks - CRUD Operations
// ===========================

const getList = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  document.getElementById('user-circle').textContent = user.nome.slice(0, 2).toUpperCase();

  const url = `http://192.168.0.109:5000/tarefas?id=${user.id}`;
  fetch(url)
    .then(res => res.json())
    .then(data => populateTable(data.list.tarefas))
    .catch(err => console.error("Error:", err));
};

const postTask = async (inputName, inputDescription) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const formData = new FormData();

  formData.append("nome", inputName);
  formData.append("descricao", inputDescription);
  formData.append("status", "Ready");
  formData.append("emailUsuario", user.email);

  const url = "http://192.168.0.109:5000/tarefa";

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
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
  const url = `http://192.168.0.109:5000/tarefa?id=${taskId}`;

  fetch(url, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(data => {
      if (data?.error) {
        alert("Error: " + data.error);
      } else {
        getList();
        countTaskStatus();
      }
    })
    .catch(err => console.error("Error:", err));
};

const putTask = async (taskId, taskStatus) => {
  const formData = new FormData();
  formData.append("id", taskId);
  formData.append("status", taskStatus);

  const url = "http://192.168.0.109:5000/tarefa";

  fetch(url, {
    method: "PUT",
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      if (data?.message) {
        alert("Error: " + data.message);
      } else {
        getList();
        countTaskStatus();
        closeModal("edit");
      }
    });
};

// ===========================
// Tasks - Helper Functions
// ===========================

const populateTable = (tasks) => {
  const tableBody = document.querySelector("#task-table-body");
  tableBody.innerHTML = "";

  tasks.forEach(task => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.nome}</td>
      <td>${task.descricao}</td>
      <td>${task.status}</td>
      <td>-</td>
      <td>
        <button class="edit-btn" onclick="deleteTask(${task.id})">Delete</button>
        <button class="edit-btn" onclick="showEditModal('edit', ${task.id}, '${task.nome}', '${task.descricao}', '${task.status}')">Edit</button>
      </td>`;
    tableBody.appendChild(row);
  });
};

const countTaskStatus = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const url = `http://192.168.0.109:5000/tarefas/status?id=${user.id}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      document.getElementById("readyCount").innerText = data.Ready || 0;
      document.getElementById("doingCount").innerText = data.Doing || 0;
      document.getElementById("doneCount").innerText = data.Done || 0;
    })
    .catch(err => console.error("Error:", err));
};

// ===========================
// Authentication - Register & Login
// ===========================

const postUser = async (name, email, password) => {
  const formData = new FormData();
  formData.append("nome", name);
  formData.append("email", email);
  formData.append("senha", password);

  const url = "http://192.168.0.109:5000/usuario";

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
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
  formData.append("senha", password);

  const url = "http://192.168.0.109:5000/usuario/login";

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
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
  document.getElementById('user-circle').textContent = "?";
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
