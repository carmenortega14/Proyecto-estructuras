<?php

// Obtiene los valores enviados por el método POST desde el formulario
$name = $_POST["name"]; // Obtiene el valor del campo "name"
$email = $_POST["email"]; // Obtiene el valor del campo "email"
$pass = $_POST["pass"]; // Obtiene el valor del campo "pass"

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
$response = array('type' => 1, 'name' => $name);

// Construye la consulta SQL para insertar los valores en la tabla 'users'
$sql = "INSERT INTO users (username, password, email) VALUES ('$name', '$pass', '$email')";

// Ejecuta la consulta SQL en la base de datos
if ($conn->query($sql) === TRUE) {
    // Si la consulta se ejecuta correctamente, muestra la respuesta como JSON con el tipo 1 y el nombre ingresado
    echo json_encode($response);
} else {
    // Si hay un error en la consulta, actualiza el tipo de respuesta a 0 y muestra la respuesta como JSON
    $response['type'] = 0;
    echo json_encode($response);
}

// Cierra la conexión a la base de datos para liberar recursos
mysqli_close($conn);
?>
