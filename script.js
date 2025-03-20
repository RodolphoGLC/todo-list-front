const getList = async () => {
  let url = "http://192.168.0.109:5000/tarefas";
  fetch(url, {
    method: "get",
  })
    .then((response) => response.json())
    .then((data) => {
      populateTable(data.tarefas.Tarefas);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

function populateTable(data) {
  const tableBody = document.querySelector("#task-table");

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
                  <button class="edit-btn" onclick='showModal(
                    "edit"
                  )'>Edit</button>
                </td>
            `;
    tableBody.appendChild(row);
  });
}

const postTask = async (inputName, inputDescription) => {
  const formData = new FormData();

  formData.append("nome", inputName);
  formData.append("descricao", inputDescription);
  formData.append("status", "Ready");

  let url = "http://192.168.0.109:5000/tarefa";

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.msg) {
        alert("Error: " + data.msg);
      } else {
        getList();
        countTaskStatus();
        closeModal();
      }
    })
    .catch((error) => {
      console.error("Error adding task:", error);
      alert("Error adding task: " + error.message);
    });
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
      if (data && data.msg) {
        alert("Error: " + data.msg);
      } else {
        getList();
        countTaskStatus();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

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

const addNewTask = () => {
  let inputName = document.getElementById("input-name").value;

  let inputDescription = document.getElementById("input-description").value;

  postTask(inputName, inputDescription);
};

const updateTask = () => {
  let inputId = document.getElementById("input-edit-id").value;
  let inputName = document.getElementById("input-edit-name").value;
  let inputDescription = document.getElementById("input-edit-description").value;
  let inputStatus = document.getElementById("input-edit-status").value;

  
}

document.addEventListener("DOMContentLoaded", function () {
  const createButton = document.getElementById("create-button");

  createButton.addEventListener("click", function (event) {
    event.preventDefault();
    addNewTask();
  });
});

function showModal(modalName) {
  const modal = document.getElementById(`task-${modalName}-modal`);
  if (modal) {
    modal.style.display = "block";
  } else {
    console.error("Modal not found!");
  }
}

function showEditModal(modalName, id, name, description, status) {
  const modal = document.getElementById(`task-${modalName}-modal`);

  if (modal) {
    modal.style.display = "block";
    document.getElementById(`input-edit-name`).value = name;
    document.getElementById(`input-edit-description`).value = description;
    document.getElementById(`input-edit-status`).value = status;
    document.getElementById(`input-edit-id`).value = id;
  } else {
    console.error("Modal not found!");
  }
}

function closeModal(modalName) {
  const modal = document.getElementById(`task-${modalName}-modal`);
  if (modal) {
    modal.style.display = "none";
  }
}

countTaskStatus();
getList();
