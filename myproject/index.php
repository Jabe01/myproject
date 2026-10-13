<?php
session_start();
require_once __DIR__ . '/config/db.php';

$today    = date('Y-m-d');
$tomorrow = date('Y-m-d', strtotime('+1 day'));
$isAjax   = ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'XMLHttpRequest';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $guests    = (int) ($_POST['guests'] ?? 0);
    $stay_type = $_POST['stay_type'] ?? '';
    $check_in  = $_POST['check_in'] ?? '';
    $check_out = $_POST['check_out'] ?? '';

    if ($guests < 1) {
        $flash = ['warning', 'Please select the number of guests.'];
    } elseif (!in_array($stay_type, ['overnight', 'day'], true)) {
        $flash = ['warning', 'Please choose Day or Overnight.'];
    } elseif (!$check_in || !$check_out || $check_out < $check_in) {
        $flash = ['warning', 'Check-out must be on or after check-in.'];
    } elseif ($pdo === null) {
        $flash = ['danger', 'Booking is unavailable right now. Please try again later.'];
    } else {
        try {
            $stmt = $pdo->prepare(
                'INSERT INTO bookings (guests, stay_type, check_in, check_out) VALUES (?, ?, ?, ?)'
            );
            $stmt->execute([$guests, $stay_type, $check_in, $check_out]);
            $flash = ['success', 'Your plan was saved. See you at the beach!'];
        } catch (PDOException $e) {
            $flash = ['danger', 'We could not save your plan. Please try again.'];
        }
    }

    // AJAX request: answer with JSON only (no redirect, no page refresh)
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode(['type' => $flash[0], 'message' => $flash[1]]);
        exit;
    }

    // Fallback when JavaScript is off: Post/Redirect/Get
    $_SESSION['flash'] = $flash;
    header('Location: index.php#my-booking');
    exit;
}

// Read the one-time message (if any) and clear it
$message = '';
$type    = '';
if (!empty($_SESSION['flash'])) {
    [$type, $message] = $_SESSION['flash'];
    unset($_SESSION['flash']);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>On Shore Pool &amp; Beach Resort</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Marcellus&display=swap" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
    <link href="assets/css/home.css" rel="stylesheet">
    <link href="assets/css/accomodation.css" rel="stylesheet">
    <link href="assets/css/facilities.css" rel="stylesheet">
    <link href="assets/css/about.css" rel="stylesheet">
    <script>document.documentElement.className += " js";</script>
</head>
<body>
<div class="page">

<!-- HEADER -->
<header class="site-header">
    <ul class="nav-links nav-left">
        <li class="load-anim" style="--d:.1s"><a href="#home">Home</a></li>
        <li class="load-anim" style="--d:.2s"><a href="#accommodations">Accommodations</a></li>
    </ul>

    <a class="logo-link reveal-fade" href="./">
        <img src="assets/img/logo.jpg" alt="On Shore Beach Resort" class="logo">
    </a>

    <ul class="nav-links nav-right">
        <li class="load-anim" style="--d:.25s"><a href="#facilities">Facilities</a></li>
        <li class="load-anim" style="--d:.3s"><a href="#my-booking">My Booking</a></li>
    </ul>
</header>

<!-- HERO -->
<main class="hero-wrap">
    <section class="hero" id="my-booking">
        <div class="hero-copy">
            <h1 class="hero-title">
                <span class="line load-anim" style="--d:.35s">On Shore</span>
                <span class="line load-anim" style="--d:.5s">Pool &amp; Beach Resort</span>
            </h1>
            <p class="hero-text load-anim" style="--d:.7s">
                We're some indexing resort beach resort's after a lot of thought. We created the
                mited the perfect tropical escape with cozy beach cottages and a variety of
                activities for you and your family. Relax and recharge with us.
            </p>
            <a href="guestaccomo.php#rates" class="btn-brown load-anim" style="--d:.9s">Book Now</a>
        </div>

        <!-- BOOKING CARD -->
        <div class="booking-card reveal-fade" style="--d:.6s" id="booking">
            <div class="booking-head">Booking</div>

            <div class="booking-body">
                <?php if ($message): ?>
                    <div class="alert alert-<?= htmlspecialchars($type) ?>" role="alert"><?= htmlspecialchars($message) ?></div>
                <?php endif; ?>

                <select class="field" id="booking_role" aria-label="Guest type">
                    <option value="guest" selected>GUEST</option>
                    <option value="staff">STAFF</option>
                    <option value="admin">ADMIN</option>
                </select>

                <label class="field-label" for="stay_type">Day / Night:</label>
                <select name="stay_type" id="stay_type" class="field" required>
                    <option value="overnight" selected>Overnight</option>
                    <option value="day">Day</option>
                </select>

                <label class="field-label dates" for="check_in">Dates:</label>
                <div class="date-field">
                    <span class="date-text" id="check_in_text"></span>
                    <button type="button" class="cal-btn" aria-label="Open calendar"><svg class="cal-icon" viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><rect x="1" y="2" width="12" height="11" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M1 5.2h12M4 .8v2.6M10 .8v2.6" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M3.4 7.2h1.4M6.3 7.2h1.4M9.2 7.2h1.4M3.4 9.2h1.4M6.3 9.2h1.4M9.2 9.2h1.4M3.4 11h1.4M6.3 11h1.4" stroke="currentColor" stroke-width="1" fill="none"/></svg></button>
                    <input type="date" name="check_in" id="check_in" aria-label="Check-in date"
                           value="<?= $today ?>" min="<?= $today ?>" required>
                </div>
                <div class="date-field reverse">
                    <span class="date-text" id="check_out_text"></span>
                    <button type="button" class="cal-btn" aria-label="Open calendar"><svg class="cal-icon" viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><rect x="1" y="2" width="12" height="11" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M1 5.2h12M4 .8v2.6M10 .8v2.6" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M3.4 7.2h1.4M6.3 7.2h1.4M9.2 7.2h1.4M3.4 9.2h1.4M6.3 9.2h1.4M9.2 9.2h1.4M3.4 11h1.4M6.3 11h1.4" stroke="currentColor" stroke-width="1" fill="none"/></svg></button>
                    <input type="date" name="check_out" id="check_out" aria-label="Check-out date"
                           value="<?= $tomorrow ?>" min="<?= $today ?>" required>
                </div>

                <a href="guestaccomo.php#rates" class="btn-brown">Plan</a>
            </div>
        </div>
    </section>
</main>

<!-- FOOTER -->
<footer class="site-footer">
    <span class="footer-brand reveal">On Shore Pool &amp; Beach Resort</span>
    <ul class="footer-links reveal" style="--d:.15s">
        <li><a href="#about">About Us</a></li>
        <li><a href="#contact">Contact</a></li>
    </ul>
</footer>

</div><!-- /.page -->

<?php include __DIR__ . '/home.php'; ?>
<?php include __DIR__ . '/accomodation.php'; ?>
<?php include __DIR__ . '/facilities.php'; ?>
<?php include __DIR__ . '/about.php'; ?>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>