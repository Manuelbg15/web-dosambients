<?php
/**
 * Envío del formulario de contacto de www.dosambients.es (hosting Hostalia).
 * - Remitente: web@dosambients.es (debe existir en el hosting).
 * - Destino:   info@dosambients.es
 * - Antispam:  campo oculto "website" (honeypot) + comprobación de método y longitud.
 */

$to       = 'info@dosambients.es';
$from     = 'web@dosambients.es';
$siteName = 'Dos Ambients';
$okUrl    = '/gracias/';
$errorUrl = '/contacto/?error=1';

function redirect_to($url) {
    header('Location: ' . $url, true, 303);
    exit;
}

function clean($value, $max = 500) {
    $value = trim((string) $value);
    $value = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $value);
    return mb_substr(strip_tags($value), 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect_to('/contacto/');
}

// Honeypot: si un bot lo rellena, fingimos éxito y no enviamos nada.
if (!empty($_POST['website'])) {
    redirect_to($okUrl);
}

$nombre     = clean($_POST['nombre'] ?? '', 100);
$email      = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$telefono   = clean($_POST['telefono'] ?? '', 30);
$asunto     = clean($_POST['asunto'] ?? '', 150);
$mensaje    = trim(strip_tags((string) ($_POST['mensaje'] ?? '')));
$privacidad = !empty($_POST['privacidad']);

if ($nombre === '' || !$email || $mensaje === '' || !$privacidad || mb_strlen($mensaje) > 5000) {
    redirect_to($errorUrl);
}

$subject = '[Web ' . $siteName . '] ' . ($asunto !== '' ? $asunto : 'Nuevo mensaje de contacto');
$body  = "Nuevo mensaje desde el formulario de contacto de www.dosambients.es\n\n";
$body .= "Nombre:   $nombre\n";
$body .= "Email:    $email\n";
$body .= "Teléfono: " . ($telefono !== '' ? $telefono : '-') . "\n";
$body .= "Asunto:   " . ($asunto !== '' ? $asunto : '-') . "\n\n";
$body .= "Mensaje:\n$mensaje\n\n";
$body .= "--\nIP: " . ($_SERVER['REMOTE_ADDR'] ?? '-') . " · " . date('d/m/Y H:i') . "\n";

$headers  = 'From: ' . $siteName . ' <' . $from . ">\r\n";
$headers .= 'Reply-To: ' . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$sent = mail($to, $encodedSubject, $body, $headers, '-f' . $from);

redirect_to($sent ? $okUrl : $errorUrl);
