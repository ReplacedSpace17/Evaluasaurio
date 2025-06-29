<?php
// Incluir el archivo dbConector.php
require_once './utils/conectorDB.php'; // Asegúrate de que la ruta sea correcta

// Conectar a la base de datos
$conexion = conectarDB();

// Ejecutar la consulta SQL
$query = "SELECT * FROM departments";
$resultado = $conexion->query($query);

// Verificar si la consulta fue exitosa
if ($resultado) {
    // Crear un mensaje con los resultados
    $mensaje = "Consulta exitosa!<br>";
    while ($row = $resultado->fetch_assoc()) {
        // Mostrar los datos de cada registro
        $mensaje .= "ID: " . $row['id'] . " - Nombre: " . $row['name'] . "<br>";
    }
    
    // Mostrar el mensaje en un alert de JavaScript
    echo "<script type='text/javascript'>alert('$mensaje');</script>";
} else {
    // Si la consulta falla, mostrar un mensaje de error
    echo "<script type='text/javascript'>alert('Error en la consulta: " . $conexion->error . "');</script>";
}

// Cerrar la conexión
$conexion->close();
?>
