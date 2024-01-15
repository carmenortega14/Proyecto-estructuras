// Declaración de variables globales para almacenar el nombre del contenedor y la dirección de correo electrónico
var containername;
var email;

// Función que se ejecuta cuando la ventana se carga completamente
window.onload = function () {
    // Obtiene el valor de la cookie "email" utilizando la función getCookie
    email = getCookie("email");

    // Verifica si no se encontró la dirección de correo electrónico en la cookie
    if (email == "") {
        // Redirige al usuario a la página de inicio de sesión ("Login.html")
        window.location.href = "Login.html";
    }
    // Si se encontró la dirección de correo electrónico en la cookie
    else {
        // Obtiene el valor almacenado en el objeto localStorage con clave "containername"
        containername = localStorage.getItem("containername");

        // Llama a la función setInput para realizar alguna operación adicional
        setInput();
    }
};


// Función para establecer valores predeterminados en los campos de entrada del formulario
function setInput() {
    // Obtiene referencias a elementos HTML relevantes por su ID
    var DDL = document.getElementById("inputDDL");
    var time = document.getElementById("inputTime");

    // Asigna la fecha actual al campo de fecha límite (DDL)
    DDL.value = getCurrentDate();

    // Asigna el valor "23:59" al campo de tiempo
    time.value = "23:59";
}

// Función para enviar la entrada del formulario al servidor
function submitInput() {
    // Variable para indicar si los campos están listos para ser enviados
    var readySubmit = true;

    // Obtiene referencias a elementos HTML relevantes por su ID
    var DDL = document.getElementById("inputDDL").value;
    var tip = document.getElementById("tipText");

    // Verifica si el campo de fecha límite (DDL) está vacío
    if (DDL == "") {
        // Establece la clase de la form-group a "has-error" y marca que no está listo para enviar
        document.getElementById("inputDDLGroup").setAttribute("class", "form-group has-error");
        readySubmit = false;
    } else {
        // Establece la clase de la form-group a "has-success" si el campo no está vacío
        document.getElementById("inputDDLGroup").setAttribute("class", "form-group has-success");
    }

    // Obtiene el valor del campo de nombre de tarea
    var taskName = document.getElementById("inputTaskName").value;

    // Verifica si el campo de nombre de tarea está vacío
    if (taskName == "") {
        // Establece la clase de la form-group a "has-error" y marca que no está listo para enviar
        document.getElementById("inputNameGroup").setAttribute("class", "form-group has-error");
        readySubmit = false;
    } else {
        // Establece la clase de la form-group a "has-success" si el campo no está vacío
        document.getElementById("inputNameGroup").setAttribute("class", "form-group has-success");
    }

    // Obtiene los valores de los campos de tiempo y descripción
    var taskTime = document.getElementById("inputTime").value;
    var taskDescription = document.getElementById("inputDescription").value;

    // Obtiene la referencia al elemento tipText
    var tip = document.getElementById("tipText");

    // Verifica si los campos están listos para ser enviados
    if (readySubmit == true) {
        // Realiza una solicitud POST al archivo PHP para agregar una tarea al servidor
        $.post("../php/addTask.php",
            {
                name: taskName,
                ddl: DDL,
                time: taskTime,
                description: taskDescription,
                email: email,
                containername: containername
            },
            // Función de retorno de llamada con los datos recibidos del servidor
            function (data) {
                // Convierte la respuesta JSON del servidor en un objeto JavaScript
                var obj = JSON.parse(data);

                // Verifica el tipo de respuesta del servidor
                if (obj.type == 0) {
                    // Si el tipo es 0, la inserción falló debido a la existencia previa de la tarea, muestra un mensaje de error
                    document.getElementById("tipText").setAttribute("class", "modal-body has-error");
                    tip.innerHTML = "Fallo al modificar ddl de la tarea " + taskName + ".";
                } else if (obj.type == 1) {
                    // Si el tipo es 1, la inserción fue exitosa, muestra un mensaje de éxito
                    document.getElementById("tipText").setAttribute("class", "modal-body has-success");
                    tip.innerHTML = "Tarea " + taskName + " Agragada satisfactoriamente!";
                } else {
                    // Si el tipo no es ni 0 ni 1, muestra un mensaje con el valor del tipo devuelto
                    tip.innerHTML = "The return data is " + obj.type;
                }

                // Muestra el modal con el ID "myModal"
                $('#myModal').modal('show');
            });

        // Limpia los campos de entrada y establece valores predeterminados para el próximo ingreso
        clearInput();
        setInput();
    }
}


// Función para restablecer los estilos de color a los valores predeterminados en los elementos relevantes
function resetColor() {
    // Establece la clase de la form-group del campo de fecha límite (DDL) a su valor predeterminado
    document.getElementById("inputDDLGroup").setAttribute("class", "form-group");
    // Establece la clase de la form-group del campo de nombre de tarea a su valor predeterminado
    document.getElementById("inputNameGroup").setAttribute("class", "form-group");
    // Establece la clase de la modal-body del elemento tipText a su valor predeterminado
    document.getElementById("tipText").setAttribute("class", "modal-body");
}

// Función para limpiar los campos de entrada y restablecer los estilos de color a los valores predeterminados
function clearInput() {
    // Establece los valores de los campos de entrada a cadenas vacías
    document.getElementById("inputDDL").value = "";
    document.getElementById("inputTaskName").value = "";
    document.getElementById("inputTime").value = "";
    document.getElementById("inputDescription").value = "";
    // Llama a la función resetColor para restablecer los estilos de color
    resetColor();
}

// Función para verificar si los campos de entrada tienen valores válidos y establecer los estilos de color en consecuencia
function checkInput() {
    // Variable para indicar si los campos están listos para ser devueltos
    var readyReturn = true;

    // Obtiene el valor del campo de fecha límite (DDL)
    var DDL = document.getElementById("inputDDL").value;

    // Verifica si el campo de fecha límite (DDL) está vacío
    if (DDL == "") {
        // Establece la clase de la form-group a "has-error" y marca que no está listo para ser devuelto
        document.getElementById("inputDDLGroup").setAttribute("class", "form-group has-error");
        readyReturn = false;
    } else {
        // Establece la clase de la form-group a su valor predeterminado si el campo no está vacío
        document.getElementById("inputDDLGroup").setAttribute("class", "form-group");
    }

    // Obtiene el valor del campo de nombre de tarea
    var name = document.getElementById("inputTaskName").value;

    // Verifica si el campo de nombre de tarea está vacío
    if (name == "") {
        // Establece la clase de la form-group a "has-error" y marca que no está listo para ser devuelto
        document.getElementById("inputNameGroup").setAttribute("class", "form-group has-error");
        readyReturn = false;
    } else {
        // Establece la clase de la form-group a su valor predeterminado si el campo no está vacío
        document.getElementById("inputNameGroup").setAttribute("class", "form-group");
    }

    // Devuelve el estado de preparación de los campos
    return readyReturn;
}

// Función para obtener la fecha actual en el formato "YYYY-MM-DD"
function getCurrentDate() {
    // Crea un nuevo objeto Date, que representa la fecha y hora actuales
    var date = new Date();

    // Obtiene el año actual
    var year = date.getFullYear();

    // Obtiene el mes actual (se suma 1 porque los meses van de 0 a 11 en JavaScript)
    var month = date.getMonth() + 1;

    // Agrega un cero al frente si el mes es menor que 10 (para mantener el formato de dos dígitos)
    if (month < 10)
        month = "0" + month;

    // Obtiene el día del mes actual
    var day = date.getDate();

    // Agrega un cero al frente si el día es menor que 10 (para mantener el formato de dos dígitos)
    if (day < 10)
        day = "0" + day;

    // Retorna la fecha en formato "YYYY-MM-DD"
    return year + "-" + month + "-" + day;
}

// Función para obtener el valor de una cookie por su nombre
function getCookie(cname) {
    // Crea una cadena que representa el nombre de la cookie seguido de "="
    var name = cname + "=";

    // Divide la cadena de cookies en pares de nombre y valor
    var ca = document.cookie.split(';');

    // Itera sobre los pares de nombre y valor
    for (var i = 0; i < ca.length; i++) {
        // Elimina los espacios en blanco al principio y al final de cada cadena
        var c = ca[i].trim();

        // Verifica si la cadena comienza con el nombre de la cookie buscada
        if (c.indexOf(name) == 0)
            // Retorna la parte de la cadena después del nombre de la cookie
            return c.substring(name.length, c.length);
    }

    // Retorna una cadena vacía si no se encuentra la cookie
    return "";
}