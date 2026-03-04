const newTask = document.getElementById("newTask");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");

let tasks = JSON.parse(localStorage.getItem("todo3_tasks")) || [];

function save() {
    localStorage.setItem("todo3_tasks", JSON.stringify(tasks));
}

function escapeHtml(str) {
    return str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function addTask() {
    const text = newTask.value.trim();
    if (!text) return;

    tasks.push({ text });
    newTask.value = "";
    save();
    render();
}

function removeTask(index) {
    tasks.splice(index, 1);
    save();
    render();
}

function startEdit(index) {
    const li = list.querySelector(`[data-index="${index}"]`);
    if (!li) return;

    // Бир эле учурда бир edit болсун
    list.querySelectorAll(".item.editing").forEach(el => el.classList.remove("editing"));

    li.classList.add("editing");

    const input = document.createElement("input");
    input.className = "edit-input";
    input.value = tasks[index].text;

    // тексттин алдына input коюу
    const textEl = li.querySelector(".task-text");
    li.insertBefore(input, textEl);

    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    const finish = (saveChanges) => {
        if (saveChanges) {
            const v = input.value.trim();
            if (v) tasks[index].text = v;
            save();
        }
        li.classList.remove("editing");
        input.remove();
        render();
    };

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") finish(true);
        if (e.key === "Escape") finish(false);
    });

    input.addEventListener("blur", () => finish(true));
}

function render() {
    list.innerHTML = "";

    tasks.forEach((t, index) => {
        const li = document.createElement("li");
        li.className = "item";
        li.dataset.index = index;

        li.innerHTML = `
      <div class="task-text">${escapeHtml(t.text)}</div>
      <div class="actions">
        <button class="icon-btn del" title="Delete" aria-label="Delete">
          ✕
        </button>
        <button class="icon-btn edit" title="Edit" aria-label="Edit">
          ✎
        </button>
      </div>
    `;

        li.querySelector(".del").addEventListener("click", () => removeTask(index));
        li.querySelector(".edit").addEventListener("click", () => startEdit(index));

        list.appendChild(li);
    });
}

addBtn.addEventListener("click", addTask);
newTask.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});

render();
