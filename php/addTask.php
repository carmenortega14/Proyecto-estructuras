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

// Define un array para almacenar la respuesta que se enviará como JSON
$response = array('type' => 1, 'name' => $name);

// Verifica si los valores ddl y name no están vacíos
if ($ddl != '' && $name != '') {
    // Construye la consulta SQL para insertar los valores en la tabla 'tasks'
    $sql = "INSERT INTO tasks (taskDDL, taskName, taskTime, taskDescription, email, containername) VALUES ('$ddl', '$name', '$time', '$description', '$email', '$containername');";

    // Ejecuta la consulta SQL en la base de datos
    if ($conn->query($sql) === TRUE) {
        // Si la consulta se ejecuta correctamente, muestra la respuesta como JSON con el tipo 1 y el nombre ingresado
        echo json_encode($response);
    } else {
        // Si hay un error en la consulta, actualiza el tipo de respuesta a 0 y muestra la respuesta como JSON
        $response['type'] = 0;
        echo json_encode($response);
    }
}

// Cierra la conexión a la base de datos para liberar recursos
$conn->close();
?>
