<?php

// Obtiene los valores enviados por el método POST desde un formulario o solicitud HTTP
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
$response = array('type' => "success");

// Construye la consulta SQL para buscar en la tabla 'users' el registro con el email proporcionado
$sql = "SELECT * FROM users WHERE email='$email';";
$result = $conn->query($sql);

$data = array();

// Verifica si se encontraron resultados en la consulta
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc(); // Obtiene la fila resultante de la consulta

    // Compara la contraseña obtenida con la contraseña almacenada en la base de datos
    if ($row['password'] != $pass) {
        // Si las contraseñas no coinciden, actualiza el tipo de respuesta a "wrongPassword"
        $response['type'] = "wrongPassword";
    } else {
        // Si las contraseñas coinciden, actualiza el tipo de respuesta a "success"
        $response['type'] = "success";
    }
    // Devuelve la respuesta en formato JSON
    echo json_encode($response);
} else {
    // Si no se encuentra el email en la base de datos, actualiza el tipo de respuesta a "noEmail"
    $response['type'] = "noEmail";
    // Devuelve la respuesta en formato JSON
    echo json_encode($response);
}

// Cierra la conexión a la base de datos para liberar recursos
$conn->close();
?>
