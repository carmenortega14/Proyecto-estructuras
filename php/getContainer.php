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

// Construye la consulta SQL para buscar en la tabla 'containers' los registros con el email proporcionado, ordenados por 'time'
$sql = "SELECT * FROM containers WHERE email = '$email' ORDER BY time;";
$result = $conn->query($sql);
$data = array(); // Crea un arreglo vacío para almacenar los datos

if ($result->num_rows > 0) {
    // Si se encuentran resultados en la consulta
    $i = 0; // Variable para mantener un índice al recorrer los resultados
    while ($row = $result->fetch_assoc()) {
        // Recorre cada fila de resultados y la almacena en el arreglo 'data'
        $data[$i] = $row;
        $i++;
    }
} else {
    // Si no se encuentran resultados en la consulta, no se realiza ninguna acción
}

// Convierte el arreglo 'data' a formato JSON y lo muestra como respuesta
echo json_encode($data);

// Cierra la conexión a la base de datos para liberar recursos
$conn->close();
?>
