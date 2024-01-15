<?php

// Obtiene los valores enviados por el método POST desde un formulario o solicitud HTTP
$ddl = $_POST["ddl"]; // Obtiene el valor del campo "ddl"
$time = $_POST["time"]; // Obtiene el valor del campo "time"
$name = $_POST["name"]; // Obtiene el valor del campo "name"
$description = $_POST["description"]; // Obtiene el valor del campo "description"
$email = $_POST["email"]; // Obtiene el valor del campo "email"
$containername = $_POST["containername"]; // Obtiene el valor del campo "containername"

// Configuración para la conexión a la base de datos MySQL
$serverName = "localhost"; // Dirección del servidor de la base de datos
$userName = "root"; // Nombre de usuario de la base de datos
$password = ""; // Contraseña de la base de datos
$database = "taskmanager"; // Nombre de la base de datos que se va a utilizar

// Establece una conexión a la base de datos utilizando la extensión MySQLi
$conn = mysqli_connect($serverName, $userName, $password, $database);

// Verifica si la conexión a la base de datos fue exitosa
if (!$conn) {
    // Si la conexión falla, muestra un mensaje de error y termina la ejecución del script
    die("Connection failed: " . mysqli_connect_error());
}

// Construye una consulta SQL para eliminar una tarea específica basada en el nombre, ddl, email y nombre del contenedor
$sql = "DELETE FROM tasks WHERE taskName = '$name' AND taskDDL = '$ddl' AND email = '$email' AND containername = '$containername';";
$conn->query($sql); // Ejecuta la consulta SQL para eliminar la tarea

// Construye una consulta SQL para insertar una nueva tarea con los valores proporcionados
$sql = "INSERT INTO tasks (taskDDL, taskName, taskTime, taskDescription, email, containername) VALUES ('$ddl', '$name', '$time', '$description', '$email', '$containername');";
$conn->query($sql); // Ejecuta la consulta SQL para insertar la nueva tarea

// Define un array para almacenar la respuesta que se enviará como JSON
$response = array('type' => 1, 'name' => $name);

// Devuelve una respuesta JSON indicando el éxito de la operación
echo json_encode($response);

// Cierra la conexión a la base de datos para liberar recursos
$conn->close();
?>
