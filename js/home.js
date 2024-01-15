// Esta función se ejecuta cuando el documento HTML se carga completamente
$(document).ready(function(){
    // Establece un evento de redimensionamiento de la ventana para llamar a setFullHeight()
    $(window).resize(function() {
        setFullHeight();
    });
});

// Esta función ajusta la altura de ciertos elementos a la altura completa de la ventana
function setFullHeight() {
    var height = window.innerHeight;
    var fullScreenElement =  document.getElementsByClassName("fullScreen");
    for(var i=0;i<fullScreenElement.length;i++) {
        fullScreenElement[i].setAttribute("style","height: " + height + "px;");
    }

    var style = "height: " + height + "px; background-color: #2c2c32";
    document.getElementById("sidebar").setAttribute("style",style);

    var style2 = "max-height: " + Math.floor( height * 0.65) + "px;" +
        "overflow-y:auto; ";
    document.getElementById("containerList").setAttribute("style",style2);

}

// Declaración de variables globales
var email;
var username;
var containers = [];
var nowContainer = -1;
var liArray = [];
var liNow;
var allTaskName = "ALL TASK";

// Definición de la clase Graph para manejar la estructura del grafo
class Graph {
    constructor() {
        this.nodes = {};
    }

    // Métodos para agregar, eliminar contenedores y establecer transiciones entre ellos
    addContainer(containerName) {
        if (!(containerName in this.nodes)) {
            this.nodes[containerName] = [];
        }
    }

    addTransition(fromContainer, toContainer) {
        if (!(fromContainer in this.nodes)) {
            this.nodes[fromContainer] = [];
        }
        if (!(toContainer in this.nodes)) {
            this.nodes[toContainer] = [];
        }
        this.nodes[fromContainer].push(toContainer);
        this.nodes[toContainer].push(fromContainer); // Si es bidireccional
    }

    deleteContainer(containerName) {
        delete this.nodes[containerName];
        // Eliminar conexiones relacionadas con este contenedor
        for (const node in this.nodes) {
            this.nodes[node] = this.nodes[node].filter((c) => c !== containerName);
        }
    }
}

// Creación de una instancia de la clase Graph
const containerGraph = new Graph();

// Evento de carga de la ventana
window.onload = function () {
    // Obtiene el email almacenado en las cookies
    email = getCookie("email");
    // Redirecciona a la página de inicio de sesión si no hay email almacenado
    if(email == "") {
        window.location.href = "Login.html";
    }
    // Realiza una solicitud AJAX para obtener información del usuario
    else {
        $.post("../php/getUser.php", {
            email : email
        },
        function (data) {
            var obj = JSON.parse(data);
            username = obj.username;
            document.getElementById("userName").innerText = "User : " + username;
        });
    }

     // Establece la altura completa y otros ajustes iniciales
    setFullHeight();
    localStorage.setItem("containername","");
    setContainer();
};

// Función para establecer el contenedor
function setContainer() {
    // Realizar una petición POST para obtener contenedores desde el archivo PHP
    $.post("../php/getContainer.php",
        {
            email : email
        },
        // Función de retorno con los datos recibidos
        function (data) {
            var jsondata = JSON.parse(data);
            for(var j = 0; j < jsondata.length;j++) {
                containers[j] = jsondata[j].containername;
            }
            if(containers.length > 0) {
                containers.splice(0,0,allTaskName);
                addContainerToBar();
            }
            else {
                document.getElementById("iframe-manage").setAttribute("src","noContainerTip.html");
            }
        }
    );
}

// Función para agregar contenedores a la barra de navegación
function addContainerToBar() {
    // Inicializar el índice del contenedor actual como 0
    nowContainer = 0;
     // Guardar el nombre del contenedor actual en el almacenamiento local
    localStorage.setItem("containername",containers[0]);
    document.getElementById("iframe-manage").setAttribute("src","taskList.html");
    var bar = document.getElementById("containerBar");
    
    for(var i = 0; i < containers.length; i++) {
        // Agregar contenedores al grafo
        containerGraph.addContainer(containers[i]);
        var li = document.createElement("li");
        li.setAttribute("role","presentation");
        li.num = i;
        li.onclick = function () {
            if(nowContainer != this.num) {
                liArray[nowContainer].setAttribute("class", "");
                nowContainer = this.num;
                liArray[nowContainer].setAttribute("class", "active");
            }

            localStorage.setItem("containername",containers[nowContainer]);
        };
        // Crear un elemento ancla
        var a = document.createElement("a");
        a.setAttribute("href","taskList.html");
        a.setAttribute("target","iframe-manage");
        // Establecer el texto del elemento ancla como el nombre del contenedor
        a.innerText = containers[i];
        // Agregar el elemento ancla al elemento de lista
        li.appendChild(a);
        // Agregar el elemento de lista a la barra
        bar.appendChild(li);
        liArray[liArray.length] = li;
    }
    liArray[nowContainer].setAttribute("class", "active");
}


function addContainer() {
    $('#addContainerModal').modal('show');
}

// Función para eliminar contenedor
function deleteContainer() {
    // Verifica si el contenedor actual no es 'allTaskName'
    if(containers[nowContainer] != allTaskName) {
        // Obtiene el elemento con el ID 'deleteContainerTipText'
        var tip = document.getElementById("deleteContainerTipText");
        tip.innerHTML = "El contenedor " + containers[nowContainer] + " sera borrado.\n" +
            "Junto a todas sus tareas dentro de el.\n" +
            "\n¿Estás seguro?";
        $('#deleteContainerModal').modal('show');
    }
    else {
        var tip2 = document.getElementById("tipText");
        tip2.innerHTML = "No se puede borrar este contenedor!.";
        $('#myModal').modal('show');
    }

}

// Función para elimianr contenedor de la base de datos
function deleteContainerinDatabase() {

    // Realiza una petición POST para eliminar el contenedor en la base de datos usando PHP
    $.post("../php/deleteContainer.php",{
        email:email,
        containername : containers[nowContainer]
    },
    function (data) {
        var obj = JSON.parse(data);
        if(obj.type == '1' ) {
            var bar = document.getElementById("containerBar");
            bar.removeChild(liArray[nowContainer]);
            liArray.splice(nowContainer, 1);
            containers.splice(nowContainer, 1);
            containerGraph.deleteContainer(containers[nowContainer]);
            if (nowContainer == liArray.length) {
                nowContainer = liArray.length - 1;
            }
            if(liArray.length == 1) {
                bar.removeChild(liArray[0]);
                liArray.splice(0, 1);
                containers = [];
                document.getElementById("iframe-manage").setAttribute("src","noContainerTip.html");
            }
            else {
                liArray[nowContainer].setAttribute("class", "active");
                localStorage.setItem("containername",containers[nowContainer]);
                document.getElementById("iframe-manage").setAttribute("src", "taskList.html");
            }
        }
        else {

        }
    });

}

// Función para agregar contenedor a la base de datos
function addContainerToDatabase() {
    var containername = document.getElementById("containerName").value;

    var ready = true;

    // Verificar si el contenedor ya existe en el grafo
    if (containerGraph.nodes[containername] || containername === "") {
        ready = false;
    }

    for(var i = 0; i < containers.length; i++) {
        if(containers[i] == containername)
        {
            ready = false;
            break;
        }
    }

    if(containername != "" && ready) {

        var num = getContainerNum(containername);
        $.post("../php/addContainer.php", {
                email: email,
                containername: containername,
                time: num
            },
            function (data) {
                if(containers.length == 0) {
                    containers[0] = allTaskName;
                    containers[1] = containername;
                    addContainerToBar();
                }
                else {
                    var bar = document.getElementById("containerBar");
                    var li = document.createElement("li");
                    li.setAttribute("role","presentation");
                    li.num = liArray.length;
                    li.onclick = function () {
                        liArray[nowContainer].setAttribute("class", "");
                        nowContainer = this.num;
                        liArray[nowContainer].setAttribute("class", "active");

                        localStorage.setItem("containername",containers[nowContainer]);
                    };
                    var a = document.createElement("a");
                    a.setAttribute("href","taskList.html");
                    a.setAttribute("target","iframe-manage");
                    a.innerText = containername;
                    li.appendChild(a);
                    liArray[liArray.length] = li;
                    
                    containers.push(containername);
                    // Agrega el contenedor del grafo
                    containerGraph.addContainer(containername);
                    bar.appendChild(li);
                    containers[containers.length] = containername;
                    if(containers.length == 1) {
                        nowContainer = 0;
                        liArray[nowContainer].setAttribute("class", "active");
                        document.getElementById("iframe-manage").setAttribute("src","taskList.html");
                    }
                }
            }
        );
    }
    else {

    }
}

// Función para cerrar 
function signOut() {
    // Limpiar cookies
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
    }

    // Limpiar localStorage
    localStorage.clear();


    // Redirige a la página de inicio de sesión
    window.location = "../UI/Login.html";
}


function getContainerNum(name) {
    var date = new Date();
    var year = date.getFullYear();
    if(name == allTaskName)
        year -= 100;
    // Obtiene el mes, día, hora, minuto y segundo actual y los formatea para asegurarse de que tengan dos dígitos
    var month = date.getMonth() + 1;
    if(month < 10)
        month = "0" + month;
    var day = date.getDate();
    if(day < 10)
        day = "0" + day;
    var hour = date.getHours();
    if(hour < 10)
        hour = "0" + hour;
    var minute = date.getMinutes();
    if(minute < 10)
        minute = "0" + minute;
    var seconds = date.getSeconds();
    if(seconds < 10)
        secondes = "0" + secondes;
    // Devuelve una cadena que concatena el año, mes, día, hora, minuto y segundo en formato YYYYMMDDHHmmss
    return year +  month +  day + hour + minute + seconds;
}


function getCookie(cname)
{
    // Construye el formato del nombre de la cookie a buscar
    var name = cname + "=";
    // Divide las cookies individuales por punto y coma ";"
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        // Elimina los espacios en blanco alrededor de la cookie
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length); // Devuelve el valor de la cookie
    }
    // Devuelve una cadena vacía si no se encuentra la cookie
    return "";
}
