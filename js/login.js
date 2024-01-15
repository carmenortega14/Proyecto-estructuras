// Esta función se ejecuta cuando el documento HTML se ha cargado completamente
$(document).ready(function(){
    // Se agrega un listener para el evento 'resize' en la ventana del navegador
    $(window).resize(function() {
        // Llama a la función setLocation() cuando se redimensiona la ventana
        setLocation();
    });
});

// Esta función actualiza la ubicación de elementos en la página
function setLocation() {
    // Obtiene elementos del DOM
    var l = document.getElementById("workspace");
    var height = window.innerHeight;
    var lHeight = l.clientHeight;
    var style = "padding-top: " + Math.floor((height - lHeight) / 2 - 80)  + "px;";
    l.setAttribute("style",style); // Actualiza el estilo del elemento 'workspace'

    // Actualiza el estilo del elemento 'screen'
    document.getElementById("screen").setAttribute("style","height: " + window.innerHeight + "px; " +
        "background-color: #2c2c32;"); 

    // Actualiza el estilo del elemento 'workspace'
    document.getElementById("workspace").setAttribute("style",style);
}

// Esta función se ejecuta cuando la ventana y sus recursos asociados se han cargado completamente
window.onload = function () {
    // Llama a la función setLocation() cuando se carga la ventana
    setLocation();
};

// Función para registrar un usuario
function register() {
    // Obtiene valores de los campos de registro
    var name = document.getElementById("registerName").value;
    var email = document.getElementById("registerEmail").value;
    var pass = document.getElementById("registerPassword").value;
    var pass2 = document.getElementById("registerPassword2").value;

    // Variable para verificar si el formulario está listo para enviar
    var ready = true;

    // Validación de campos y cambios visuales basados en la validación
    if(name == "") {
        document.getElementById("registerNameGroup").setAttribute("class","form-group has-error");
        ready = false;
    }
    else
        document.getElementById("registerNameGroup").setAttribute("class","form-group has-success");

    if(email == "") {
        document.getElementById("registerEmailGroup").setAttribute("class","form-group has-error");
        ready = false;
    }
    else
        document.getElementById("registerEmailGroup").setAttribute("class","form-group has-success");

    if(pass == "") {
        document.getElementById("registerPasswordGroup").setAttribute("class","form-group has-error");
        ready = false;
    }
    else
        document.getElementById("registerPasswordGroup").setAttribute("class","form-group has-success");

    if(pass2 == "") {
        document.getElementById("registerPasswordGroup2").setAttribute("class","form-group has-error");
        ready = false;
    }
    else if(pass != pass2) {
        document.getElementById("registerPasswordGroup").setAttribute("class","form-group has-error");
        document.getElementById("registerPasswordGroup2").setAttribute("class","form-group has-error");
        ready = false;
    }
    else {
        document.getElementById("registerPasswordGroup2").setAttribute("class","form-group has-success");
    }

    // Si el formulario está listo para enviar, realiza una petición POST con los datos del registro
    if(ready) {
        $.post("../php/register.php", {
            name : name,
            email : email,
            pass : pass
        },
        function(data) {
            // Procesa la respuesta de la petición
            var obj = JSON.parse(data);
            var tip = document.getElementById("tipText");
            if(obj.type == '1') {
                document.getElementById("tipText").setAttribute("class","modal-body has-success");
                tip.innerHTML = "Registro satisfactorio!";
            }
            else if(obj.type == '0') {
                document.getElementById("tipText").setAttribute("class", "modal-body has-error");
                tip.innerHTML = "El correo ya se encuentra registrado.";
            }
            else {
                document.getElementById("tipText").setAttribute("class", "modal-body has-error");
                tip.innerHTML = "Error al conectar a la base de datos.";
            }

            $('#myModal').modal('show');
        });
        // Llama a la función para limpiar los campos de entrada
        clearInput();
    }

}

// Función para iniciar sesión
function login() {
     // Obtiene valores de los campos de inicio de sesión
    var email = document.getElementById("loginEmail").value;
    var pass = document.getElementById("loginPassword").value;

    // Variable para verificar si el formulario está listo para enviar
    var ready = true;

    if(email == "") {
        document.getElementById("loginEmailGroup").setAttribute("class","form-group has-error");
        ready = false;
        tipText.innerText = "Se debe ingresar el Email.";
    }
    else
        document.getElementById("loginEmailGroup").setAttribute("class","form-group has-success");

    if(pass == "") {
        document.getElementById("loginPasswordGroup").setAttribute("class","form-group has-error");
        ready = false;
        tipText.innerText = "Se debe ingresar la contraseña.";
    }
    if(email == "" && pass == "") {
        document.getElementById("loginPasswordGroup").setAttribute("class","form-group has-error");
        ready = false;
        tipText.innerText = "Se debe ingresar todos los datos.";
    }
    else
        document.getElementById("loginPasswordGroup").setAttribute("class","form-group has-success");

    if(ready) {
        $.post("../php/login.php", {
                email : email,
                pass : pass
            },
            function(data) {
                // Procesa la respuesta de la petición
                var obj = JSON.parse(data);
                var tip = document.getElementById("tipText");
                if(obj.type == 'success') {
                    document.cookie = "email=" + email +"; path=home.html";
                    document.cookie = "email=" + email +"; path=taskList.html";
                    document.cookie = "email=" + email +"; path=addTask.html";
                    window.location.href="../UI/home.html";
                }
                else if(obj.type == 'wrongPassword') {
                    document.getElementById("tipText").setAttribute("class", "modal-body has-error");
                    tip.innerHTML = "Contraseña incorrecta.";
                }
                else if(obj.type == 'noEmail') {
                    document.getElementById("tipText").setAttribute("class", "modal-body has-error");
                    tip.innerHTML = "El correo no se encunetra registrado.";
                }
                else {
                    document.getElementById("tipText").setAttribute("class", "modal-body has-error");
                    tip.innerHTML = "Error al conectar a la base de datos.";
                }

                $('#myModal').modal('show');
            });
            // Llama a la función para limpiar los campos de entrada
        clearInput();
    }

}

// Función para restablecer los estilos a su estado original
function resetColor() {
    document.getElementById("registerNameGroup").setAttribute("class","form-group");
    document.getElementById("registerEmailGroup").setAttribute("class","form-group");
    document.getElementById("registerPasswordGroup").setAttribute("class","form-group");
    document.getElementById("registerPasswordGroup2").setAttribute("class","form-group");
    document.getElementById("loginEmailGroup").setAttribute("class","form-group");
    document.getElementById("loginPasswordGroup").setAttribute("class","form-group");
}

// Función para limpiar los campos de entrada y restablecer estilos
function clearInput() {
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";
    document.getElementById("registerName").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerPassword").value = "";
    document.getElementById("registerPassword2").value = "";
    // Llama a la función para restablecer los estilos de los campos
    resetColor();
}