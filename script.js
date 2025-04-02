const getList = async () => {
  let url = "http://192.168.0.109:5000/tarefas";
  fetch(url, {
    method: "get",
  })
    .then((response) => response.json())
    .then((data) => {
      populateTable(data.list.tarefas);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

function populateTable(data) {
  const tableBody = document.querySelector("#task-table-body");

  tableBody.innerHTML = "";

  data.forEach((task) => {
    const row = document.createElement("tr");

    row.innerHTML = `
                <td>${task.nome}</td>
                <td>${task.descricao}</td>
                <td>${task.status}</td>
                <td>${"-"}</td>
                <td>
                  <button class="edit-btn" onclick="deleteTask(${
                    task.id
                  })">Delete</button>
                  <button class="edit-btn" onclick="showEditModal(
                    'edit', ${task.id}, '${task.nome}', '${task.descricao}', '${task.status}'
                    )">Edit</button>
                </td>
            `;
    tableBody.appendChild(row);
  });
}

const postTask = async (inputName, inputDescription) => {
  const formData = new FormData();

  const user = JSON.parse(localStorage.getItem('user'))

  console.log(user)

  formData.append("nome", inputName);
  formData.append("descricao", inputDescription);
  formData.append("status", "Ready");
  formData.append("emailUsuario", user.email)

  let url = "http://192.168.0.109:5000/tarefa";

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.message) {
        alert("Error: " + data.message);
      } else {
        getList();
        countTaskStatus();
      }
    })
    .finally(() => closeModal("register"))
};

const deleteTask = async (taskId) => {
  const formData = new FormData();

  formData.append("id", taskId);

  let url = `http://192.168.0.109:5000/tarefa?id=${taskId}`;

  fetch(url, {
    method: "delete",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.error) {
        alert("Error: " + data.error);
      } else {
        getList();
        countTaskStatus();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    })
};

const putTask = async (taskId, taskStatus) => {
  let url = "http://192.168.0.109:5000/tarefa";

  const formData = new FormData();

  formData.append("id", taskId);
  formData.append("status", taskStatus);

  fetch(url, {
    method: "put",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.message) {
        alert("Error: " + data.message);
      } else {
        getList();
        countTaskStatus();
        closeModal("edit");
      }
    })
};

const postUser = async (name, email, password) => {
  let url = "http://192.168.0.109:5000/usuario"

  const formData = new FormData();

  formData.append('nome', name);
  formData.append('email', email);
  formData.append('senha', password);

  fetch(url, {
    method: 'POST',
    body: formData
  })
  .then((response) => response.json())
  .then((data) => {
    if (data && data.message) {
      alert("Error:" + data.message)
    } else {
      alert("Create User")
    }
  })
  .finally(() => closeModal("user-register"))
}

const postUserLogin = async (email, password) => {
  let url = "http://192.168.0.109:5000/usuario/login"

  const formData = new FormData();

  formData.append('email', email);
  formData.append('senha', password);

  fetch(url, {
    method: 'POST',
    body: formData
  })
  .then((response) => response.json())
  .then((data) => {
    if (data && data.message) {
      alert("Error:" + data.message)
    } else {
      alert("User is Logged")
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  })
  .finally(() => closeModal("user-login"))
}

const countTaskStatus = async () => {
  let url = "http://192.168.0.109:5000/tarefas/status";
  fetch(url, {
    method: "get",
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("readyCount").innerText = data.Ready || 0;
      document.getElementById("doingCount").innerText = data.Doing || 0;
      document.getElementById("doneCount").innerText = data.Done || 0;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const addNewTask = (event) => {
  event.preventDefault();
  let inputName = document.getElementById("input-name").value;

  let inputDescription = document.getElementById("input-description").value;

  postTask(inputName, inputDescription);
};

const updateTask = (event) => {
  event.preventDefault();

  let inputId = document.getElementById("input-edit-id").value;
  let inputStatus = document.getElementById("input-edit-status").value;

  putTask(inputId, inputStatus);
};

const registerUser = (event) => {
  event.preventDefault();

  let inputName = document.getElementById("input-register-username").value;
  let inputEmail = document.getElementById("input-register-email").value;
  let inputPassword = document.getElementById("input-register-password").value;

  postUser(inputName, inputEmail, inputPassword);
}

const loginUser = (event) => {
  event.preventDefault(event);

  let inputEmail = document.getElementById("input-login-email").value;
  let inputPassword = document.getElementById("input-login-password").value;

  postUserLogin(inputEmail, inputPassword);
}

const logoutUser = () => {
  localStorage.setItem('user', undefined);
}

function showModal(modalName) {
  const modal = document.getElementById(`${modalName}-modal`);
  if (modal) {
    modal.style.display = "block";
  } else {
    console.error("Modal not found!");
  }
}

function showEditModal(modalName, id, name, description, status) {
  event.preventDefault();

  const modal = document.getElementById(`${modalName}-modal`);

  if (modal) {
    modal.style.display = "block";
    document.getElementById("input-edit-id").value = id;
    document.getElementById("input-edit-name").value = name;
    document.getElementById("input-edit-description").value = description;
    document.getElementById("input-edit-status").value = status;
  } else {
    console.error("Modal not found!");
  }
}

function closeModal(modalName) {
  const modal = document.getElementById(`${modalName}-modal`);
  if (modal) {
    modal.style.display = "none";
  }
}

getList();
countTaskStatus();