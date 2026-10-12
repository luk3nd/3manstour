<?php
declare(strict_types=1);

/**
 * Endpoint del modulo contatti.
 * Riceve una POST (JSON oppure form-encoded) e invia l'email via SMTP (PHPMailer).
 *
 * La configurazione SMTP si legge in quest'ordine:
 *   1) file locale NON versionato (consigliato su Plesk, non viene toccato dai deploy):
 *        - <document root>/../api-config.local.php   (fuori dalla document root)
 *        - api/config.local.php                      (accanto a questo script)
 *   2) variabili d'ambiente (vedi .env / .env.example).
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/** Ritorna JSON ed esce. */
function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Legge una variabile d'ambiente con fallback. */
function env(string $key, string $default = ''): string
{
    $value = getenv($key);
    if ($value === false || $value === '') {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? '';
    }
    return $value !== '' ? (string) $value : $default;
}

/** Conta i caratteri (usa mbstring se disponibile, altrimenti fallback). */
function char_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Metodo non consentito.']);
}

// --- Bootstrap PHPMailer ---------------------------------------------------
$autoload = __DIR__ . '/vendor/autoload.php';
if (!is_file($autoload)) {
    respond(500, [
        'ok' => false,
        'error' => 'Configurazione server incompleta: esegui "composer install" in public/api.',
    ]);
}
require $autoload;

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

// --- Configurazione --------------------------------------------------------
// Priorità: 1) file locale non versionato  2) variabili d'ambiente.
$localConfig = [];
foreach ([
    dirname(__DIR__, 2) . '/api-config.local.php', // fuori dalla document root (consigliato)
    __DIR__ . '/config.local.php',                 // accanto a questo script
] as $localFile) {
    if (is_file($localFile)) {
        $loaded = require $localFile;
        if (is_array($loaded)) {
            $localConfig = $loaded;
            break;
        }
    }
}

/** Legge la configurazione locale o, in mancanza, le variabili d'ambiente. */
function cfg(string $key, string $default = ''): string
{
    global $localConfig;
    $value = $localConfig[$key] ?? env($key, '');
    return $value !== '' ? (string) $value : $default;
}

$smtpHost   = cfg('SMTP_HOST');
$smtpPort   = (int) cfg('SMTP_PORT', '587');
$smtpUser   = cfg('SMTP_USER');
$smtpPass   = cfg('SMTP_PASS');
$smtpSecure = strtolower(trim(cfg('SMTP_SECURE', 'tls'))); // ssl | ssl/tls | tls | none
$mailFrom   = cfg('MAIL_FROM', $smtpUser);
$mailFromNm = cfg('MAIL_FROM_NAME', 'Sito web');
$mailTo     = cfg('CONTACT_TO', $mailFrom);

// --- Lettura input ---------------------------------------------------------
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (str_contains($contentType, 'application/json')) {
    $data = json_decode((string) file_get_contents('php://input'), true) ?: [];
} else {
    $data = $_POST;
}

$name     = trim((string) ($data['name'] ?? ''));
$email    = trim((string) ($data['email'] ?? ''));
$subject  = trim((string) ($data['subject'] ?? ''));
$message  = trim((string) ($data['message'] ?? ''));
$honeypot = trim((string) ($data['company'] ?? ''));

// Antispam: se l'honeypot è compilato, è un bot. Fingiamo successo.
if ($honeypot !== '') {
    respond(200, ['ok' => true]);
}

// --- Validazione -----------------------------------------------------------
$errors = [];
if ($name === '' || char_length($name) > 120) {
    $errors[] = 'Inserisci un nome valido.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Inserisci un indirizzo email valido.';
}
if ($subject === '' || char_length($subject) > 200) {
    $errors[] = 'Inserisci un oggetto valido.';
}
if ($message === '' || char_length($message) > 5000) {
    $errors[] = 'Inserisci un messaggio valido (max 5000 caratteri).';
}
if ($errors) {
    respond(422, ['ok' => false, 'error' => implode(' ', $errors)]);
}

// --- Invio -----------------------------------------------------------------
if ($smtpHost === '' || $mailTo === '') {
    error_log('[contact] SMTP non configurato. Da ' . $email . ' — ' . $subject);
    respond(500, [
        'ok' => false,
        'error' => 'Il modulo non è ancora configurato per l\'invio. Riprova più tardi.',
    ]);
}

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host    = $smtpHost;
    $mail->Port    = $smtpPort;
    $mail->SMTPAuth = $smtpUser !== '';
    $mail->CharSet = 'UTF-8';
    $mail->Timeout = 15;

    if ($smtpUser !== '') {
        $mail->Username = $smtpUser;
        $mail->Password = $smtpPass;
    }

    // Riconosce "ssl", "ssl/tls", "smtps"; la porta 465 implica sempre TLS implicito.
    if (str_contains($smtpSecure, 'ssl') || $smtpPort === 465) {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } elseif ($smtpSecure === 'none') {
        $mail->SMTPAutoTLS = false;
        $mail->SMTPSecure = '';
    } else {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    }

    $mail->setFrom($mailFrom, $mailFromNm);
    $mail->addReplyTo($email, $name);
    $mail->addAddress($mailTo);

    $mail->Subject = '[Sito] ' . $subject;
    $mail->isHTML(false);
    $mail->Body =
        "Nuovo messaggio dal modulo contatti\n\n" .
        "Nome: {$name}\n" .
        "Email: {$email}\n" .
        "Oggetto: {$subject}\n\n" .
        "Messaggio:\n{$message}\n";

    $mail->send();
    respond(200, ['ok' => true]);
} catch (Exception $e) {
    error_log('[contact] Errore invio: ' . $e->getMessage());
    respond(500, ['ok' => false, 'error' => 'Invio non riuscito. Riprova più tardi.']);
}
