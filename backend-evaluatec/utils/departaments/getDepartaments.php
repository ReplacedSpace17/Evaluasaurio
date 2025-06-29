<?php
// Incluir el archivo dbConector.php
require_once './utils/conectorDB.php'; // Asegúrate de que la ruta sea correcta

// Conectar a la base de datos
$conexion = conectarDB();

// Ejecutar la consulta SQL
$query = "SELECT * FROM departments";
$resultado = $conexion->query($query);

// Crear un array para almacenar los resultados
$response = [];

if ($resultado) {
    // Si la consulta es exitosa, almacenar los resultados en el array
    while ($row = $resultado->fetch_assoc()) {
        $response[] = [
            'id' => $row['id'],
            'name' => $row['name']
        ];
    }
    
    // Establecer el encabezado de respuesta como JSON
    header('Content-Type: application/json');
    
    // Devolver la respuesta en formato JSON
    echo json_encode([
        'status' => 'success',
        'message' => 'Consulta exitosa!',
        'data' => $response
    ]);
} else {
    // Si la consulta falla, devolver un mensaje de error en JSON
    echo json_encode([
        'status' => 'error',
        'message' => 'Error en la consulta: ' . $conexion->error
    ]);
}

// Cerrar la conexión
$conexion->close();
?>
