<?php
header("Access-Control-Allow-Origin: *"); // Permite peticiones desde cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos

// Manejar preflight request (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
    http_response_code(200);
    exit();
}

// Función para conectar a la base de datos
function conectarDB() {
    $host = "localhost";
    $usuario = "backdb";
    $password = "Javier117";
    $base_datos = "evaluatec";

    $conexion = new mysqli($host, $usuario, $password, $base_datos);

    if ($conexion->connect_error) {
        die(json_encode(["status" => "error", "mensaje" => "Error de conexión: " . $conexion->connect_error]));
    }

    return $conexion;
}
?>