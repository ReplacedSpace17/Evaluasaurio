<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejo de preflight request (CORS)
if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
    http_response_code(200);
    exit();
}

// Conectar a la base de datos
$servername = "mysql.hostinger.com";
$database = "u658960376_test";
$username = "u658960376_admin";
$password = "L4^ttKu&on";

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
    die(json_encode(["error" => "Connection failed: " . mysqli_connect_error()]));
}

// Obtener los datos enviados por POST (en formato JSON)
$data = json_decode(file_get_contents("php://input"), true);

// Verificar si el nombre está presente
if (!isset($data["nombre"])) {
    echo json_encode(["error" => "El campo 'nombre' es obligatorio"]);
    exit();
}

// Insertar el nombre en la base de datos
$nombre = mysqli_real_escape_string($conn, $data["nombre"]); // Escapar caracteres especiales para evitar inyecciones SQL
$sql = "INSERT INTO ejemplo (nombre) VALUES ('$nombre')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["mensaje" => "Nuevo registro creado correctamente"]);
} else {
    echo json_encode(["error" => "Error al insertar: " . mysqli_error($conn)]);
}

// Cerrar la conexión
mysqli_close($conn);
?>
