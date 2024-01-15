<?php

// Obtiene los valores enviados por el método POST desde un formulario o solicitud HTTP
$containername = $_POST["containername"]; // Obtiene el valor del campo "containername"
$email = $_POST["email"]; // Obtiene el valor del campo "email"

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

// Define un array para almacenar la respuesta que se enviará como JSON
$response = array('type' => 1);

// Construye la consulta SQL para eliminar registros de la tabla 'containers' basado en el nombre del contenedor y el email
$sql1 = "DELETE FROM containers WHERE containername = '$containername' AND email = '$email';";
// Construye la consulta SQL para eliminar registros de la tabla 'tasks' basado en el email y el nombre del contenedor
$sql2 = "DELETE FROM tasks WHERE email = '$email' AND containername = '$containername';";

// Ejecuta las consultas SQL para eliminar registros en ambas tablas
if ($conn->query($sql1) === TRUE && $conn->query($sql2) === TRUE) {
    // Si ambas consultas se ejecutan correctamente, muestra la respuesta como JSON con el tipo 1 (éxito)
    echo json_encode($response);
} else {
    // Si hay un error en alguna de las consultas, actualiza el tipo de respuesta a 0 (error)
    $response['type'] = 0;
    // Muestra la respuesta como JSON con el tipo de error actualizado
    echo json_encode($response);
}

// Cierra la conexión a la base de datos para liberar recursos
$conn->close();
?>
