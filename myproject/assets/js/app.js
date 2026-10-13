document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Scroll animations: reveal elements as they enter the screen ---------- */
    var items = document.querySelectorAll('.reveal, .reveal-fade, .acc-anim');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('in-view');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        items.forEach(function (el) { io.observe(el); });
    } else {
        items.forEach(function (el) { el.classList.add('in-view'); });
    }

    /* ---------- Page scroll: Home button and home logo use the SAME duration ---------- */
    var SCROLL_DURATION = 1300;   // ms, same for the Home button (down) and the logo (up)
    var scrolling = false;
    var header = document.querySelector('.site-header');
    function headerH() { return header ? header.offsetHeight : 0; }
    function targetScrollY(target) {
        var offset = headerH();
        if (header && window.matchMedia('(min-width: 768px)').matches) {
            // Desktop navigation is compact whenever a section target is reached.
            var compactHeaderRem = target.id === 'accommodations' ? 3.5 : 3.75;
            offset = parseFloat(getComputedStyle(document.documentElement).fontSize) * compactHeaderRem;
        }
        return Math.max(0, window.pageYOffset + target.getBoundingClientRect().top - offset);
    }

    // Fixed header: add a shadow once the page has scrolled
    function onScrollHeader() { if (header) header.classList.toggle('is-stuck', window.pageYOffset > 4); }
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();

    // Cross-page links such as guestaccomo's Home link can land before layout settles.
    // Re-align the hash target after the destination page is shown.
    window.addEventListener('pageshow', function () {
        if (!window.location.hash) return;
        var target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        if (!target) return;
        requestAnimationFrame(function () {
            window.scrollTo(0, targetScrollY(target));
            onScrollHeader();
        });
    });

    var cancelScroll = null;
    function scrollToY(targetY, duration) {
        if (cancelScroll) cancelScroll();
        var startY = window.pageYOffset;
        var dist = targetY - startY;
        if (Math.abs(dist) < 1) return;

        var root = document.documentElement;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.scrollTo(0, targetY);
            return;
        }

        var t0 = null, frame = 0, active = true;
        scrolling = true;
        root.style.scrollBehavior = 'auto';
        function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
        function stop() {
            if (!active) return;
            active = false;
            scrolling = false;
            cancelAnimationFrame(frame);
            root.style.scrollBehavior = '';
            window.removeEventListener('touchstart', stop);
            window.removeEventListener('mousedown', stop);
            window.removeEventListener('keydown', stop);
            if (cancelScroll === stop) cancelScroll = null;
        }
        cancelScroll = stop;
        window.addEventListener('touchstart', stop, { passive: true });
        window.addEventListener('mousedown', stop);
        window.addEventListener('keydown', stop);
        function step(ts) {
            if (!active) return;
            if (t0 === null) t0 = ts;
            var p = Math.min((ts - t0) / duration, 1);
            window.scrollTo(0, startY + dist * ease(p));
            if (p < 1) frame = requestAnimationFrame(step); else stop();
        }
        frame = requestAnimationFrame(step);
    }
    // Logo in the home section: back to the top
    document.querySelectorAll('.logo-link, .home-logo, .enjoy-logo, .acc-logo, .fac-logo, .about-logo, .about-foot-logo').forEach(function (logo) {
        logo.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToY(0, SCROLL_DURATION);
        });
    });

    // Header and footer navigation: scroll to the exact section target.
    document.querySelectorAll('a[href="#home"], a[href="#accommodations"], a[href="#facilities"], a[href="#my-booking"], a[href="#about"], a[href="#contact"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            var hash = link.getAttribute('href');
            if (window.location.hash !== hash) window.history.pushState(null, '', hash);
            if (cancelScroll) cancelScroll();
            scrollToY(targetScrollY(target), SCROLL_DURATION);
        });
    });

    window.addEventListener('popstate', function () {
        var target = document.getElementById(window.location.hash.slice(1));
        if (target) {
            if (cancelScroll) cancelScroll();
            scrollToY(targetScrollY(target), SCROLL_DURATION);
        }
    });

    /* ---------- Nav indicator: highlight the link of the section you are in ---------- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-header .nav-links a[href^="#"]'));
    var spyIds = ['home', 'accommodations', 'facilities', 'about', 'contact'];
    var spy = spyIds.map(function (id) {
        var el = document.getElementById(id);
        if (!el) return null;
        var link = navLinks.filter(function (a) { return a.getAttribute('href') === '#' + id; })[0] || null;
        return { el: el, link: link };   // about/contact have no header link: they just clear the indicator
    }).filter(Boolean);
    // The first landing view includes booking, but belongs to Home in the nav indicator.
    var landing = document.getElementById('my-booking');
    var homeLink = navLinks.filter(function (a) { return a.getAttribute('href') === '#home'; })[0] || null;
    if (landing && homeLink) spy.unshift({ el: landing, link: homeLink });

    function updateActiveNav() {
        var probe = headerH() + window.innerHeight * 0.25;   // reading line just below the header
        var current = null;
        spy.forEach(function (s) {
            if (s.el.getBoundingClientRect().top <= probe) current = s;
        });
        var active = current ? current.link : null;
        navLinks.forEach(function (a) {
            var on = a === active;
            a.classList.toggle('active', on);
            if (on) { a.setAttribute('aria-current', 'true'); } else { a.removeAttribute('aria-current'); }
        });
        placeIndicator();
    }
    /* One shared underline: follows the mouse/keyboard focus, returns to the current section */
    var indicator = document.createElement('span');
    indicator.className = 'nav-indicator no-anim';
    indicator.setAttribute('aria-hidden', 'true');
    if (header) header.appendChild(indicator);
    var hoverLink = null;
    var indicatorShown = false;
    var indicatorGroup = null;     // which side (left / right of the logo) the underline is on
    var hopTimer = null;

    function currentTarget() {
        var activeLink = navLinks.filter(function (a) { return a.classList.contains('active'); })[0] || null;
        return hoverLink || activeLink;
    }

    function setPos(target, instant) {
        var hr = header.getBoundingClientRect();
        var lr = target.getBoundingClientRect();
        var trailing = parseFloat(getComputedStyle(target).fontSize) * 0.3;   // letter-spacing after the last letter
        var x = lr.left - hr.left;
        var y = lr.bottom - hr.top - 2;
        var w = Math.max(0, lr.width - trailing);
        if (instant) indicator.classList.add('no-anim');
        indicator.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        indicator.style.width = w + 'px';
        if (instant) {
            void indicator.offsetWidth;
            indicator.classList.remove('no-anim');
        }
    }

    function placeIndicator() {
        var target = currentTarget();
        navLinks.forEach(function (a) { a.classList.toggle('targeted', a === target); });
        if (!target || !header) {
            clearTimeout(hopTimer); hopTimer = null;
            indicator.style.opacity = '0';
            indicatorShown = false;
            indicatorGroup = null;
            return;
        }
        if (hopTimer) return;   // crossing the logo right now; the timer uses the latest target
        var group = target.closest('.nav-links');

        if (!indicatorShown) {            // first appearance: show in place, don't fly in from the corner
            setPos(target, true);
            indicatorGroup = group;
            indicatorShown = true;
        } else if (group !== indicatorGroup) {
            // Moving between the left and right side: never slide across the logo.
            // Fade out here, reappear under the new link.
            indicator.style.opacity = '0';
            hopTimer = setTimeout(function () {
                hopTimer = null;
                var t = currentTarget();
                if (!t) { placeIndicator(); return; }
                setPos(t, true);
                indicatorGroup = t.closest('.nav-links');
                indicator.style.opacity = '1';
            }, 200);
            return;
        } else {
            setPos(target, false);
        }
        indicator.style.opacity = '1';
    }

    navLinks.forEach(function (a) {
        a.addEventListener('mouseenter', function () { hoverLink = a; placeIndicator(); });
        a.addEventListener('focus', function () { hoverLink = a; placeIndicator(); });
        a.addEventListener('blur', function () { hoverLink = null; placeIndicator(); });
    });
    document.querySelectorAll('.site-header .nav-links').forEach(function (ul) {
        ul.addEventListener('mouseleave', function () { hoverLink = null; placeIndicator(); });
    });
    // positions shift while the header's load animation plays and when fonts load
    if (header) header.addEventListener('animationend', placeIndicator);
    window.addEventListener('load', placeIndicator);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeIndicator);

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', updateActiveNav);
    updateActiveNav();

    /* ---------- Facilities: click a picture to view it larger ---------- */
    var lb = document.getElementById('facLightbox');
    if (lb) {
        var lbImg   = lb.querySelector('.fac-lb-figure img');
        var lbCap   = lb.querySelector('.fac-lb-figure figcaption');
        var lbClose = lb.querySelector('.fac-lb-close');
        var frames  = Array.prototype.slice.call(document.querySelectorAll('.fac-frame'));
        var shots   = frames.map(function (f) {
            var img = f.querySelector('img');
            var cap = f.querySelector('figcaption');
            var name = cap ? cap.textContent.trim() : img.alt;
            f.setAttribute('aria-label', 'View ' + name + ' photo');
            return { src: img.getAttribute('src'), alt: img.alt, caption: name };
        });
        var current = 0, lastFocus = null, closeTimer = null;

        function showShot(i, animate) {
            current = (i + shots.length) % shots.length;
            lbImg.classList.add('swap');
            lbImg.src = shots[current].src;
            lbImg.alt = shots[current].alt;
            lbCap.textContent = shots[current].caption;
            if (animate) {
                void lbImg.offsetWidth;          // restart the zoom-in animation
                lbImg.classList.remove('swap');
            }
        }
        function openLb(i) {
            clearTimeout(closeTimer);
            lastFocus = document.activeElement;
            lb.classList.remove('closing');
            showShot(i, false);
            lb.hidden = false;
            void lbImg.offsetWidth;
            lbImg.classList.remove('swap');
            document.body.classList.add('fac-lb-open');
            lbClose.focus({ preventScroll: true });
        }
        function closeLb() {
            if (lb.hidden || lb.classList.contains('closing')) return;
            lb.classList.add('closing');
            closeTimer = setTimeout(function () {
                lb.hidden = true;
                lb.classList.remove('closing');
                document.body.classList.remove('fac-lb-open');
                if (lastFocus) lastFocus.focus({ preventScroll: true });
            }, 220);
        }

        frames.forEach(function (f, i) {
            f.addEventListener('click', function () { openLb(i); });
            f.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
            });
        });
        lb.querySelector('.fac-lb-prev').addEventListener('click', function (e) { e.stopPropagation(); showShot(current - 1, true); });
        lb.querySelector('.fac-lb-next').addEventListener('click', function (e) { e.stopPropagation(); showShot(current + 1, true); });
        lbClose.addEventListener('click', closeLb);
        // click on the dark background closes it
        lb.addEventListener('click', function (e) {
            if (e.target === lb || e.target.classList.contains('fac-lb-figure')) closeLb();
        });
        document.addEventListener('keydown', function (e) {
            if (lb.hidden) return;
            if (e.key === 'Escape')     closeLb();
            if (e.key === 'ArrowLeft')  showShot(current - 1, true);
            if (e.key === 'ArrowRight') showShot(current + 1, true);
        });
        // swipe on phones
        var touchX = null;
        lb.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
        lb.addEventListener('touchend', function (e) {
            if (touchX === null) return;
            var dx = e.changedTouches[0].clientX - touchX;
            touchX = null;
            if (Math.abs(dx) > 50) showShot(current + (dx < 0 ? 1 : -1), true);
        }, { passive: true });
    }

    /* ---------- About: guest reviews carousel (arrows rotate the cards) ---------- */
    var reviews = document.getElementById('aboutReviews');
    if (reviews) {
        var track = reviews.querySelector('.about-cards');
        function rotate(dir) {
            var cards = track.children;
            if (cards.length < 2) return;
            track.classList.toggle('to-prev', dir < 0);
            if (dir > 0) { track.appendChild(cards[0]); }
            else         { track.insertBefore(cards[cards.length - 1], cards[0]); }
            // restart the slide-in animation on every card
            Array.prototype.forEach.call(cards, function (c) {
                c.style.animation = 'none';
                void c.offsetWidth;
                c.style.animation = '';
            });
        }
        reviews.querySelector('.about-prev').addEventListener('click', function () { rotate(-1); });
        reviews.querySelector('.about-next').addEventListener('click', function () { rotate(1); });
    }

    /* ---------- Booking dates ---------- */
    var checkIn  = document.getElementById('check_in');
    var checkOut = document.getElementById('check_out');
    var stayType = document.getElementById('stay_type');
    if (!checkIn || !checkOut) return;

    var outField = checkOut.closest('.date-field');
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                  'August', 'September', 'October', 'November', 'December'];
    var WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    function pad(n) { return String(n).padStart(2, '0'); }
    function iso(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
    function parse(v) { var p = v.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
    function toISO(dt) { return iso(dt.getFullYear(), dt.getMonth(), dt.getDate()); }
    function addDays(v, n) { var d = parse(v); d.setDate(d.getDate() + n); return toISO(d); }
    function fmt(v) { var p = v.split('-'); return p[1] + '/' + p[2] + '/' + p[0].slice(2); } // 10/06/26

    var TODAY = checkIn.min || toISO(new Date());

    function render() {
        document.getElementById('check_in_text').textContent  = fmt(checkIn.value);
        document.getElementById('check_out_text').textContent = fmt(checkOut.value);
    }

    // Overnight: check-out is at least the next day. Day visit: same date.
    function syncDates() {
        var isDay = stayType && stayType.value === 'day';
        var minOut = isDay ? checkIn.value : addDays(checkIn.value, 1);
        checkOut.min = minOut;
        if (checkOut.value < minOut || isDay) checkOut.value = minOut;
        outField.classList.toggle('disabled', isDay);
    }

    function update() { syncDates(); render(); }

    /* ---------- Custom calendar popup ---------- */
    var pop = document.createElement('div');
    pop.className = 'cal-pop';
    pop.hidden = true;
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', 'Choose a date');
    document.body.appendChild(pop);

    var active = null;            // the <input type="date"> being edited
    var view = { y: 0, m: 0 };    // month on display

    function minFor(input) { return input === checkIn ? TODAY : checkOut.min; }

    var CHEV_L = '<svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M7 1 3 5l4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var CHEV_R = '<svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M3 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function build() {
        var min = minFor(active), sel = active.value;
        var startDow = new Date(view.y, view.m, 1).getDay();
        var days = new Date(view.y, view.m + 1, 0).getDate();
        var minDate = parse(min);
        var canPrev = view.y > minDate.getFullYear() ||
                      (view.y === minDate.getFullYear() && view.m > minDate.getMonth());

        var html = '<div class="cal-head">' +
            '<button type="button" class="cal-nav" data-nav="-1" aria-label="Previous month"' + (canPrev ? '' : ' disabled') + '>' + CHEV_L + '</button>' +
            '<div class="cal-title">' + MONTHS[view.m] + ' ' + view.y + '</div>' +
            '<button type="button" class="cal-nav" data-nav="1" aria-label="Next month">' + CHEV_R + '</button></div>' +
            '<div class="cal-caption">' + (active === checkIn ? 'Check-in date' : 'Check-out date') + '</div>' +
            '<div class="cal-grid cal-week">' + WEEK.map(function (w) { return '<span>' + w + '</span>'; }).join('') + '</div>' +
            '<div class="cal-grid">';

        for (var i = 0; i < startDow; i++) html += '<span></span>';
        for (var d = 1; d <= days; d++) {
            var v = iso(view.y, view.m, d);
            var cls = 'cal-day';
            if (v === sel) cls += ' selected';
            if (v === TODAY) cls += ' today';
            if (v > checkIn.value && v < checkOut.value) cls += ' in-range';
            html += '<button type="button" class="' + cls + '" data-date="' + v + '"' +
                    (v < min ? ' disabled' : '') + '>' + d + '</button>';
        }
        html += '</div>';
        pop.innerHTML = html;
    }

    function position() {
        if (pop.hidden || !active) return;
        var field = active.closest('.date-field');
        var card  = field.closest('.booking-card');
        var fr = field.getBoundingClientRect();
        var cr = card.getBoundingClientRect();
        var pw = pop.offsetWidth, ph = pop.offsetHeight;
        var vw = window.innerWidth, vh = window.innerHeight, gap = 8;
        var left, top;

        if (cr.left - pw - gap >= gap) {            // enough room beside the card (desktop)
            left = cr.left - pw - gap;
            top  = fr.top + fr.height / 2 - ph / 2;
        } else {                                    // small screens: open under the field
            left = fr.left;
            top  = fr.bottom + gap;
            if (top + ph > vh - gap) top = fr.top - ph - gap;
        }
        left = Math.max(gap, Math.min(left, vw - pw - gap));
        top  = Math.max(gap, Math.min(top,  vh - ph - gap));
        pop.style.left = left + 'px';
        pop.style.top  = top + 'px';
    }

    function openCal(input) {
        active = input;
        var d = parse(input.value || TODAY);
        var minDate = parse(minFor(input));
        if (d < minDate) d = minDate;
        view = { y: d.getFullYear(), m: d.getMonth() };
        build();
        pop.hidden = false;
        position();
        input.closest('.date-field').querySelector('.cal-btn').setAttribute('aria-expanded', 'true');
        var target = pop.querySelector('.selected') || pop.querySelector('.cal-day:not([disabled])');
        if (target) target.focus({ preventScroll: true });
    }

    function closeCal(returnFocus) {
        if (pop.hidden) return;
        pop.hidden = true;
        var field = active && active.closest('.date-field');
        if (field) {
            var btn = field.querySelector('.cal-btn');
            btn.setAttribute('aria-expanded', 'false');
            if (returnFocus) btn.focus({ preventScroll: true });
        }
        active = null;
    }

    pop.addEventListener('click', function (e) {
        e.stopPropagation();   // the calendar re-renders itself, so don't let the outside-click handler see a detached target
        var nav = e.target.closest('[data-nav]');
        if (nav) {
            view.m += +nav.dataset.nav;
            if (view.m < 0)  { view.m = 11; view.y--; }
            if (view.m > 11) { view.m = 0;  view.y++; }
            build();
            position();
            return;
        }
        var day = e.target.closest('[data-date]');
        if (day && !day.disabled) {
            var wasCheckIn = (active === checkIn);
            active.value = day.dataset.date;
            update();
            // After choosing check-in (overnight stay), move straight on to check-out
            if (wasCheckIn && !(stayType && stayType.value === 'day')) {
                closeCal(false);
                openCal(checkOut);
            } else {
                closeCal(true);
            }
        }
    });

    document.querySelectorAll('.date-field').forEach(function (field) {
        var input = field.querySelector('input[type="date"]');
        field.addEventListener('click', function () {
            if (field.classList.contains('disabled')) return;
            if (!pop.hidden && active === input) { closeCal(false); } else { openCal(input); }
        });
    });

    document.addEventListener('click', function (e) {
        if (pop.hidden) return;
        if (!pop.contains(e.target) && !e.target.closest('.date-field')) closeCal(false);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeCal(true);
    });
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);

    if (stayType) stayType.addEventListener('change', function () { closeCal(false); update(); });




    update();
});
