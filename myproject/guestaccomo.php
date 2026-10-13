<?php /* GUEST ACCOMMODATIONS PAGE - opened from the "View all Accommodations" button (accomodation.php) */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Accommodations | On Shore Pool &amp; Beach Resort</title>

    <!-- Fallback fonts only (used when style.css does not define --font-hero / --font-nav) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Italiana&family=Jost:wght@400;500;700&display=swap" rel="stylesheet">

    <!-- Same fonts/variables as the home page -->
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/home.css">
    <link rel="stylesheet" href="assets/css/guestaccomo.css">
    <link rel="stylesheet" href="assets/css/book_acco_faci.css">
</head>
<body class="ga-body">

    <!-- ===== HEADER: logo left | Home, Accommodations | My Booking right ===== -->
    <header class="ga-header">
        <a class="ga-logo" href="./" aria-label="On Shore Beach Resort - back to home">
            <img src="assets/img/logo.jpg" alt="On Shore Beach Resort">
        </a>
        <nav class="ga-nav" aria-label="Main">
            <ul class="ga-nav-left">
                <li><a href="./#home">Home</a></li>
                <li><a href="#rates" class="active" aria-current="page">Accommodations</a></li>
            </ul>
            <ul class="ga-nav-right">
                <li><a href="./#my-booking">My Booking</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <!-- ===== HERO: same classes as home.php, so fonts, sizes and the sparkle are identical ===== -->
        <section class="home-section ga-home" id="top">
            <div class="home-center">
                <p class="home-welcome ga-in" style="--d:.3s">Welcome to</p>
                <h1 class="home-title ga-in" style="--d:.45s"><span class="o">O</span>N SH<span class="o">O</span>RE</h1>
                <p class="home-sub ga-in" style="--d:.7s">Pool &amp; Beach Resort</p>
            </div>

            <div class="ga-bottom">
                <p class="home-tagline ga-in" style="--d:1s">
                    Dive into the crystal blue.<br>
                    Where poolside luxury<br>
                    meets the ocean breeze.
                </p>

                <ul class="ga-foot ga-in" style="--d:1.1s">
                    <li class="ga-foot-booking"><a href="./#my-booking">My Booking</a></li>
                    <li><a href="./#about">About Us</a></li>
                    <li><a href="./#contact">Contact</a></li>
                </ul>
            </div>
        </section>

        <!-- ===== POOL / BEACH / RULES (below the hero; the hero photo fades into this section) ===== -->
        <section class="ga-info" id="info" aria-label="Swimming pool, beach and rules">
            <div class="ga-info-grid">

                <!-- Swimming Pool -->
                <div class="ga-col ga-col-pool ga-reveal" style="--d:.05s">
                    <header class="ga-colhead">
                        <h2>Swimming Pool</h2>
                        <p>Operating Hours:<br>8:00 am &ndash; 10:00 pm</p>
                    </header>
                    <figure class="ga-frame ga-frame-pool">
                        <div class="ga-photo" role="button" tabindex="0" aria-label="View larger photo: Swimming Pool"><img src="assets/img/pool1.jpg" alt="Swimming pool with the painted swing mural" style="object-position:center 60%"></div>
                    </figure>
                </div>

                <!-- Beach + access -->
                <div class="ga-col ga-col-beach ga-reveal" style="--d:.2s">
                    <header class="ga-colhead">
                        <h2>Beach</h2>
                        <p>Operating Hours:<br>6:00am &ndash; 7:00pm</p>
                    </header>
                    <figure class="ga-frame ga-frame-beach">
                        <div class="ga-photo" role="button" tabindex="0" aria-label="View larger photo: Beach"><img src="assets/img/beach1.jpg" alt="Sunset over the beach" style="object-position:center 45%"></div>
                    </figure>
                    <div class="ga-access">
                        <h3>Access:</h3>
                        <ul>
                            <li>Cottage &ndash; pool &amp; beach included</li>
                            <li>Room &ndash; pool &amp; beach included</li>
                            <li>Tree House &ndash; pool &amp; beach included</li>
                            <li>Swimming Only &ndash; Entrance Fee</li>
                        </ul>
                    </div>
                </div>

                <!-- Rules -->
                <div class="ga-col ga-col-rules ga-reveal" style="--d:.35s">
                    <header class="ga-colhead">
                        <h2>Rules &amp; Safety Guidelines</h2>
                    </header>
                    <figure class="ga-frame ga-frame-rules">
                        <div class="ga-photo ga-photo-rules" role="button" tabindex="0" aria-label="View larger photo: Rules and Safety Guidelines">
                            <img src="assets/img/rulesG.jpg" alt="On Shore Beach Resort Pool and Beach Rules and Guidelines poster">
                        </div>
                    </figure>
                </div>

            </div>
        </section>

        <!-- ===== ROOMS / COTTAGES / TREE HOUSE: rates + Book now (bookingaccomo.php) ===== -->
        <?php include __DIR__ . '/book_acco_faci.php'; ?>
    </main>

    <!-- ===== PHOTO VIEWER (opens on the same page when a picture is clicked) ===== -->
    <div class="ga-lb" id="gaLightbox" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
        <button type="button" class="ga-lb-close" aria-label="Close photo">
            <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </button>
        <button type="button" class="ga-lb-nav ga-lb-prev" aria-label="Previous photo">
            <svg viewBox="0 0 10 14" width="12" height="16" aria-hidden="true"><path d="M8 1L2 7l6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <figure class="ga-lb-figure">
            <img src="" alt="">
            <figcaption></figcaption>
        </figure>
        <button type="button" class="ga-lb-nav ga-lb-next" aria-label="Next photo">
            <svg viewBox="0 0 10 14" width="12" height="16" aria-hidden="true"><path d="M2 1l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
    </div>

    <script>
        (function () {
            var header = document.querySelector('.ga-header');
            var hero   = document.querySelector('.ga-home');

            /* header turns cream with brown text once the cream section reaches it */
            function onScroll() {
                if (!header || !hero) return;
                header.classList.toggle('is-light', hero.getBoundingClientRect().bottom <= header.offsetHeight + 40);
            }
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll);
            onScroll();

            /* reveal the columns as they scroll into view */
            var els = document.querySelectorAll('.ga-reveal');
            if ('IntersectionObserver' in window) {
                var io = new IntersectionObserver(function (en) {
                    en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
                }, { threshold: 0.12 });
                els.forEach(function (el) { io.observe(el); });
            } else { els.forEach(function (el) { el.classList.add('in-view'); }); }


            /* ---------- photo viewer: click a picture to see it larger, without leaving the page ---------- */
            var lb = document.getElementById('gaLightbox');
            if (lb) {
                var lbImg = lb.querySelector('.ga-lb-figure img');
                var lbCap = lb.querySelector('figcaption');
                var lbClose = lb.querySelector('.ga-lb-close');
                var photos = Array.prototype.slice.call(document.querySelectorAll('.ga-info .ga-photo'));
                var shots = photos.map(function (ph) {
                    var img = ph.querySelector('img');
                    return { src: img.getAttribute('src'), alt: img.alt,
                             caption: (ph.getAttribute('aria-label') || '').replace('View larger photo: ', '') };
                });
                var cur = 0, lastFocus = null, closeTimer = null;

                function show(i, animate) {
                    cur = (i + shots.length) % shots.length;
                    lbImg.classList.add('swap');
                    lbImg.src = shots[cur].src;
                    lbImg.alt = shots[cur].alt;
                    lbCap.textContent = shots[cur].caption;
                    if (animate) { void lbImg.offsetWidth; lbImg.classList.remove('swap'); }
                }
                function open(i) {
                    clearTimeout(closeTimer);
                    lastFocus = document.activeElement;
                    lb.classList.remove('closing');
                    show(i, false);
                    lb.hidden = false;
                    void lbImg.offsetWidth;
                    lbImg.classList.remove('swap');
                    document.body.classList.add('ga-lb-open');
                    lbClose.focus({ preventScroll: true });
                }
                function close() {
                    if (lb.hidden || lb.classList.contains('closing')) return;
                    lb.classList.add('closing');
                    closeTimer = setTimeout(function () {
                        lb.hidden = true;
                        lb.classList.remove('closing');
                        document.body.classList.remove('ga-lb-open');
                        if (lastFocus) lastFocus.focus({ preventScroll: true });
                    }, 220);
                }

                photos.forEach(function (ph, i) {
                    ph.addEventListener('click', function () { open(i); });
                    ph.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
                    });
                });
                lb.querySelector('.ga-lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(cur - 1, true); });
                lb.querySelector('.ga-lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(cur + 1, true); });
                lbClose.addEventListener('click', close);
                lb.addEventListener('click', function (e) {          /* click on the dark background closes it */
                    if (e.target === lb || e.target.classList.contains('ga-lb-figure')) close();
                });
                document.addEventListener('keydown', function (e) {
                    if (lb.hidden) return;
                    if (e.key === 'Escape') close();
                    if (e.key === 'ArrowLeft') show(cur - 1, true);
                    if (e.key === 'ArrowRight') show(cur + 1, true);
                });
                var tx = null;                                        /* swipe on phones */
                lb.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
                lb.addEventListener('touchend', function (e) {
                    if (tx === null) return;
                    var dx = e.changedTouches[0].clientX - tx; tx = null;
                    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1), true);
                }, { passive: true });
            }

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            /* fade the page out before going back to index.php */
            document.querySelectorAll('a[href^="./"]').forEach(function (a) {
                a.addEventListener('click', function (e) {
                    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                    e.preventDefault();
                    document.body.classList.add('ga-leaving');
                    setTimeout(function () { window.location.href = a.href; }, 350);
                });
            });
            window.addEventListener('pageshow', function (e) { if (e.persisted) document.body.classList.remove('ga-leaving'); });
        })();
    </script>
</body>
</html>