// Store the data temporarily
var DATA = [];
// current focus listname
var LIST = '';

//Eventlisteners
window.addEventListener('load', init);

//init To-Do LIst
function init() {
    renderLists();
}

//Render all lists
function renderLists() {
    if(DATA.length == 0) {
        let saveData = localStorage.getItem('toDoList');
        if (saveData != null) {
            DATA = JSON.parse(localStorage.getItem('toDoList'));
            DATA.forEach(element => {
                renderList(element)
            });   
        }
        else {
            clearAll();
        }

        document.getElementById("add-list-btn").addEventListener('click', createList);
        document.getElementById("lists").addEventListener('click', removeList);
        document.getElementById("lists").addEventListener('click', focusList);
    }
}

// Render current list
function renderList(list) {
    let ul = document.getElementById("lists");
    let li = document.createElement("LI");
    let btn =  document.createElement("I");
    let btnContainer = document.createElement('DIV');

    li.innerHTML = list.list;
    li.setAttribute('id', list.list);
    li.setAttribute('class', "list-item");
    btnContainer.setAttribute('class', "delete-list-btn");
    btn.setAttribute('class', "fas fa-trash-alt");
    btnContainer.appendChild(btn);
    li.appendChild(btnContainer);
    ul.appendChild(li);
}

//render todo
function renderToDo(todo) {
    let ul = document.getElementById("to-do-list")

    let task = todo.task;
    let li = document.createElement('LI');
    let span = document.createElement('SPAN');
    let checkIcon = document.createElement('I');
    let checkBtn = document.createElement('BUTTON');
    let crossIcon = document.createElement('I');
    let crossBtn = document.createElement('BUTTON');

    li.setAttribute('id', task);
    li.setAttribute('class', "todo-item");
    span.setAttribute('class', "task");
    span.innerHTML = task;
    checkIcon.setAttribute('class', "far fa-circle");
    checkBtn.setAttribute('class', "check-btn");
    crossIcon.setAttribute('class', "fas fa-times");
    crossBtn.setAttribute('class', "delete-todo-btn");

    checkBtn.appendChild(checkIcon);
    crossBtn.appendChild(crossIcon);
    li.appendChild(checkBtn);
    li.appendChild(span);
    li.appendChild(crossBtn);
    ul.appendChild(li);
}

//render all todos
function renderToDos() {
    let content = document.getElementById("content");

    let todos = [];
    DATA.forEach(element => {
        if (element.list == LIST) {
            todos = element.todos;

            for (let i = 0; i < todos.length; i++) {
                if( todos[i].check == true) {
                    todos.splice(i, 1);
                    DATA[i].todos = todos;
                    localStorage.setItem('toDoList', JSON.stringify(DATA));
                }
            }
            DATA = JSON.parse(localStorage.getItem('toDoList'));
        }
    });

    let listContainer = document.createElement('DIV');
    let headingListContainer = document.createElement('DIV');
    let ul = document.createElement('UL');
    let heading = document.createElement('H2');
    let countCompletedToDos = document.createElement('DIV');
    let inputContainer = document.createElement('DIV');
    let input = document.createElement('INPUT');
    let btn = document.createElement('BUTTON');
    let icon = document.createElement('I');

    listContainer.setAttribute('id', "list-container");
    listContainer.setAttribute('class', "content-container");
    inputContainer.setAttribute('id', "to-do-input");
    inputContainer.setAttribute('class', "input-container");
    headingListContainer.setAttribute('id', "heading-list-container");
    ul.setAttribute('id', "to-do-list");
    heading.setAttribute('id', LIST);
    heading.setAttribute('class', "heading");
    heading.innerHTML = `${LIST} :`;
    countCompletedToDos.setAttribute('id', "completed-todos");
    countCompletedToDos.innerHTML = `completed To-Dos: 0`;
    input.setAttribute('id', "add-to-do");
    input.setAttribute('type', "text");
    input.setAttribute('placeholder', "To-do erstellen");
    btn.setAttribute('id', "add-to-do-btn");
    icon.setAttribute('class', "fas fa-plus");

    headingListContainer.appendChild(heading);
    headingListContainer.appendChild(countCompletedToDos);
    listContainer.appendChild(headingListContainer);
    listContainer.appendChild(ul);
    btn.appendChild(icon);
    inputContainer.appendChild(input);
    inputContainer.appendChild(btn);
    listContainer.appendChild(inputContainer);
    content.appendChild(listContainer);

    document.getElementById("add-to-do-btn").addEventListener('click', createToDo);
    document.getElementById("to-do-list").addEventListener('click', checkOrRemoveToDo);

    if (todos.length != 0) {
        todos.forEach(element => {
            renderToDo(element);
        });  
    }
}

//Count completed toDos
function countCompleted() {
    let count = 0
    for (let i = 0; i < DATA.length; i++) {
        if(DATA[i].list = LIST) {
             todos = DATA[i].todos;
             for (let j = 0; j < todos.length; j++) {
                 if(todos[j].check == true) {
                    count += 1;
                 }
             }
        }
    }
    document.getElementById("completed-todos").innerHTML = `completed To-Dos: ${count}`;
}

//create new list
function createList() {
    var inputList = document.getElementById("add-list").value;

    if (inputList != '') {

        const ToDoList = {
            list: inputList,
            todos: [],
        }

        DATA.push(ToDoList);
        localStorage.setItem('toDoList', JSON.stringify(DATA));
        document.getElementById("add-list").value = '';

        renderList(ToDoList);
    }
    else {
        console.log("Eingabefeld ist leer");
    }
}

//delete a list
function removeList(event) {
    let obj = event.target;

    if (obj.getAttribute('class') == "fas fa-trash-alt") {
        let btn = obj.parentNode;
        console.log(btn);
        let li = btn.parentNode;
        let index = DATA.indexOf(LIST);
        DATA.splice(index, 1);
        localStorage.setItem('toDoList', JSON.stringify(DATA));
        li.remove();
        unfocusList();
    }
    else {
        console.log(obj);
    }
}

//focus the current list
function focusList(event) {
    let obj = event.target;

    if (obj.getAttribute('class') == "list-item") {
        unfocusList();
        LIST = obj.getAttribute('id');
        obj.style.opacity = "0.7";
        renderToDos();
    }
}

//unfocus the curent list
function unfocusList() {
    let list = document.getElementById(LIST);

    if (document.getElementById("list-container")) {
        document.getElementById("list-container").remove();
        list.style.opacity = "1";
    }
}

//create toDo
function createToDo() {
    var inputToDo = document.getElementById("add-to-do").value;

    if (inputToDo != '') {
        const ToDo = {
            task: inputToDo,
            check: false,
        }

        for (let i = 0; i < DATA.length; i++) {
            if (DATA[i].list == LIST) {
                DATA[i].todos.push(ToDo);
                localStorage.setItem('toDoList', JSON.stringify(DATA));
                document.getElementById("add-to-do").value = '';

                renderToDo(ToDo);
            }
        }
    }
}

//check and delete toDo
function checkOrRemoveToDo(event) {

    let obj = event.target;
    let btn = obj.parentNode;
    let li = btn.parentNode;
    let task = li.getAttribute('id');
    let todos = [];

        //uncheck to-do
        if(obj.getAttribute('class') == "far fa-check-circle") {
            for (let i = 0; i < DATA.length; i++) {
                if(DATA[i].list = LIST) {
                     todos = DATA[i].todos;
                     for (let j = 0; j < todos.length; j++) {
                         if(todos[j].task == task) {
                             todos[j].check = false;
                             DATA[i].todos = todos;
                             localStorage.setItem('toDoList', JSON.stringify(DATA));

                             obj.setAttribute('class', "far fa-circle");
                             li.style.opacity = "1";
                             li.style.textDecoration = "none";
     
                             countCompleted();
                         }
                     }   
                }
            }
         }

    //check to-do
    else if(obj.getAttribute('class') == "far fa-circle") {
       for (let i = 0; i < DATA.length; i++) {
           if(DATA[i].list = LIST) {
                todos = DATA[i].todos;
                for (let j = 0; j < todos.length; j++) {
                    if(todos[j].task == task) {
                        todos[j].check = true;
                        DATA[i].todos = todos;
                        localStorage.setItem('toDoList', JSON.stringify(DATA));

                        obj.setAttribute('class', "far fa-check-circle");
                        li.style.opacity = "0.7";
                        li.style.textDecoration = "line-through";

                        countCompleted();
                    }
                }   
           }
       }
    }


    //delete to-do
    if(obj.getAttribute('class') == "fas fa-times") {
        for (let i = 0; i < DATA.length; i++) {
            if(DATA[i].list == LIST) {
                todos = DATA[i].todos;
                for (let j = 0; j < todos.length; j++) {
                    if(todos[j].task == task) {
                        todos.splice(j, 1);
                        DATA[i].todos = todos;
                        localStorage.setItem('toDoList', JSON.stringify(DATA));

                        li.remove();
                    }
                }
            }
            
        }
    }
}

//delete all from localstorage
function clearAll() {
    localStorage.setItem('toDoList', '[]');
}