<?php

// Obtiene el valor enviado por el método POST desde un formulario o solicitud HTTP
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
$response = array('type' => "success", 'username' => "-");

// Construye la consulta SQL para buscar en la tabla 'users' el registro con el email proporcionado
$sql = "SELECT * FROM users WHERE email='$email';";
$result = $conn->query($sql);

// Obtiene la fila resultante de la consulta
$row = $result->fetch_assoc();

// Actualiza el valor del campo 'username' en la respuesta con el valor obtenido de la base de datos
$response['username'] = $row['username'];

// Devuelve la respuesta en formato JSON que contiene el tipo y el nombre de usuario
echo json_encode($response);

// Cierra la conexión a la base de datos para liberar recursos
$conn->close();
?>
