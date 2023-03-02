/******************definir variable***************
 * ***********************************************/
const tasks = [];
// llevar la cuenta regresiva
let time = 0;
// asignado una funcion para ejecutar un pedazo de codigo cada determinado tiempo
let timer = null;
// 5 minutos de descanzo
let timerBreak = null;
// cual es la tarea actual que se esta ejecutando
let current = null;

/******************referencia de elementos***************
 * ***********************************************/
const bAdd = document.querySelector("#bAdd");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");
const taskName = document.querySelector("#time #taskName");

renderTime();
renderTasks();

/******************Eventos*************************
 * ***********************************************/
// ejecutar una funcion cuando se dispare el metodo de submit
form.addEventListener("submit", (e) => {
  // enviemos formulario, en realidad no se envie
  e.preventDefault();
  if (itTask.value !== "") {
    createTask(itTask.value);
    itTask.value = "";
    renderTasks();
  }
});

function createTask(value) {
  const newTask = {
    // id dinamico:  produce una cadena de texto de 3 caracteres que contiene una combinación aleatoria de números y letras en minúscula
    id: (Math.random() * 100).toString(36).slice(3),
    title: value,
    completed: false,
  };
  //   agregar al arreglo
  tasks.unshift(newTask);
}

function renderTasks() {
  // iterar para cada elemento del arreflo
  const html = tasks.map((task) => {
    return `

            <div class="task">
                <div class="completed">${
                  task.completed
                    ? `<span class="done">Done</span>`
                    : `<button class="start-button" data-id="${task.id}">Start</button>`
                }</div>
           <div class="title">${task.title}</div>
        `;
  });
  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = html.join("");

  const startButtons = document.querySelectorAll(".task .start-button");

  startButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (!timer) {
        const id = button.getAttribute("data-id");
        startButtonHandler(id);
        button.textContent = "En progreso...";
      }
    });
  });
}

function startButtonHandler(id) {
  time = 5;
  // alamacena la actividad actual
  current = id;
  const taskIndex = tasks.findIndex((task) => task.id === id);

  taskName.textContent = tasks[taskIndex].title;
  renderTime();
  //   1 hasta que llegue a 0

  timer = setInterval(() => {
    timeHandler(id);
  }, 1000);
}

function timeHandler(id) {
  time--;
  renderTime();

  if (time === 0) {
    clearInterval(timer);

    markCompleted(id);
    // current = null;
    // taskName.textContent = "";
    timer = null;
    renderTasks();
    // iniciar break
    startBreak();
  }
}

function startBreak() {
  time = 3;
  taskName.textContent = "Break";
  renderTime();
  timerBreak = setInterval(() => {
    timerBreakHandler();
  }, 1000);
}

function timerBreakHandler() {
  time--;
  renderTime();

  if (time === 0) {
    clearInterval(timerBreak);
    current = null;
    timerBreak = null;
    taskName.textContent = "";
    renderTasks;
  }
}

function renderTime() {
  const timeDiv = document.querySelector("#time #value");
  const minutes = parseInt(time / 60);
  const seconds = parseInt(time % 60);

  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}
// console.log(createTask(1));
function markCompleted(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  tasks[taskIndex].completed = true;
}
