const d = document;
const $table = d.querySelector(".crud-table");
const $form = d.querySelector(".crud-form");
const $title = d.querySelector(".crud-title");
const $template = d.getElementById("crud-template").content;
const $fragment = d.createDocumentFragment();

const getAll = async () => {
  try {
    let res = await axios.get("http://localhost:3000/task");
    let json = await res.data;

    json.forEach((el) => {
      const $clone = d.importNode($template, true);
      const $taskRow = $clone.querySelector("tr");

      $taskRow.dataset.id = el.id;
      $clone.querySelector(".name").textContent = el.nameData;
      $clone.querySelector(".description").textContent = el.descriptionData;
      $clone.querySelector(".task-done").checked = el.taskDone;
      $clone.querySelector(".edit").dataset.id = el.id;
      $clone.querySelector(".edit").dataset.nameData = el.nameData;
      $clone.querySelector(".edit").dataset.descriptionData =
        el.descriptionData;
      $clone.querySelector(".delete").dataset.id = el.id;

      $fragment.appendChild($clone);
    });

    $table.querySelector("tbody").appendChild($fragment);
  } catch (err) {
    let message = err.statusText || "Ocurrió un error";
    $table.insertAdjacentHTML(
      "afterend",
      `<p><b>Error ${err.status}: ${message}</b></p>`
    );
  }
};

d.addEventListener("DOMContentLoaded", () => {
  getAll();

  const $search = d.getElementById("search");

  $search.addEventListener("input", () => {
    const searchTerm = $search.value.toLowerCase();
    const $taskRows = $table.querySelectorAll("tr");

    $taskRows.forEach(($taskRow) => {
      const taskName = $taskRow
        .querySelector(".name")
        .textContent.toLowerCase();
      if (taskName.includes(searchTerm)) {
        $taskRow.style.display = "table-row";
      } else {
        $taskRow.style.display = "none";
      }
    });
  });
});

d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    e.preventDefault();

    if (!e.target.id.value) {
      
      try {
        let options = {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          data: JSON.stringify({
            nameData: e.target.nameData.value,
            descriptionData: e.target.descriptionData.value,
            taskDone: false,
          }),
        };
        let res = await axios("http://localhost:3000/task", options);
        let json = await res.data;

        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $form.insertAdjacentHTML(
          "afterend",
          `<p><b>Error ${err.status}: ${message}</b></p>`
        );
      }
    } else {

      try {
        let options = {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          data: JSON.stringify({
            nameData: e.target.nameData.value,
            descriptionData: e.target.descriptionData.value,
            taskDone: false,
          }),
        };
        let res = await axios(
          `http://localhost:3000/task/${e.target.id.value}`,
          options
        );
        let json = await res.data;

        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $form.insertAdjacentHTML(
          "afterend",
          `<p><b>Error ${err.status}: ${message}</b></p>`
        );
      }
    }
  }
});

d.addEventListener("click", async (e) => {
  if (e.target.matches(".edit")) {
    $title.textContent = "Editar Tarea";
    $form.nameData.value = e.target.dataset.nameData;
    $form.descriptionData.value = e.target.dataset.descriptionData;
    $form.id.value = e.target.dataset.id;
  }

  if (e.target.matches(".delete")) {
    let isDelete = confirm(
      `¿Estás seguro de que quieres eliminar la tarea ${e.target.dataset.id}?`
    );

    if (isDelete) {
      // Delete - DELETE

      try {
        let options = {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
        };
        let res = await axios(
          `http://localhost:3000/task/${e.target.dataset.id}`,
          options
        );
        let json = await res.data;

        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        alert(`Error ${err.status}: ${message}`);
      }
    }
  }

  if (e.target.matches(".task-done")) {
    const taskId = e.target.closest("tr").dataset.id;
    const isChecked = e.target.checked;

    try {
      let options = {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
        data: JSON.stringify({
          taskDone: isChecked,
        }),
      };
      let res = await axios(`http://localhost:3000/task/${taskId}`, options);
      let json = await res.data;

      let tableRow = $table.querySelector(`tr[data-id="${taskId}"]`);
      tableRow.querySelector(".task-done").checked = isChecked;
    } catch (err) {
      let message = err.statusText || "Ocurrió un error";
      alert(`Error ${err.status}: ${message}`);
    }
  } 
});
