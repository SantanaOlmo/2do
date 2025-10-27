<?php
$conn = new mysqli('mysql', 'root', 'password', 'mi_basedatos');

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

echo "¡Conexión a MySQL exitosa!";
?>
