// Definición de la clase Stack (pila)
class Stack {
    // Constructor de la clase Stack
    constructor() {
        // Inicializa un arreglo vacío para representar la pila
        this.stack = [];
    }
    
    // Método para agregar un elemento a la pila (push)
    push(item) {
        // Añade el elemento al final del arreglo (último en entrar, primero en salir)
        this.stack.push(item);
    }
    
    // Método para eliminar y devolver el elemento superior de la pila (pop)
    pop() {
        // Elimina y retorna el último elemento del arreglo
        return this.stack.pop();
    }
    
    // Método para verificar si la pila está vacía
    isEmpty() {
        // Retorna true si la longitud del arreglo es igual a cero, indicando que la pila está vacía
        return this.stack.length === 0;
    }
}

// Definición de la clase Queue (cola)
class Queue {
    // Constructor de la clase Queue
    constructor() {
        // Inicializa un arreglo vacío para representar la cola
        this.queue = [];
    }
    
    // Método para agregar un elemento al final de la cola (enqueue)
    enqueue(item) {
        // Añade el elemento al final del arreglo
        this.queue.push(item);
    }
    
    // Método para eliminar y devolver el elemento al frente de la cola (dequeue)
    dequeue() {
        // Elimina y retorna el primer elemento del arreglo (el primero en entrar, primero en salir)
        return this.queue.shift();
    }
    
    // Método para verificar si la cola está vacía
    isEmpty() {
        // Retorna true si la longitud del arreglo es igual a cero, indicando que la cola está vacía
        return this.queue.length === 0;
    }
}


// Declaración de variables
var showData; // Variable para almacenar los datos que se mostrarán en la tabla
var successfulDelete = new Stack(); // Instancia de la clase Stack para almacenar elementos eliminados exitosamente
var failDelete = new Stack(); // Instancia de la clase Stack para almacenar elementos no eliminados
var deleteLines = new Queue(); // Instancia de la clase Queue para almacenar líneas de datos a eliminar
var deleteLine = new Queue(); // Instancia de la clase Queue para almacenar líneas de datos eliminadas
var containername; // Variable para almacenar el nombre del contenedor
var email; // Variable para almacenar la dirección de correo electrónico del usuario
var hasData = true; // Variable booleana para indicar si hay datos en la tabla
var allTaskName = "ALL TASK"; // Variable para almacenar el nombre de todas las tareas

// Función que se ejecuta cuando la ventana ha cargado completamente
window.onload = function () {
    // Obtiene la dirección de correo electrónico almacenada en las cookies
    email = getCookie("email");

    // Redirige a la página de inicio de sesión si no hay dirección de correo electrónico
    if(email == "") {
        window.location.href = "Login.html";
    }
    else {
        // Obtiene el nombre del contenedor almacenado localmente
        containername = localStorage.getItem("containername");

        // Oculta los botones de modificación y eliminación si el contenedor es "ALL TASK"
        if(containername == allTaskName) {
            document.getElementById("modifyButton").style.visibility = "hidden";
            document.getElementById("deleteButton").style.visibility = "hidden";
        }

        // Llena la tabla con los datos correspondientes
        fillTable();

        // Establece un intervalo para actualizar el tiempo restante cada segundo
        setInterval("setRemainingTime()", 1000);
    }
};

// Función para llenar la tabla con datos del servidor
function fillTable() {
    // Realiza una solicitud POST al archivo PHP para obtener la lista de tareas
    $.post("../php/taskList.php",
        {
            email:email,
            containername:containername
        },
        // Función de retorno de llamada con los datos recibidos del servidor
        function(data){
            // Verifica si hay datos en la respuesta
            if(data.length > 0) {
                // Convierte los datos de formato JSON a un objeto JavaScript
                showData = JSON.parse(data);

                // Agrega los datos a la tabla
                addDataTable(showData);

                // Indica que hay datos en la tabla
                hasData = true;
            }
            else {
                // Indica que no hay datos en la tabla
                hasData = false;
            }
        }
    );
}


// Función para agregar datos a la tabla en la interfaz de usuario
function addDataTable(data) {
    // Obtiene la referencia a la tabla HTML por su ID ("listTable")
    var table = document.getElementById("listTable");

    // Inicializa una variable de contador
    var num = 1;

    // Itera a través de los datos proporcionados
    for (var i = 0; i < data.length; i++) {
        // Omite las tareas que no tienen fecha de vencimiento
        if (data[i].taskDDL == "")
            continue;

        // Inserta una nueva fila en la tabla
        var newRow = table.insertRow();

        // Crea un elemento de casilla de verificación y lo agrega a la celda de la nueva fila
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        newRow.insertCell().appendChild(checkbox);

        // Agrega el número de la tarea a la celda de la nueva fila
        newRow.insertCell().innerHTML = num;

        // Construye una cadena de fecha y hora para la tarea
        var datetime = data[i].taskDDL + " ";
        if (data[i].taskTime == '')
            datetime += "23:59";
        else datetime += data[i].taskTime;

        // Agrega la cadena de fecha y hora a la celda de la nueva fila
        newRow.insertCell().innerHTML = datetime;

        // Agrega el nombre de la tarea a la celda de la nueva fila
        newRow.insertCell().innerHTML = data[i].taskName;

        // Agrega el tiempo restante para la tarea a la celda de la nueva fila
        newRow.insertCell().innerHTML = getRemainingTime(data[i].taskDDL, datetime.substr(11, 5));

        // Almacena el índice de la tarea en la propiedad 'datanum' de la nueva fila
        newRow.datanum = i;

        // Agrega un botón "Details" si la descripción de la tarea es lo suficientemente larga
        if (data[i].taskDescription.length > 8) {
            var button = document.createElement("button");
            button.innerText = "Details";
            button.id = "i";
            button.setAttribute("title", "Descriptions");
            button.setAttribute("class", "btn btn-default");
            button.setAttribute("data-container", "body");
            button.setAttribute("data-toggle", "popover");
            button.setAttribute("data-placement", "top");
            button.setAttribute("data-content", data[i].taskDescription.toString());

            // Muestra u oculta el popover al pasar el mouse sobre el botón
            button.onmouseover = function () {
                $("#" + this.id).popover("show");
            };
            button.onmouseout = function () {
                $("#" + this.id).popover("hide");
            };

            // Agrega el botón a la celda de la nueva fila
            newRow.insertCell().appendChild(button);
        } else {
            // Si la descripción no es lo suficientemente larga, agrega la descripción directamente a la celda
            newRow.insertCell().innerHTML = data[i].taskDescription;
        }

        // Evalúa la diferencia de días y establece la clase de la fila según la antigüedad de la tarea
        var loc = newRow.cells[4].innerText.indexOf('d');
        var diffDay = newRow.cells[4].innerText.substr(0, loc);
        if (parseInt(diffDay) < 0) {
            // Hacer algo si la tarea está vencida (por ejemplo, cambiar su estilo)
        } else if (parseInt(diffDay) == 0) {
            // Establece la clase "danger" si la tarea está vencida en el día actual
            newRow.setAttribute("class", "danger");
        } else if (parseInt(diffDay) < 3) {
            // Establece la clase "warning" si la tarea vence en menos de 3 días
            newRow.setAttribute("class", "warning");
        } else if (parseInt(diffDay) < 7) {
            // Establece la clase "info" si la tarea vence en menos de 7 días
            newRow.setAttribute("class", "info");
        }

        // Incrementa el contador
        num++;
    }
}


// Función para actualizar el tiempo restante de las tareas en la tabla
function setRemainingTime() {
    // Verifica si la tabla tiene menos de 2 filas y hay datos disponibles
    if (document.getElementById("listTable").rows.length <= 1 && hasData) {
        // Limpia la tabla y la vuelve a llenar
        clearTable();
        fillTable();
    }

    // Obtiene la referencia a la tabla por su ID ("listTable")
    var table = document.getElementById("listTable");

    // Obtiene la lista de filas de la tabla
    var rows = table.rows;

    // Itera a través de las filas de la tabla (comenzando desde la segunda fila)
    for (var i = 1; i < rows.length; i++) {
        // Verifica si la tercera celda de la fila actual existe
        if (rows[i].cells[2] == undefined)
            continue;

        // Obtiene la cadena de fecha y hora de la tercera celda de la fila actual
        var str = rows[i].cells[2].innerText;

        // Actualiza el contenido de la quinta celda con el tiempo restante calculado
        rows[i].cells[4].innerHTML = getRemainingTime(str.substr(0, 10), str.substr(11, 5));
    }
}


// Función para calcular y devolver el tiempo restante entre la fecha límite y la fecha y hora actuales
function getRemainingTime(date, time) {
    // Obtiene la fecha y hora actuales
    var todayDate = new Date();

    // Crea un objeto de fecha a partir de la fecha límite proporcionada
    var DDLDate = new Date(date);

    // Establece las horas y minutos en el objeto de fecha límite según la hora proporcionada
    DDLDate.setHours(time.substr(0, 2));
    DDLDate.setMinutes(time.substr(3, 2));

    // Calcula la diferencia en milisegundos entre la fecha límite y la fecha y hora actuales
    var diff = DDLDate.getTime() - todayDate.getTime();

    // Verifica si la tarea ya ha vencido
    if (diff <= 0)
        return "-1d -1:-1:-1";
    else {
        // Calcula el número de días, horas, minutos y segundos restantes
        var diffDay = Math.floor(diff / (24 * 3600 * 1000));
        diff %= 24 * 3600 * 1000;

        var diffHour = Math.floor(diff / (3600 * 1000));
        if (diffHour < 10)
            diffHour = "0" + diffHour;

        diff %= 3600 * 1000;
        var diffMin = Math.floor(diff / (60 * 1000));
        if (diffMin < 10)
            diffMin = "0" + diffMin;

        diff %= 60 * 1000;
        var diffSec = Math.floor(diff / 1000);
        if (diffSec < 10)
            diffSec = '0' + diffSec;

        // Devuelve una cadena que representa el tiempo restante en formato "días horas:minutos:segundos"
        return diffDay + "d " + diffHour + ":" + diffMin + ":" + diffSec;
    }
}


// Función para establecer el color de fondo de una fila en la tabla
function setRowColor(row, ddl) {
    // La función está definida pero no tiene implementación en el código proporcionado.
}

// Función para obtener la diferencia en días entre dos fechas
function getDiffDay(today, ddl) {
    // Crea objetos de fecha a partir de las fechas proporcionadas
    var toadyDate = new Date(today);
    var ddlDate = new Date(ddl);
    // La función está definida pero no tiene una implementación completa en el código proporcionado.
}

// Función asociada al botón de eliminar una tarea en la interfaz de usuario
function deleteButton() {
    // Obtener la tabla por su ID
    var table = document.getElementById("listTable");
    // Obtener las filas de la tabla
    var rows = table.rows;
    // Iterar sobre las filas de la tabla
    for (var i = 1; i < rows.length; i++) {
        // Obtener el checkbox en la primera celda de cada fila
        var checkbox = rows[i].cells[0].firstElementChild;
        // Verificar si el checkbox está marcado
        if (checkbox.checked == true) {
            // Agregar el índice de la fila a la cola 'deleteLines' usando enqueue
            deleteLines.enqueue(i);
        }
    }

    // Obtener el elemento de texto de consejo por su ID
    var tipText = document.getElementById("tipText2");
    // Verificar si la cola 'deleteLines' está vacía
    if (deleteLines.isEmpty()) {
        // Mostrar un mensaje si no se ha seleccionado ninguna tarea
        tipText.innerText = "No se ha seleccionado ninguna tarea.";
    } else {
        // Mostrar un mensaje para confirmar la eliminación de tareas
        tipText.innerText = "Estás seguro de borrar la tarea?\n";
        tipText.innerText += "\nHaz clic en OK para borrar.";
    }
    // Mostrar un modal usando jQuery
    $('#myModal2').modal('show');
}

// Función para eliminar tareas seleccionadas en la interfaz de usuario
function deleteRow() {
    // Verificar si la cola 'deleteLines' está vacía
    if (deleteLines.isEmpty())
        return;
    // Obtener la tabla por su ID
    var table = document.getElementById("listTable");
    // Obtener las filas de la tabla
    var rows = table.rows;
    // Procesar todas las líneas en la cola 'deleteLines'
    while (!deleteLines.isEmpty()) {
        // Obtener y eliminar el índice de la fila de la cola 'deleteLines'
        var lineToDelete = deleteLines.dequeue();
        // Obtener el texto de la tercera celda de la fila
        var ddl = rows[lineToDelete].cells[2].innerText.substr(0, 10);
        // Obtener el texto de la cuarta celda de la fila
        var name = rows[lineToDelete].cells[3].innerText;
        // Llamar a la función para eliminar una tarea en la base de datos
        deleteOneInDB(ddl, name, lineToDelete, deleteLines.isEmpty());
    }
}

// Función para eliminar una tarea en la base de datos
function deleteOneInDB(taskDDL, taskName, line, update) {
    // Enviar una solicitud POST para eliminar la tarea usando AJAX
    $.post("../php/deleteTask.php", {
        email: email,
        containername: containername,
        name: taskName,
        ddl: taskDDL
    }, function(data) {
        // Analizar la respuesta JSON obtenida
        var obj = JSON.parse(data);
        // Verificar el tipo de respuesta
        if (obj.type == 1) {
            // Agregar el índice de la línea a 'successfulDelete' (pila) en caso de éxito
            successfulDelete.push(line);
        } else {
            // Agregar el índice de la línea a 'failDelete' (pila) en caso de falla
            failDelete.push(line);
        }

        // Verificar si se necesita una actualización en la interfaz de usuario
        if (update) {
            // Obtener el elemento de texto de consejo por su ID
            var tipText = document.getElementById("tipText");
            // Mostrar un mensaje indicando la cantidad de tareas eliminadas con éxito
            tipText.innerText = "Tarea borrada " + successfulDelete.length + " satisfactoriamente.\n";
            // Verificar si hay errores al borrar tareas
            if (!failDelete.isEmpty()) {
                tipText.innerText += "\nError al borrar";
                // Procesar todas las líneas en la pila 'failDelete'
                while (!failDelete.isEmpty()) {
                    // Obtener y eliminar índices de la pila 'failDelete' y mostrarlos en el mensaje
                    tipText.innerText += "[line " + failDelete.pop() + "] ";
                }
                tipText.innerText += ".";
            }

            // Ocultar el modal
            $('#myModal2').modal('hide');
            // Limpiar la tabla en la interfaz de usuario
            clearTable();
            // Volver a llenar la tabla con los datos actualizados
            fillTable();
        }
    });
}


// Función para limpiar la tabla en la interfaz de usuario
function clearTable() {
    // Comentario: Descomentando la siguiente línea se podría usar jQuery para vaciar las filas de la tabla (no utilizado en el código actual)
    // $("#listTable").find("tr:not(:first)").empty("");
    
    // Obtiene la referencia a la tabla por su ID ("listTable")
    var table = document.getElementById("listTable");

    // Obtiene la cantidad de filas en la tabla
    var len = table.rows.length;

    // Itera a través de las filas de la tabla, comenzando desde la última fila (excluyendo la primera fila de encabezado)
    for (var i = len - 1; i > 0; i--) {
        // Elimina la fila actual
        table.deleteRow(i);
    }
}

// Función para redirigir a la página de agregar tarea al hacer clic en el botón
function addTask() {
    // Redirige al usuario a la página de agregar tarea ("../UI/addTask.html")
    window.location = "../UI/addTask.html";
}


// Función para modificar una tarea seleccionada
function modify() {
    // Obtiene la referencia a la tabla por su ID ("listTable")
    var table = document.getElementById("listTable");

    // Obtiene la lista de filas de la tabla
    var rows = table.rows;

    // Variable para almacenar el índice de la fila seleccionada
    var line = 0;

    // Itera a través de las filas de la tabla (comenzando desde la segunda fila)
    for (var i = 1; i < rows.length; i++) {
        // Obtiene la casilla de verificación de la primera celda de cada fila
        var checkbox = rows[i].cells[0].firstElementChild;

        // Verifica si la casilla de verificación está marcada
        if (checkbox.checked == true) {
            // Almacena el índice de la fila actual y rompe el bucle
            line = i;
            break;
        }
    }

    // Verifica si no se ha seleccionado ninguna fila
    if (line == 0) {
        // Muestra un popover con un mensaje de advertencia
        $("#modifyButton").popover("show");
    } else {
        // Destruye el popover si hay una fila seleccionada
        $("#modifyButton").popover("destroy");

        // Obtiene referencias a los elementos de entrada en el formulario de modificación por su ID
        var ddl = document.getElementById("inputDDL");
        var time = document.getElementById("inputTime");
        var name = document.getElementById("inputTaskName");
        var description = document.getElementById("inputDescription");

        // Asigna los valores de la tarea seleccionada a los campos del formulario de modificación
        ddl.value = showData[rows[i].datanum].taskDDL;
        time.value = showData[rows[i].datanum].taskTime;
        name.value = showData[rows[i].datanum].taskName;
        description.value = showData[rows[i].datanum].taskDescription;

        // Muestra el modal de modificación
        $('#modifyModal').modal('show');
    }
}

// Función para modificar una tarea en la base de datos
function modifyDatabase() {
    // Obtiene los valores de los campos de entrada del formulario de modificación por su ID
    var ddl = document.getElementById("inputDDL").value;
    var time = document.getElementById("inputTime").value;
    var name = document.getElementById("inputTaskName").value;
    var description = document.getElementById("inputDescription").value;

    // Obtiene referencias a elementos HTML relevantes por su ID
    var tip = document.getElementById("tipText");

    // Realiza una solicitud POST al archivo PHP para modificar la tarea en la base de datos
    $.post("../php/modifyTask.php",
        {
            name: name,
            ddl: ddl,
            time: time,
            description: description,
            email: email,
            containername: containername
        },
        // Función de retorno de llamada con los datos recibidos del servidor
        function (data) {
            // Convierte la respuesta JSON del servidor en un objeto JavaScript
            var obj = JSON.parse(data);

            // Verifica el tipo de respuesta del servidor
            if (obj.type == 0) {
                // Si el tipo es 0, la modificación falló debido a la existencia previa de la tarea, muestra un mensaje de error
                document.getElementById("tipText").setAttribute("class", "modal-body has-error");
                tip.innerHTML = "Fallo al modificar ddl de la tarea " + name + ".";
            } else if (obj.type == 1) {
                // Si el tipo es 1, la modificación fue exitosa, muestra un mensaje de éxito
                document.getElementById("tipText").setAttribute("class", "modal-body has-success");
                tip.innerHTML = "Tarea " + name + " Modificada satisfactoriamente!";
            } else {
                // Si el tipo no es ni 0 ni 1, muestra un mensaje con el valor del tipo devuelto
                tip.innerHTML = "The return data is " + obj.type;
            }

            // Oculta el modal de modificación
            $('#modifyModal').modal('hide');
            // Muestra el modal con el ID "myModal"
            $('#myModal').modal('show');

            // Limpia y vuelve a llenar la tabla en la interfaz de usuario
            clearTable();
            fillTable();
        });
}

// Función para obtener el valor de una cookie por su nombre
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
