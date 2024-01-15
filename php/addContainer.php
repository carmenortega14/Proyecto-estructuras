<?php

// Obtiene los valores enviados por el método POST desde un formulario o solicitud HTTP
$containername = $_POST["containername"]; // Obtiene el valor del campo "containername"
$email = $_POST["email"]; // Obtiene el valor del campo "email"
$time = $_POST["time"]; // Obtiene el valor del campo "time"

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

// Construye la consulta SQL para insertar los valores en la tabla 'containers'
$sql = "INSERT INTO containers (containername, email, time) VALUES ('$containername', '$email', '$time')";

// Ejecuta la consulta SQL en la base de datos
if ($conn->query($sql) === TRUE) {
    // Si la consulta se ejecuta correctamente, muestra la respuesta como JSON con el tipo 1 (éxito)
    echo json_encode($response);
} else {
    // Si hay un error en la consulta, actualiza el tipo de respuesta a 0 (error)
    $response['type'] = 0;
    // Muestra la respuesta como JSON con el tipo de error actualizado
    echo json_encode($response);
}

// Cierra la conexión a la base de datos para liberar recursos
$conn->close();
?>
