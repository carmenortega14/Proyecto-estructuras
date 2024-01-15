<?php

// Define una variable con el nombre especial "ALL TASK"
$allTaskName = "ALL TASK";

// Obtiene los valores enviados por el método POST desde un formulario o solicitud HTTP
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

// Verifica si el nombre del contenedor es diferente al nombre especial "ALL TASK"
if ($containername != $allTaskName) {
    // Construye la consulta SQL para seleccionar todas las tareas para un contenedor específico y un email dado, ordenadas por 'taskDDL'
    $sql = "SELECT * FROM tasks WHERE email = '$email' AND containername = '$containername' ORDER BY taskDDL;";
} else {
    // Si el nombre del contenedor es igual al nombre especial "ALL TASK", selecciona todas las tareas para un email dado, ordenadas por 'taskDDL'
    $sql = "SELECT * FROM tasks WHERE email = '$email' ORDER BY taskDDL;";
}

// Ejecuta la consulta SQL en la base de datos
$result = $conn->query($sql);
$data = array(); // Crea un arreglo vacío para almacenar los datos

// Verifica si hay resultados en la consulta
if ($result->num_rows > 0) {
    $i = 0; // Inicializa un contador para almacenar los resultados en el arreglo
    while ($row = $result->fetch_assoc()) {
        // Recorre cada fila de resultados y la almacena en el arreglo 'data'
        $data[$i] = $row;
        $i++;
    }
    // Devuelve los datos en formato JSON si se encontraron resultados
    echo json_encode($data);
} else {
    // Si no se encuentran resultados en la consulta, muestra un mensaje indicando la falta de resultados
    echo "0 resultados";
}

// Cierra la conexión a la base de datos para liberar recursos
$conn->close();
?>
