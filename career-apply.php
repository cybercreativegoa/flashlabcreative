<?php
/**
 * career-apply.php — Direct email delivery for Flashlab Creative Careers
 * Sends application details and attached resume (up to 2MB) via server mailer
 * Sender displayed in inbox: "Flashlab Creative Enquiry"
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed. Use POST.']);
    exit;
}

// Target email configuration
$to_email      = 'careers@flashlabcreative.com';
$cc_email      = 'flashlabhr@gmail.com';
$from_name     = 'Flashlab Creative Enquiry';
$from_email    = 'enquiry@' . ($_SERVER['HTTP_HOST'] ?? 'flashlabcreative.com');

// Extract subject & candidate information
$subject = !empty($_POST['_subject']) ? trim($_POST['_subject']) : 'New Career Application — Flashlab Creative';
$candidate_email = !empty($_POST['Email']) ? trim($_POST['Email']) : (!empty($_POST['_replyto']) ? trim($_POST['_replyto']) : '');
$candidate_name  = !empty($_POST['Candidate Name']) ? trim($_POST['Candidate Name']) : (!empty($_POST['fname']) ? trim($_POST['fname'] . ' ' . ($_POST['lname'] ?? '')) : 'Applicant');

// Validate file attachment (if uploaded)
$file_attachment = null;
if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
    $file_attachment = $_FILES['attachment'];
} elseif (isset($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
    $file_attachment = $_FILES['resume'];
}

if ($file_attachment) {
    $max_size = 2 * 1024 * 1024; // 2MB restriction
    if ($file_attachment['size'] > $max_size) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'File size exceeds the 2MB limit.']);
        exit;
    }
}

// Build HTML email content
$rows_html = '';
$skip_keys = ['_cc', '_subject', '_template', '_captcha', '_replyto'];

foreach ($_POST as $key => $val) {
    if (in_array($key, $skip_keys, true)) continue;
    $clean_key = htmlspecialchars(str_replace('_', ' ', $key));
    $clean_val = nl2br(htmlspecialchars(trim($val)));
    if ($clean_val === '') continue;

    $rows_html .= "<tr>
        <td style=\"padding:10px 14px;border-bottom:1px solid #22252a;color:#8e929b;font-size:13px;font-weight:600;width:35%;background:#111317;\">$clean_key</td>
        <td style=\"padding:10px 14px;border-bottom:1px solid #22252a;color:#ffffff;font-size:14px;background:#16191f;\">$clean_val</td>
    </tr>";
}

$has_file_text = $file_attachment ? htmlspecialchars($file_attachment['name']) . ' (' . round($file_attachment['size'] / 1024, 1) . ' KB)' : 'No file attached';
$rows_html .= "<tr>
    <td style=\"padding:10px 14px;border-bottom:1px solid #22252a;color:#8e929b;font-size:13px;font-weight:600;background:#111317;\">Attached Document</td>
    <td style=\"padding:10px 14px;border-bottom:1px solid #22252a;color:#ABE832;font-size:14px;font-weight:600;background:#16191f;\">$has_file_text</td>
</tr>";

$html_body = "
<!DOCTYPE html>
<html>
<head><meta charset=\"utf-8\"></head>
<body style=\"margin:0;padding:24px;background:#0a0b0e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;\">
  <table role=\"presentation\" style=\"width:100%;max-width:640px;margin:0 auto;background:#16191f;border-radius:12px;overflow:hidden;border:1px solid #282c35;box-shadow:0 12px 36px rgba(0,0,0,0.4);\">
    <tr>
      <td style=\"background:#0f1116;padding:24px 28px;border-bottom:2px solid #ABE832;\">
        <h2 style=\"margin:0 0 6px 0;color:#ABE832;font-size:20px;letter-spacing:0.5px;\">FLASHLAB CREATIVE</h2>
        <p style=\"margin:0;color:#8e929b;font-size:13px;\">New Career &amp; Recruitment Application</p>
      </td>
    </tr>
    <tr>
      <td style=\"padding:24px 28px;\">
        <table role=\"presentation\" style=\"width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;\">
          $rows_html
        </table>
      </td>
    </tr>
    <tr>
      <td style=\"background:#0f1116;padding:16px 28px;border-top:1px solid #22252a;text-align:center;color:#636773;font-size:12px;\">
        Submitted via flashlabcreative.com/career.html &bull; Received " . date('d M Y, h:i A') . "
      </td>
    </tr>
  </table>
</body>
</html>
";

// MIME Multipart Construction
$boundary = '=_FLASHLAB_' . md5(time() . mt_rand());

$headers = [];
$headers[] = 'From: ' . $from_name . ' <' . $from_email . '>';
if (!empty($candidate_email)) {
    $headers[] = 'Reply-To: ' . $candidate_name . ' <' . $candidate_email . '>';
}
$headers[] = 'Cc: ' . $cc_email;
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';
$headers[] = 'X-Mailer: FlashlabCreative/1.0';

$body  = "--" . $boundary . "\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= $html_body . "\r\n\r\n";

if ($file_attachment && is_uploaded_file($file_attachment['tmp_name'])) {
    $file_content = file_get_contents($file_attachment['tmp_name']);
    $encoded_file = chunk_split(base64_encode($file_content));
    $file_mime    = $file_attachment['type'] ?: 'application/octet-stream';
    $file_name    = basename($file_attachment['name']);

    $body .= "--" . $boundary . "\r\n";
    $body .= "Content-Type: " . $file_mime . "; name=\"" . $file_name . "\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= "Content-Disposition: attachment; filename=\"" . $file_name . "\"\r\n\r\n";
    $body .= $encoded_file . "\r\n\r\n";
}

$body .= "--" . $boundary . "--";

// Send email
$headers_str = implode("\r\n", $headers);
$sent = @mail($to_email, $subject, $body, $headers_str);

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Application sent successfully.'
    ]);
} else {
    // If mail server is not configured locally, return informative status
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to send email from server mailer.'
    ]);
}
