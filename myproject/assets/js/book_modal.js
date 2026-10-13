/*
 * assets/js/book_modal.js  -  BOOKING POP-UP for the "Book now" buttons (Accommodations AND Facilities)
 * Used by book_acco_faci.php (it prints window.BK_ITEMS, window.BK_CFG and the pop-up markup).
 *
 * Flow (same as the design):
 *   1) Choose   : photo + details | pick room / cottage / hours / guests | additional fees (optional)  ->  NEXT
 *   2) Checkout : Payment & Reservation Checkout (summary, guest info, 50% down payment, proof of payment)  ->  Confirm
 *   3) Confirm Your Reservation?   (Cancel / Confirm)
 *   4) Thank You for Your Booking! (Okay)
 *
 * Works already without a database. LATER: set $bm_endpoint in book_acco_faci.php (e.g. 'book_save.php').
 * submitBooking() then POSTs FormData { booking: <JSON>, proof: <file> } and expects JSON { ok:true, reference:'...' }.
 * The page also fires a "booking:submitted" event with the same data.
 */
(function () {
    'use strict';

    var modal = document.getElementById('bookModal');
    if (!modal) return;
    var ITEMS = window.BK_ITEMS || {};
    var CFG   = window.BK_CFG || {};
    var DP    = CFG.dp || 50;                 // down payment in percent

    /* ---------- settings ---------- */
    var WEEKEND_DAYS = [0, 6];                // 0 = Sunday ... 6 = Saturday. These days use the weekend rate.
    var MAX_FILE_MB  = 5;
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                  'August', 'September', 'October', 'November', 'December'];
    var WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    var TYPE_LABEL  = { weekday: 'Weekday', weekend: 'Weekend', holiday: 'Holiday' };
    var TYPE_PLURAL = { weekday: 'Weekdays', weekend: 'Weekends', holiday: 'Holiday' };

    /* ---------- elements ---------- */
    function $(id) { return document.getElementById(id); }
    var dialog = modal.querySelector('.bm-dialog');
    var form   = $('bmForm');
    var el = {
        bg: $('bmBg'), logo: $('bmLogo'), title: $('bmTitle'),
        stepSel: $('bmStepSelect'), body1: $('bmBody1'), body2: $('bmBody2'),
        whenWrap: $('bmWhenWrap'), when: $('bmWhen'), cal: $('bmCal'),
        photoLabel: $('bmPhotoLabel'), img: $('bmImg'), info: $('bmInfo'),
        pickTitle: $('bmPickTitle'), pick: $('bmPick'), perks: $('bmPerks'),
        addTitle: $('bmAddTitle'), add: $('bmAdd'), note: $('bmNote'),
        total: $('bmTotal'), msg: $('bmMsg'), another: $('bmAnother'), next: $('bmNext'),
        sumImg: $('bmSumImg'), sumName: $('bmSumName'), sumSub: $('bmSumSub'), sumPax: $('bmSumPax'), sumPrice: $('bmSumPrice'),
        sumDates: $('bmSumDates'), sumBase: $('bmSumBase'), sumAdd: $('bmSumAdd'), sumAddTot: $('bmSumAddTot'),
        name: $('bmName'), email: $('bmEmail'), phone: $('bmPhone'), notes: $('bmNotes'),
        bdSub: $('bmBdSub'), bdDpLbl: $('bmBdDpLbl'), bdDp: $('bmBdDp'), bdPay: $('bmBdPay'), bdBal: $('bmBdBal'), bdNote: $('bmBdNote'),
        modes: $('bmModes'), qr: $('bmQr'), file: $('bmFile'), fileBox: $('bmFileBox'), fileName: $('bmFileName'), ref: $('bmRef'),
        back: $('bmBack'), backLbl: $('bmBackLbl'), legal: $('bmLegal'),
        confirm: $('bmConfirm'), confList: $('bmConfList'), confErr: $('bmConfErr'), confYes: $('bmConfYes'), confNo: $('bmConfNo'),
        thanks: $('bmThanks'), thanksRef: $('bmThanksRef'), thanksOk: $('bmThanksOk')
    };

    /* ---------- state ---------- */
    var S = null;                  // everything the guest picked
    var W = {};                    // the controls of the "when" strip (rebuilt per item)
    var lastFocus = null, closeTimer = null, busy = false;

    /* =====================================================================
       SMALL HELPERS
       ===================================================================== */
    function pad(n) { return String(n).padStart(2, '0'); }
    function iso(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
    function parse(v) { var p = v.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
    function toISO(dt) { return iso(dt.getFullYear(), dt.getMonth(), dt.getDate()); }
    function addDays(v, n) { var d = parse(v); d.setDate(d.getDate() + n); return toISO(d); }
    function nightsBetween(a, b) { return Math.round((parse(b) - parse(a)) / 86400000); }
    function fmtDate(v) { return parse(v).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); }
    function longDate(v) { return parse(v).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
    function dayName(v) { return parse(v).toLocaleDateString('en-US', { weekday: 'long' }); }
    function rangeText(a, b) {
        if (!b || a === b) return longDate(a);
        var d1 = parse(a), d2 = parse(b);
        if (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth())
            return MONTHS[d1.getMonth()] + ' ' + d1.getDate() + ' - ' + d2.getDate() + ', ' + d1.getFullYear();
        return longDate(a) + ' - ' + longDate(b);
    }
    function peso(n) { return '\u20B1' + Number(n).toLocaleString('en-US'); }
    function amt(n) { return n === null || n === undefined ? 'TBA' : (n === 0 ? 'Free' : peso(n)); }
    function rateText(n) { return n === null || n === undefined ? 'TBA' : peso(n); }
    function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
    function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
    function fmtHour(h) {                     // 15 -> 3:00pm, 12 -> 12:00nn, 24 -> 12:00mn
        if (h === 12) return '12:00nn';
        if (h === 24) return '12:00mn';
        return ((h % 12) || 12) + ':00' + (h < 12 ? 'am' : 'pm');
    }

    /* tiny DOM builder: h('div', {class:'x', text:'hi'}, [children]) */
    function h(tag, attrs, kids) {
        var n = document.createElement(tag);
        if (attrs) Object.keys(attrs).forEach(function (k) {
            var v = attrs[k];
            if (v === false || v === null || v === undefined) return;
            if (k === 'class') n.className = v;
            else if (k === 'text') n.textContent = v;
            else n.setAttribute(k, v === true ? '' : v);
        });
        (kids || []).forEach(function (c) {
            if (c === null || c === undefined) return;
            n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
        });
        return n;
    }
    function svg(markup) { var d = document.createElement('div'); d.innerHTML = markup; return d.firstChild; }
    var SVG_CAL   = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 2v3M17 2v3M3.5 9h17M5 4.5h14A1.5 1.5 0 0 1 20.5 6v13A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V6A1.5 1.5 0 0 1 5 4.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
    var SVG_CHECK = '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2.5 6.3 5 8.8l4.6-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var SVG_PLUS  = '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M6 2v8M2 6h8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    var CHEV_L = '<svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M7 1 3 5l4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var CHEV_R = '<svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M3 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    /* =====================================================================
       OPEN / CLOSE
       ===================================================================== */
    function freshState(it) {
        return {
            item: it, step: 'select',
            stay: 'overnight', inISO: '', outISO: '', dateISO: '', holiday: false, period: 'day',
            units: (it.units && it.units.length === 1) ? [it.units[0]] : [],
            hour: it.model === 'event' ? it.hours[0].id : '', tier: it.model === 'event' ? String(it.tiers[0]) : '', start: '',
            kids: 0, adults: 2, pax: 2, dest: it.destinations ? it.destinations[0].name : '', slot: '',
            add: {}, pay: '', calFor: null, view: { y: 0, m: 0 }, today: toISO(new Date()), calc: null
        };
    }

    function openModal(id, trigger) {
        var it = ITEMS[id];
        if (!it) return;
        clearTimeout(closeTimer);
        lastFocus = trigger || document.activeElement;
        S = freshState(it);
        busy = false;

        form.reset();
        clearPayErrors();
        el.confirm.hidden = true;
        el.thanks.hidden = true;
        el.fileName.textContent = 'No file chosen';
        buildSelect();
        buildPay();
        showStep('select', true);
        refresh();

        modal.classList.remove('closing');
        modal.hidden = false;
        document.body.classList.add('bm-open');
        focusFirstControl();
    }

    function closeModal() {
        if (modal.hidden || modal.classList.contains('closing')) return;
        closeCal(false);
        modal.classList.add('closing');
        closeTimer = setTimeout(function () {
            modal.hidden = true;
            modal.classList.remove('closing');
            el.confirm.hidden = true;
            el.thanks.hidden = true;
            document.body.classList.remove('bm-open');
            if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
        }, 220);
    }

    function showStep(name, silent) {
        closeCal(false);
        S.step = name;
        dialog.setAttribute('data-step', name);
        el.stepSel.hidden = name !== 'select';
        form.hidden = name !== 'pay';
        el.title.textContent = name === 'select' ? S.item.title : 'Payment & Reservation Checkout';
        el.body1.scrollTop = 0;
        el.body2.scrollTop = 0;
        if (!silent) { if (name === 'pay') el.name.focus({ preventScroll: true }); else focusFirstControl(); }
    }

    function focusFirstControl() {
        var first = (W['in'] || W.date || {}).btn;
        if (first) first.focus({ preventScroll: true });
    }

    /* =====================================================================
       STEP 1 - BUILD  (everything that depends on the item)
       ===================================================================== */
    function buildSelect() {
        var it = S.item;
        el.photoLabel.textContent = it.photoLabel;
        el.img.src = it.img;
        el.img.alt = it.alt || it.title;
        el.img.style.objectPosition = it.pos || 'center';
        el.bg.style.backgroundImage = 'url("' + it.img + '")';
        el.pickTitle.textContent = it.pickTitle;
        el.addTitle.textContent = it.addTitle;
        el.another.querySelector('span').textContent = it.another;
        el.backLbl.textContent = 'Back to ' + it.photoLabel;
        buildWhen();
        buildPick();
        buildAddons();
        buildPerks();
        buildNote();
    }

    /* ----- the "when" strip: dates, type of stay, start time ... ----- */
    function dateField(key, label) {
        var lblId = 'bmLbl_' + key, valId = 'bmVal_' + key;
        var val = h('span', { id: valId, text: 'Select date' });
        var btn = h('button', { type: 'button', 'class': 'bm-date', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', 'aria-labelledby': lblId + ' ' + valId }, [svg(SVG_CAL), val]);
        btn.addEventListener('click', function () { if (S.calFor === key) closeCal(false); else openCal(key); });
        W[key] = { btn: btn, val: val };
        return h('div', { 'class': 'bm-wf' }, [h('span', { 'class': 'bm-label', id: lblId, text: label }), btn]);
    }

    function segField(label, name, options, current, onPick) {
        var seg = h('div', { 'class': 'bm-seg' });
        options.forEach(function (o) {
            var inp = h('input', { type: 'radio', name: name, value: o.v });
            inp.checked = String(current) === String(o.v);
            inp.addEventListener('change', function () { onPick(o.v); });
            seg.appendChild(h('label', null, [inp, h('span', null, [h('b', { text: o.t }), o.s ? h('small', { text: o.s }) : null])]));
        });
        return h('div', { 'class': 'bm-wf', role: 'radiogroup', 'aria-label': label }, [h('span', { 'class': 'bm-label', text: label }), seg]);
    }

    var activeSelectClose = null;

    function selectField(label, id, options, value, placeholder, onChange) {
        var sel = h('select', { 'class': 'bm-select-native', id: id, tabindex: '-1', 'aria-hidden': 'true' });
        if (placeholder) sel.appendChild(h('option', { value: '', text: placeholder }));
        options.forEach(function (o) { sel.appendChild(h('option', { value: o.v, text: o.t })); });
        sel.value = value;

        var control = h('div', { 'class': 'bm-select-control' });
        var trigger = h('button', {
            type: 'button', 'class': 'bm-select-trigger', role: 'combobox',
            'aria-label': label, 'aria-haspopup': 'listbox', 'aria-expanded': 'false',
            'aria-controls': id + '_list'
        });
        var arrow = svg('<svg viewBox="0 0 10 6" width="12" height="8" aria-hidden="true"><path d="m1 1 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>');
        trigger.appendChild(h('span', { 'class': 'bm-select-value' }));
        trigger.appendChild(arrow);

        function syncValue() {
            var option = sel.options[sel.selectedIndex];
            trigger.querySelector('.bm-select-value').textContent = option ? option.textContent : (placeholder || 'Select');
        }
        function close(returnFocus) {
            if (activeSelectClose === close) activeSelectClose = null;
            trigger.setAttribute('aria-expanded', 'false');
            var menu = document.getElementById(id + '_list');
            if (menu) menu.remove();
            if (returnFocus) trigger.focus({ preventScroll: true });
        }
        function open() {
            if (trigger.disabled) return;
            if (activeSelectClose) activeSelectClose(false);
            var rect = trigger.getBoundingClientRect();
            if (window.innerHeight - rect.bottom < 150) {
                trigger.scrollIntoView({ block: 'nearest', behavior: 'auto' });
                rect = trigger.getBoundingClientRect();
            }
            var menu = h('div', {
                id: id + '_list', 'class': 'bm-select-menu', role: 'listbox',
                'aria-label': label
            });
            var available = Math.max(64, window.innerHeight - rect.bottom - 12);
            menu.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)) + 'px';
            menu.style.top = (rect.bottom + 4) + 'px';
            menu.style.width = rect.width + 'px';
            menu.style.maxHeight = Math.min(176, available) + 'px';

            Array.prototype.forEach.call(sel.options, function (option, index) {
                var item = h('button', {
                    type: 'button', 'class': 'bm-select-option', role: 'option',
                    'aria-selected': option.selected ? 'true' : 'false',
                    'aria-disabled': option.disabled ? 'true' : 'false',
                    text: option.textContent
                });
                item.disabled = option.disabled;
                item.addEventListener('click', function () {
                    sel.selectedIndex = index;
                    syncValue();
                    close(true);
                    sel.dispatchEvent(new Event('change', { bubbles: true }));
                });
                item.addEventListener('keydown', function (event) {
                    var buttons = menu.querySelectorAll('.bm-select-option:not(:disabled)');
                    var current = Array.prototype.indexOf.call(buttons, item);
                    var next = event.key === 'ArrowDown' ? current + 1 : event.key === 'ArrowUp' ? current - 1 : -1;
                    if (event.key === 'Home') next = 0;
                    if (event.key === 'End') next = buttons.length - 1;
                    if (next >= 0) { event.preventDefault(); if (buttons[next]) buttons[next].focus(); }
                    if (event.key === 'Escape') { event.preventDefault(); close(true); }
                    if (event.key === 'Tab') {
                        var focusables = Array.prototype.filter.call(modal.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'), function (node) { return node.getClientRects().length > 0; });
                        var triggerIndex = focusables.indexOf(trigger);
                        var nextFocus = focusables[triggerIndex + (event.shiftKey ? -1 : 1)];
                        close(false);
                        if (nextFocus) { event.preventDefault(); nextFocus.focus(); }
                    }
                });
                menu.appendChild(item);
            });
            modal.appendChild(menu);
            trigger.setAttribute('aria-expanded', 'true');
            activeSelectClose = close;
            var selected = menu.querySelector('[aria-selected="true"]') || menu.querySelector('.bm-select-option:not(:disabled)');
            if (selected) selected.focus({ preventScroll: true });
        }

        syncValue();
        trigger.addEventListener('click', function () {
            if (trigger.getAttribute('aria-expanded') === 'true') close(false);
            else open();
        });
        trigger.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); open();
            }
        });
        sel.addEventListener('change', function () { syncValue(); onChange(sel.value); });
        sel.addEventListener('bm:sync', syncValue);
        sel.focus = function (opts) { trigger.focus(opts); };
        control.appendChild(trigger);
        control.appendChild(sel);
        var wrap = h('div', { 'class': 'bm-wf' }, [h('span', { 'class': 'bm-label', text: label }), control]);
        return { sel: sel, wrap: wrap };
    }

    document.addEventListener('click', function (event) {
        if (activeSelectClose && !event.target.closest('.bm-select-trigger') && !event.target.closest('.bm-select-menu')) activeSelectClose(false);
    });
    [el.stepSel, form, el.body1, el.body2].forEach(function (node) {
        node.addEventListener('scroll', function () { if (activeSelectClose) activeSelectClose(false); });
    });
    window.addEventListener('resize', function () { if (activeSelectClose) activeSelectClose(false); });
    function buildWhen() {
        var it = S.item;
        clear(el.when);
        W = {};
        if (it.model === 'stay') {
            el.when.appendChild(segField('Type of stay', 'bmStay', [
                { v: 'day', t: 'Day Tour', s: it.times.day },
                { v: 'overnight', t: 'Overnight', s: it.times.overnight }
            ], S.stay, function (v) {
                S.stay = v;
                if (v === 'overnight' && S.inISO && (!S.outISO || S.outISO <= S.inISO)) S.outISO = addDays(S.inISO, 1);
                closeCal(false);
                refresh();
            }));
            el.when.appendChild(dateField('in', 'Check-in'));
            el.when.appendChild(dateField('out', 'Check-out'));
            var cb = h('input', { type: 'checkbox', id: 'bmHoliday' });
            cb.addEventListener('change', function () { S.holiday = cb.checked; refresh(); });
            el.when.appendChild(h('label', { 'class': 'bm-check' }, [cb, h('span', null, ['Holiday / special date', h('small', { text: 'Uses the holiday rate.' })])]));
        } else {
            el.when.appendChild(dateField('date', it.model === 'event' ? 'Event date' : 'Date'));
            if (it.model === 'pool') {
                el.when.appendChild(segField('Swimming time', 'bmPeriod', [{ v: 'day', t: 'Day' }, { v: 'night', t: 'Night' }], S.period, function (v) { S.period = v; refresh(); }));
            }
            if (it.model === 'event') {
                var f = selectField('Start time', 'bmStart', [], '', 'Select start time', function (v) { S.start = v; refresh(); });
                W.start = f.sel;
                el.when.appendChild(f.wrap);
                fillStartOptions();
            }
        }
    }

    function eventHour() {
        var it = S.item, i;
        for (i = 0; i < it.hours.length; i++) if (it.hours[i].id === S.hour) return it.hours[i];
        return it.hours[0];
    }

    function fillStartOptions() {
        if (!W.start) return;
        var it = S.item, max = eventHour().max, last = 24 - max, sel = W.start;
        clear(sel);
        sel.appendChild(h('option', { value: '', text: 'Select start time' }));
        for (var t = it.startMin; t <= last; t++) sel.appendChild(h('option', { value: String(t), text: fmtHour(t) }));
        if (S.start && (+S.start < it.startMin || +S.start > last)) S.start = '';
        sel.value = S.start;
        sel.dispatchEvent(new Event('bm:sync'));
    }

    /* ----- column 1: what to pick ----- */
    function buildPick() {
        var it = S.item;
        clear(el.pick);

        if (it.model === 'stay' || it.model === 'event') {
            var isHours = it.model === 'event';
            var list = isHours ? it.hours.map(function (x) { return { key: x.id, text: x.label }; })
                               : it.units.map(function (u) { return { key: u, text: u }; });
            var two = list.length > 5;
            var grid = h('div', { 'class': 'bm-units' + (two ? ' two' : ''), role: 'group', 'aria-label': it.pickTitle });
            grid.style.setProperty('--rows', Math.ceil(list.length / (two ? 2 : 1)));
            list.forEach(function (o) {
                var b = h('button', { type: 'button', 'class': 'bm-unit', 'data-key': o.key, 'aria-pressed': 'false', text: o.text });
                b.addEventListener('click', function () { pickUnit(o.key); });
                grid.appendChild(b);
            });
            el.pick.appendChild(grid);

            if (isHours) {
                var tiers = it.tiers.map(function (t) { return { v: String(t), t: t + ' pax' }; });
                el.pick.appendChild(h('div', { 'class': 'bm-pickx' }, [segField('Capacity', 'bmTier', tiers, S.tier, function (v) { S.tier = v; refresh(); })]));
            }
        }

        if (it.model === 'pool') {
            var kids = [], adults = [], i;
            for (i = 0; i <= 30; i++) kids.push({ v: String(i), t: String(i) });
            for (i = 0; i <= 60; i++) adults.push({ v: String(i), t: String(i) });
            var fk = selectField('1\u20136 years old:', 'bmKids', kids, String(S.kids), '', function (v) { S.kids = +v; refresh(); });
            var fa = selectField('7 years old & above:', 'bmAdults', adults, String(S.adults), '', function (v) { S.adults = +v; refresh(); });
            W.kids = fk.sel; W.adults = fa.sel;
            el.pick.appendChild(h('div', { 'class': 'bm-pickx' }, [fk.wrap, fa.wrap]));
        }

        if (it.model === 'boat') {
            var pax = [];
            for (var p = 1; p <= it.pax; p++) pax.push({ v: String(p), t: String(p) });
            var fp = selectField('Passenger:', 'bmPax', pax, String(S.pax), '', function (v) { S.pax = +v; refresh(); });
            var fd = selectField('Destination:', 'bmDest', it.destinations.map(function (d) { return { v: d.name, t: d.name }; }), S.dest, '', function (v) { S.dest = v; refresh(); });
            var fs = selectField('Time:', 'bmSlot', it.slots.map(function (s) { return { v: s, t: s }; }), S.slot, 'Select time', function (v) { S.slot = v; refresh(); });
            W.pax = fp.sel; W.dest = fd.sel; W.slot = fs.sel;
            el.pick.appendChild(h('div', { 'class': 'bm-pickx' }, [fp.wrap, fd.wrap, fs.wrap]));
        }
    }

    function pickUnit(key) {
        var it = S.item;
        if (it.model === 'event') { S.hour = key; fillStartOptions(); refresh(); return; }
        if (busyUnits().indexOf(key) > -1) return;
        var i = S.units.indexOf(key);
        if (!it.multi) S.units = [key];
        else if (i > -1) S.units.splice(i, 1);
        else S.units.push(key);
        refresh();
    }

    /* ----- column 2: additional fees ----- */
    function addMax(a) {
        if (a.maxPerUnit) return Math.max(1, S.units.length) * a.maxPerUnit;
        return a.max || 99;
    }

    function buildAddons() {
        var it = S.item, lastGroup = null;
        clear(el.add);
        it.addons.forEach(function (a) {
            if (a.group && a.group !== lastGroup) el.add.appendChild(h('p', { 'class': 'bm-add-group', text: a.group }));
            lastGroup = a.group || null;

            var priceTxt = a.priceText || (a.price === null ? '\u20B1?' : peso(a.price) + (a.per || ''));
            var tog = h('button', { type: 'button', 'class': 'bm-add-tog', 'aria-pressed': 'false', 'aria-label': 'Add ' + a.sum }, [svg(SVG_PLUS)]);
            var out = h('output', { 'aria-live': 'polite', text: '1' });
            var minus = h('button', { type: 'button', 'aria-label': 'Less ' + a.sum, text: '\u2212' });
            var plus = h('button', { type: 'button', 'aria-label': 'More ' + a.sum, text: '+' });
            var qty = h('div', { 'class': 'bm-qty', hidden: true }, [minus, out, plus]);
            var row = h('div', { 'class': 'bm-add' + (a.group ? ' in-group' : ''), 'data-add': a.id }, [
                tog,
                h('span', { 'class': 'bm-add-label' }, [a.label + ': ', h('b', { text: priceTxt })]),
                qty
            ]);
            tog.addEventListener('click', function () { S.add[a.id] = S.add[a.id] ? 0 : 1; refresh(); });
            minus.addEventListener('click', function () { S.add[a.id] = Math.max(0, (S.add[a.id] || 0) - 1); refresh(); });
            plus.addEventListener('click', function () { S.add[a.id] = Math.min(addMax(a), (S.add[a.id] || 0) + 1); refresh(); });
            el.add.appendChild(row);
        });
    }

    function buildPerks() {
        clear(el.perks);
        el.perks.hidden = !S.item.perks;
        if (!S.item.perks) return;
        (CFG.perks || []).forEach(function (p) {
            el.perks.appendChild(h('li', null, [h('i', { 'aria-hidden': 'true' }, [svg(SVG_CHECK)]), p]));
        });
    }

    function buildNote() {
        var it = S.item;
        clear(el.note);
        el.note.hidden = true;
        if (it.model === 'pool') {
            var r = it.rates;
            el.note.hidden = false;
            el.note.appendChild(h('p', { 'class': 'bm-note-h', text: 'Swimming Pool Access Only:' }));
            el.note.appendChild(h('p', { text: 'Entrance Fee:' }));
            el.note.appendChild(h('ul', null, [
                h('li', { text: '1\u20136 years old: ' + rateText(r.kid) }),
                h('li', { text: '7 years old & above: Day ' + rateText(r.adultDay) + ', Night ' + rateText(r.adultNight) })
            ]));
        }
        if (it.model === 'boat') {
            el.note.hidden = false;
            el.note.appendChild(h('p', { text: 'Minimum rate ' + rateText(it.destinations[0].rate) + ' for up to ' + it.pax + ' pax (' + it.hours + ' hours). The final rate depends on the destination. Rental only, no activities.' }));
        }
    }

    /* =====================================================================
       STEP 1 - REFRESH  (everything that depends on the current choices)
       ===================================================================== */
    function datesOfStay() {
        if (S.item.model !== 'stay') return S.dateISO ? [S.dateISO] : [];
        if (!S.inISO) return [];
        if (S.stay === 'day' || !S.outISO) return [S.inISO];
        var out = [], n = nightsBetween(S.inISO, S.outISO);
        for (var i = 0; i < n; i++) out.push(addDays(S.inISO, i));
        return out;
    }

    function busyUnits() {
        var map = (CFG.unavailable || {})[S.item.id] || {}, out = [];
        datesOfStay().forEach(function (d) { (map[d] || []).forEach(function (u) { if (out.indexOf(u) < 0) out.push(u); }); });
        return out;
    }

    function refresh() {
        var it = S.item, isDay = S.stay === 'day';
        el.msg.hidden = true;

        /* dates stay consistent with the stay type */
        if (it.model === 'stay' && S.inISO) {
            if (isDay) S.outISO = S.inISO;
            else if (!S.outISO || S.outISO <= S.inISO) S.outISO = '';
        }
        if (W['in']) {
            W['in'].val.textContent = S.inISO ? fmtDate(S.inISO) : 'Select date';
            W['in'].btn.classList.toggle('has-value', !!S.inISO);
            W.out.val.textContent = isDay ? 'Same day' : (S.outISO ? fmtDate(S.outISO) : 'Select date');
            W.out.btn.classList.toggle('has-value', !isDay && !!S.outISO);
            W.out.btn.disabled = isDay;
        }
        if (W.date) {
            W.date.val.textContent = S.dateISO ? fmtDate(S.dateISO) : 'Select date';
            W.date.btn.classList.toggle('has-value', !!S.dateISO);
        }

        /* unit / hour buttons */
        var na = it.model === 'stay' ? busyUnits() : [];
        S.units = S.units.filter(function (u) { return na.indexOf(u) < 0; });
        Array.prototype.forEach.call(el.pick.querySelectorAll('.bm-unit'), function (b) {
            var key = b.getAttribute('data-key');
            var on = it.model === 'event' ? key === S.hour : S.units.indexOf(key) > -1;
            var off = na.indexOf(key) > -1;
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
            b.classList.toggle('na', off);
            b.setAttribute('aria-disabled', off ? 'true' : 'false');
            b.title = off ? 'Not available on your dates' : '';
        });

        /* add-ons */
        it.addons.forEach(function (a) {
            var row = el.add.querySelector('[data-add="' + a.id + '"]');
            if (!row) return;
            var max = addMax(a), q = Math.min(S.add[a.id] || 0, max);
            S.add[a.id] = q;
            var qtyBox = row.querySelector('.bm-qty'), btns = qtyBox.querySelectorAll('button');
            row.querySelector('.bm-add-tog').setAttribute('aria-pressed', q > 0 ? 'true' : 'false');
            row.classList.toggle('on', q > 0);
            qtyBox.hidden = !(q > 0 && max > 1);
            qtyBox.querySelector('output').textContent = q;
            btns[1].disabled = q >= max;
        });

        renderInfo();
        var r = calc();
        S.calc = r;
        el.total.textContent = r.hasBase ? peso(r.subtotal) + (r.tba ? ' + TBA' : '') : '\u2014';
        el.next.classList.toggle('is-off', !r.ok);
        el.next.setAttribute('aria-disabled', r.ok ? 'false' : 'true');
    }

    /* the info box under the photo (same details as the design) */
    function stayDaysText() {
        var dates = datesOfStay();
        if (!dates.length) return null;
        var seen = [];
        dates.forEach(function (d) { var t = dayType(d); if (seen.indexOf(t) < 0) seen.push(t); });
        var names = S.stay === 'day' || !S.outISO ? dayName(S.inISO) : dayName(S.inISO) + '\u2013' + dayName(S.outISO);
        return (seen.length === 1 ? TYPE_PLURAL[seen[0]] : 'Dates') + ': ' + names;
    }

    function renderInfo() {
        var it = S.item, box = el.info, ul;
        clear(box);
        function p(text, cls) { var n = h('p', { 'class': cls || '', text: text }); box.appendChild(n); return n; }
        function bullet(text) { box.appendChild(h('ul', { 'class': 'bm-bul' }, [h('li', { text: text })])); }
        function hint(t) { p(t, 'bm-muted'); }

        if (it.model === 'stay') {
            p('Good for ' + it.pax + 'pax', 'bm-info-title');
            if (it.amenities.length) {
                p('Amenities:', 'bm-info-k');
                box.appendChild(h('ul', { 'class': 'bm-bul' }, it.amenities.map(function (a) { return h('li', { text: a }); })));
            }
            var first = S.inISO || '', t = first ? dayType(first) : 'weekday';
            var label = S.stay === 'day' ? 'Day Tour' : 'Overnight';
            p('', 'bm-rate').appendChild(h('span', null, [label + ': ', h('b', { text: rateText(it.rates[S.stay][t]) }), ' ', h('b', { text: '(' + TYPE_PLURAL[t].toLowerCase() + ')' })]));
            bullet(S.stay === 'day' ? it.times.day : it.times.overnight);
            var d = stayDaysText();
            if (d) p(d); else hint('Pick your dates above.');
        } else if (it.model === 'event') {
            var hr = eventHour(), price = hr.rates[S.tier];
            p('Good for ' + S.tier + 'pax', 'bm-info-title');
            p('', 'bm-rate').appendChild(h('span', null, [hr.label + ': ', h('b', { text: rateText(price) })]));
            if (S.start) bullet(fmtHour(+S.start) + ' \u2013 ' + fmtHour(+S.start + hr.max)); else hint('Choose a start time above.');
            if (S.dateISO) p(longDate(S.dateISO)); else hint('Pick your date above.');
        } else if (it.model === 'pool') {
            p('Pool Access Only', 'bm-info-title');
            p(S.period === 'day' ? 'Day' : 'Night', 'bm-info-big');
            if (S.dateISO) p(longDate(S.dateISO), 'bm-info-big'); else hint('Pick your date above.');
        } else if (it.model === 'boat') {
            p('Boat Rental', 'bm-info-title');
            p('Good for ' + it.pax + ' pax \u00B7 ' + it.hours + ' hours');
            if (S.dateISO) p(longDate(S.dateISO), 'bm-info-big'); else hint('Pick your date above.');
        }
    }

    /* =====================================================================
       PRICE
       ===================================================================== */
    function dayType(dateISO) {
        if (S.holiday) return 'holiday';
        return WEEKEND_DAYS.indexOf(parse(dateISO).getDay()) > -1 ? 'weekend' : 'weekday';
    }

    function need(r, msg, focusNode) { r.msg = msg; r.focus = focusNode || null; }

    function calcStay(r) {
        var it = S.item, isDay = S.stay === 'day', word = it.label.toLowerCase();
        if (!S.inISO) return need(r, 'Please choose your check-in date.', W['in'].btn);
        if (!isDay && !S.outISO) return need(r, 'Please choose your check-out date.', W.out.btn);
        if (!S.units.length) return need(r, 'Please choose at least one ' + word + ' to continue.', el.pick.querySelector('.bm-unit'));

        var dates = datesOfStay(), counts = {}, order = [], M = S.units.length;
        dates.forEach(function (d) { var t = dayType(d); if (!counts[t]) { counts[t] = 0; order.push(t); } counts[t]++; });

        for (var i = 0; i < order.length; i++) {
            var t = order[i], rate = it.rates[S.stay][t];
            if (rate === null || rate === undefined) {
                r.base = []; r.baseTotal = 0;
                return need(r, 'The ' + TYPE_LABEL[t].toLowerCase() + ' rate is not available online yet. Please contact the resort to book these dates.');
            }
            var amount = rate * counts[t] * M;
            r.base.push({
                label: (isDay ? 'Day Tour \u00B7 ' + TYPE_LABEL[t] + ' rate' : TYPE_LABEL[t] + ' rate \u00D7 ' + plural(counts[t], 'night')) + (M > 1 ? ' \u00D7 ' + plural(M, word) : ''),
                amount: amount
            });
            r.baseTotal += amount;
        }
        r.hasBase = true;
        r.headline = S.units.join(', ');
        r.sub = isDay ? 'Day Tour' : 'Overnight';
        r.paxLine = 'Good for ' + it.pax + 'pax' + (M > 1 ? ' each' : '');
        r.dateRows = isDay ? [['Date:', longDate(S.inISO)]] : [['Check-in:', longDate(S.inISO)], ['Check-out:', longDate(S.outISO)]];
        r.when = isDay ? longDate(S.inISO) + ' (Day Tour)' : rangeText(S.inISO, S.outISO);
        r.confirmName = r.headline + ' (' + r.paxLine + ')';
        r.what = r.headline + ' \u00B7 ' + r.sub;
    }

    function calcEvent(r) {
        var it = S.item, hr = eventHour();
        if (!S.dateISO) return need(r, 'Please choose your event date.', W.date.btn);
        if (!S.start) return need(r, 'Please choose your start time.', W.start);
        var price = hr.rates[S.tier];
        if (price === null || price === undefined) return need(r, 'This package is not available online yet. Please contact the resort.');
        var win = fmtHour(+S.start) + ' \u2013 ' + fmtHour(+S.start + hr.max);
        r.base.push({ label: 'Event Place \u00B7 ' + hr.label + ' \u00B7 ' + S.tier + ' pax', amount: price });
        r.baseTotal = price;
        r.hasBase = true;
        r.headline = 'Event Place';
        r.sub = hr.label + ' \u00B7 ' + win;
        r.paxLine = 'Good for ' + S.tier + 'pax';
        r.dateRows = [['Date:', longDate(S.dateISO)], ['Time:', win]];
        r.when = longDate(S.dateISO) + ', ' + win;
        r.confirmName = 'Event Place (' + hr.label + ', ' + r.paxLine + ')';
        r.what = 'Event Place \u00B7 ' + hr.label;
    }

    function calcPool(r) {
        var it = S.item, rt = it.rates, day = S.period === 'day';
        if (!S.dateISO) return need(r, 'Please choose your date.', W.date.btn);
        if (S.kids + S.adults < 1) return need(r, 'Please add at least one guest.', W.adults);
        var adultRate = day ? rt.adultDay : rt.adultNight;
        if (S.adults && (adultRate === null || adultRate === undefined)) return need(r, 'The entrance fee is not available online yet. Please contact the resort.');
        if (S.adults) { r.base.push({ label: '7 years old & above \u00D7 ' + S.adults + ' (' + (day ? 'Day' : 'Night') + ')', amount: adultRate * S.adults }); r.baseTotal += adultRate * S.adults; }
        if (S.kids)   { r.base.push({ label: '1\u20136 years old \u00D7 ' + S.kids, amount: rt.kid * S.kids }); r.baseTotal += rt.kid * S.kids; }
        r.hasBase = true;
        r.headline = 'Swimming Pool';
        r.sub = 'Pool Access Only \u00B7 ' + (day ? 'Day' : 'Night');
        r.paxLine = plural(S.kids + S.adults, 'guest');
        r.dateRows = [['Date:', longDate(S.dateISO)], ['Swimming time:', day ? 'Day' : 'Night']];
        r.when = longDate(S.dateISO) + ' (' + (day ? 'Day' : 'Night') + ')';
        r.confirmName = 'Swimming Pool (Pool Access Only, ' + r.paxLine + ')';
        r.what = 'Swimming Pool \u00B7 ' + (day ? 'Day' : 'Night');
    }

    function calcBoat(r) {
        var it = S.item, dest = null;
        it.destinations.forEach(function (d) { if (d.name === S.dest) dest = d; });
        if (!S.dateISO) return need(r, 'Please choose your date.', W.date.btn);
        if (!S.slot) return need(r, 'Please choose your boat time.', W.slot);
        if (!dest || dest.rate === null || dest.rate === undefined) return need(r, 'The rate for this destination is not available online yet. Please contact the resort.');
        r.base.push({ label: 'Boat rental \u00B7 ' + dest.name + ' \u00B7 ' + it.hours + ' hours', amount: dest.rate });
        r.baseTotal = dest.rate;
        r.hasBase = true;
        r.headline = 'Boat Rental';
        r.sub = dest.name;
        r.paxLine = plural(S.pax, 'passenger');
        r.dateRows = [['Date:', longDate(S.dateISO)], ['Time:', S.slot], ['Destination:', dest.name]];
        r.when = longDate(S.dateISO) + ', ' + S.slot;
        r.confirmName = 'Boat Rental (' + dest.name + ', ' + r.paxLine + ')';
        r.what = 'Boat Rental \u00B7 ' + dest.name;
    }

    function calc() {
        var it = S.item;
        var r = { ok: false, msg: '', focus: null, hasBase: false, base: [], baseTotal: 0, add: [], addTotal: 0, tba: false, subtotal: 0,
                  headline: '', sub: '', paxLine: '', dateRows: [], when: '', confirmName: '', what: '' };
        ({ stay: calcStay, event: calcEvent, pool: calcPool, boat: calcBoat })[it.model](r);

        it.addons.forEach(function (a) {
            var q = S.add[a.id] || 0;
            if (!q) return;
            var total = a.price === null ? null : a.price * q;
            r.add.push({ label: a.sum + (q > 1 ? ' \u00D7 ' + q : ''), amount: total });
            if (total === null) r.tba = true; else r.addTotal += total;
        });
        r.subtotal = r.baseTotal + r.addTotal;
        r.ok = r.hasBase && !r.msg;
        return r;
    }

    function money(sub) {                         // the 50% down payment split
        var dp = Math.ceil(sub * DP / 100);
        return { dp: dp, balance: sub - dp };
    }

    /* =====================================================================
       CALENDAR  (keys: 'in', 'out' for stays - 'date' for facilities)
       ===================================================================== */
    function selOf(which) { return which === 'in' ? S.inISO : (which === 'out' ? S.outISO : S.dateISO); }
    function minFor(which) {
        if (which === 'out') return S.inISO ? addDays(S.inISO, 1) : addDays(S.today, 1);
        return S.today;
    }

    function buildCal() {
        var which = S.calFor, min = minFor(which), sel = selOf(which);
        var startDow = new Date(S.view.y, S.view.m, 1).getDay();
        var days = new Date(S.view.y, S.view.m + 1, 0).getDate();
        var minDate = parse(min);
        var canPrev = S.view.y > minDate.getFullYear() || (S.view.y === minDate.getFullYear() && S.view.m > minDate.getMonth());
        var caption = which === 'in' ? 'Check-in date' : (which === 'out' ? 'Check-out date' : 'Choose a date');

        var html = '<div class="bm-cal-head">' +
            '<button type="button" class="bm-cal-nav" data-nav="-1" aria-label="Previous month"' + (canPrev ? '' : ' disabled') + '>' + CHEV_L + '</button>' +
            '<div class="bm-cal-title" aria-live="polite">' + MONTHS[S.view.m] + ' ' + S.view.y + '</div>' +
            '<button type="button" class="bm-cal-nav" data-nav="1" aria-label="Next month">' + CHEV_R + '</button></div>' +
            '<div class="bm-cal-caption">' + caption + '</div>' +
            '<div class="bm-cal-grid bm-cal-week">' + WEEK.map(function (w) { return '<span>' + w + '</span>'; }).join('') + '</div>' +
            '<div class="bm-cal-grid">';
        for (var i = 0; i < startDow; i++) html += '<span></span>';
        for (var d = 1; d <= days; d++) {
            var v = iso(S.view.y, S.view.m, d), cls = 'bm-day';
            if (v === sel) cls += ' selected';
            if (v === S.today) cls += ' today';
            if (S.item.model === 'stay' && S.stay === 'overnight' && S.inISO && S.outISO && v > S.inISO && v < S.outISO) cls += ' in-range';
            html += '<button type="button" class="' + cls + '" data-date="' + v + '"' + (v < min ? ' disabled' : '') + '>' + d + '</button>';
        }
        html += '</div>';
        el.cal.innerHTML = html;
    }

    function openCal(which) {
        if (which === 'out' && S.stay === 'day') return;
        S.calFor = which;
        var start = selOf(which) || (which === 'out' && S.inISO ? addDays(S.inISO, 1) : S.today);
        var min = minFor(which);
        if (start < min) start = min;
        var d = parse(start);
        S.view = { y: d.getFullYear(), m: d.getMonth() };
        buildCal();
        el.cal.hidden = false;

        /* line the calendar up under the button that opened it, but keep it inside the strip */
        var wr = el.whenWrap.getBoundingClientRect(), br = W[which].btn.getBoundingClientRect();
        var left = Math.max(0, Math.min(br.left - wr.left, wr.width - el.cal.offsetWidth));
        el.cal.style.left = left + 'px';

        Object.keys(W).forEach(function (k) { if (W[k].btn) W[k].btn.setAttribute('aria-expanded', k === which ? 'true' : 'false'); });
        var target = el.cal.querySelector('.selected') || el.cal.querySelector('.bm-day:not([disabled])');
        if (target) target.focus({ preventScroll: true });
        el.cal.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function closeCal(returnFocus) {
        if (el.cal.hidden) return;
        var which = S && S.calFor;
        el.cal.hidden = true;
        if (S) S.calFor = null;
        Object.keys(W).forEach(function (k) { if (W[k].btn) W[k].btn.setAttribute('aria-expanded', 'false'); });
        if (returnFocus && which && W[which]) W[which].btn.focus({ preventScroll: true });
    }

    el.cal.addEventListener('click', function (e) {
        e.stopPropagation();                      // the calendar re-renders itself; keep the outside-click handler away
        var nav = e.target.closest('[data-nav]');
        if (nav) {
            S.view.m += +nav.getAttribute('data-nav');
            if (S.view.m < 0)  { S.view.m = 11; S.view.y--; }
            if (S.view.m > 11) { S.view.m = 0;  S.view.y++; }
            buildCal();
            var keep = el.cal.querySelector('[data-nav="' + nav.getAttribute('data-nav') + '"]:not([disabled])');
            if (keep) keep.focus({ preventScroll: true });
            return;
        }
        var day = e.target.closest('[data-date]');
        if (!day || day.disabled) return;
        var which = S.calFor, v = day.getAttribute('data-date');
        if (which === 'in') {
            S.inISO = v;
            if (S.stay === 'overnight' && S.outISO && S.outISO <= v) S.outISO = '';
            refresh();
            if (S.stay === 'overnight') { closeCal(false); openCal('out'); } else closeCal(true);   // go straight on to check-out
        } else {
            if (which === 'out') S.outISO = v; else S.dateISO = v;
            refresh();
            closeCal(true);
        }
    });

    el.cal.addEventListener('keydown', function (e) {       // arrow keys move between the days
        var keys = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
        if (!(e.key in keys)) return;
        var days = Array.prototype.slice.call(el.cal.querySelectorAll('.bm-day:not([disabled])'));
        var i = days.indexOf(document.activeElement);
        if (i < 0) return;
        e.preventDefault();
        var next = days[i + keys[e.key]];
        if (next) next.focus({ preventScroll: true });
    });

    /* =====================================================================
       STEP 1 -> STEP 2
       ===================================================================== */
    el.next.addEventListener('click', function () {
        var r = calc();
        if (!r.ok) {
            el.msg.textContent = r.msg || 'Please complete your choices to continue.';
            el.msg.hidden = false;
            if (r.focus && r.focus.focus) { r.focus.focus({ preventScroll: false }); }
            return;
        }
        S.calc = r;
        fillCheckout(r);
        showStep('pay');
    });

    el.another.addEventListener('click', function () {
        closeModal();
    });

    el.back.addEventListener('click', function () { showStep('select'); });

    /* =====================================================================
       STEP 2 - CHECKOUT
       ===================================================================== */
    function rows(dl, pairs, emptyText) {
        clear(dl);
        if (!pairs.length && emptyText) { dl.appendChild(h('div', { 'class': 'bm-muted-row' }, [h('dt', { text: emptyText })])); return; }
        pairs.forEach(function (p) { dl.appendChild(h('div', null, [h('dt', { text: p[0] }), h('dd', { text: p[1] })])); });
    }

    function fillCheckout(r) {
        var it = S.item;
        el.sumImg.src = it.img;
        el.sumImg.alt = '';
        el.sumImg.style.objectPosition = it.pos || 'center';
        el.sumName.textContent = r.headline;
        el.sumSub.textContent = r.sub;
        el.sumPax.textContent = r.paxLine;
        el.sumPrice.textContent = peso(r.baseTotal);
        rows(el.sumDates, r.dateRows);
        rows(el.sumBase, r.base.map(function (b) { return [b.label, amt(b.amount)]; }));
        rows(el.sumAdd, r.add.map(function (a) { return [a.label + ':', amt(a.amount)]; }), 'None selected');
        el.sumAddTot.textContent = peso(r.addTotal) + (r.tba ? ' + TBA' : '');

        var m = money(r.subtotal);
        el.bdSub.textContent = peso(r.subtotal);
        el.bdDpLbl.textContent = 'Required DP (' + DP + '%)';
        el.bdDp.textContent = peso(m.dp);
        el.bdPay.textContent = peso(m.dp);
        el.bdBal.textContent = peso(m.balance);
        el.bdNote.hidden = !r.tba;
        el.bdNote.textContent = 'Items marked TBA are not included yet. We will confirm their price with you.';
        el.legal.firstChild.textContent = '\u2022 A ' + DP + '% non-refundable down payment is required to confirm your reservation.';
        el.legal.lastChild.textContent = 'The remaining balance of ' + (100 - DP) + '% shall be paid upon arrival.';
        updateQr();
    }

    /* ----- mode of payment ----- */
    function buildPay() {
        clear(el.modes);
        var pay = CFG.payment || {};
        Object.keys(pay).forEach(function (k) {
            var m = pay[k];
            var inp = h('input', { type: 'radio', name: 'bmPay', value: k });
            var qr = h('img', { 'class': 'bm-qr-s', src: m.qr, alt: '' });
            qr.addEventListener('error', function () { qr.style.visibility = 'hidden'; });
            inp.addEventListener('change', function () { S.pay = k; clearField(el.modes); updateQr(); });
            el.modes.appendChild(h('label', { 'class': 'bm-mode' }, [inp, h('i', { 'class': 'bm-radio', 'aria-hidden': 'true' }), qr, h('span', { text: m.label })]));
        });
        el.qr.hidden = true;
    }

    function updateQr() {
        var m = (CFG.payment || {})[S.pay];
        if (!m || !S.calc) { el.qr.hidden = true; return; }
        clear(el.qr);
        var img = h('img', { src: m.qr, alt: 'QR code for ' + m.label });
        var box = h('div', { 'class': 'bm-qr-big' }, [img]);
        img.addEventListener('error', function () { clear(box); box.appendChild(h('span', { text: 'QR code not available yet' })); });
        var info = h('div', { 'class': 'bm-qr-info' }, [
            h('p', { 'class': 'bm-qr-k', text: 'Pay via ' + m.label }),
            m.name ? h('p', { text: 'Account name: ' + m.name }) : null,
            m.number ? h('p', { text: 'Number: ' + m.number }) : null,
            h('p', { 'class': 'bm-qr-amt', text: 'Amount to pay now: ' + peso(money(S.calc.subtotal).dp) })
        ]);
        el.qr.appendChild(box);
        el.qr.appendChild(info);
        el.qr.hidden = false;
    }

    /* ----- upload ----- */
    el.file.addEventListener('change', function () {
        var f = el.file.files[0];
        clearField(el.fileBox);
        if (!f) { el.fileName.textContent = 'No file chosen'; return; }
        var okType = /^image\//.test(f.type) || f.type === 'application/pdf';
        if (!okType) { badFile('Please upload an image (JPG, PNG) or a PDF of your payment.'); return; }
        if (f.size > MAX_FILE_MB * 1024 * 1024) { badFile('That file is too large. Please upload a file under ' + MAX_FILE_MB + ' MB.'); return; }
        el.fileName.textContent = f.name;
    });
    function badFile(msg) {
        el.file.value = '';
        el.fileName.textContent = 'No file chosen';
        setError(el.fileBox, msg);
    }

    /* ----- validation ----- */
    function setError(input, msg) {
        input.classList.add('is-invalid');
        var box = input.closest('.bm-field').querySelector('.bm-err');
        if (box) { box.textContent = msg; box.hidden = false; }
    }
    function clearField(input) {
        input.classList.remove('is-invalid');
        var box = input.closest('.bm-field').querySelector('.bm-err');
        if (box) { box.hidden = true; box.textContent = ''; }
    }
    function clearPayErrors() { [el.name, el.email, el.phone, el.modes, el.fileBox, el.ref].forEach(clearField); }
    [el.name, el.email, el.phone, el.ref].forEach(function (i) { i.addEventListener('input', function () { clearField(i); }); });

    function validatePay() {
        var firstBad = null;
        function bad(node, focusNode) { if (!firstBad) firstBad = focusNode || node; }
        clearPayErrors();

        if (el.name.value.trim().length < 2) { setError(el.name, 'Please enter your full name.'); bad(el.name); }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.email.value.trim())) { setError(el.email, 'Please enter a valid email address. Your booking details will be sent here.'); bad(el.email); }
        var digits = el.phone.value.replace(/\D/g, '');
        if (!/^[+()\d\s-]+$/.test(el.phone.value.trim()) || digits.length < 7 || digits.length > 15) { setError(el.phone, 'Please enter a valid mobile number, e.g. 0917 123 4567.'); bad(el.phone); }
        if (!S.pay) { setError(el.modes, 'Please choose how you paid.'); bad(el.modes, el.modes.querySelector('input')); }
        if (!el.file.files[0]) { setError(el.fileBox, 'Please upload a screenshot or photo of your payment.'); bad(el.fileBox, el.file); }
        var ref = el.ref.value.replace(/\s+/g, '');
        if (!/^[A-Za-z0-9-]{6,30}$/.test(ref)) { setError(el.ref, 'Please enter the reference number from your payment (6\u201330 letters or numbers).'); bad(el.ref); }

        if (firstBad) { firstBad.focus(); if (firstBad.scrollIntoView) firstBad.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return false; }
        return true;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (busy) return;
        if (!validatePay()) return;
        openConfirm();
    });

    /* =====================================================================
       STEP 3 - CONFIRM YOUR RESERVATION?   STEP 4 - THANK YOU
       ===================================================================== */
    function openConfirm() {
        var r = S.calc, m = money(r.subtotal);
        clear(el.confList);
        [
            [(S.item.kind === 'facility' ? 'Facility' : 'Accommodation') + ': ', r.confirmName],
            ['Dates: ', r.when],
            ['Downpayment: ', peso(m.dp)],
            ['Remaining Balance: ', peso(m.balance)]
        ].forEach(function (p) { el.confList.appendChild(h('li', null, [p[0], h('b', { text: p[1] })])); });
        el.confErr.hidden = true;
        el.confirm.hidden = false;
        el.confYes.focus({ preventScroll: true });
    }

    function makeReference() {
        var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '', d = new Date();
        for (var i = 0; i < 4; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
        return 'BK-' + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + s;
    }

    function buildData() {
        var r = S.calc, m = money(r.subtotal), f = el.file.files[0];
        return {
            reference: makeReference(),
            item: { id: S.item.id, kind: S.item.kind, name: r.headline },
            what: r.what,
            stay: S.item.model === 'stay' ? S.stay : null,
            units: S.units.slice(),
            checkIn: S.item.model === 'stay' ? S.inISO : S.dateISO,
            checkOut: S.item.model === 'stay' ? (S.stay === 'day' ? S.inISO : S.outISO) : S.dateISO,
            holiday: S.holiday,
            details: { hour: S.hour, capacity: S.tier, start: S.start, kids: S.kids, adults: S.adults, passengers: S.pax, destination: S.dest, slot: S.slot, period: S.period },
            charges: r.base, addons: r.add,
            subtotal: r.subtotal, downPayment: m.dp, balance: m.balance, hasTba: r.tba,
            payment: { mode: S.pay, referenceNumber: el.ref.value.trim(), proofName: f ? f.name : '' },
            customer: { name: el.name.value.trim(), email: el.email.value.trim(), phone: el.phone.value.trim(), request: el.notes.value.trim() },
            createdAt: new Date().toISOString()
        };
    }

    function submitBooking(data) {
        var f = el.file.files[0];
        if (CFG.endpoint) {
            var fd = new FormData();
            fd.append('booking', JSON.stringify(data));
            if (f) fd.append('proof', f, f.name);
            return fetch(CFG.endpoint, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
                .then(function (res) { if (!res.ok) throw new Error('failed'); return res.json(); });
        }
        /* DEMO MODE (no $bm_endpoint yet): nothing is saved and no email is sent. */
        if (window.console) console.warn('[book_modal] Demo mode: set $bm_endpoint in book_acco_faci.php to save bookings and send the email.');
        return new Promise(function (resolve) { setTimeout(function () { resolve({ ok: true, reference: data.reference }); }, 800); });
    }

    function setConfirmBusy(on) {
        busy = on;
        el.confYes.disabled = on;
        el.confNo.disabled = on;
        el.confYes.textContent = on ? 'Sending\u2026' : 'Confirm';
    }

    el.confNo.addEventListener('click', function () { el.confirm.hidden = true; form.querySelector('.bm-confirm-btn').focus({ preventScroll: true }); });

    el.confYes.addEventListener('click', function () {
        if (busy) return;
        var data = buildData();
        el.confErr.hidden = true;
        setConfirmBusy(true);
        submitBooking(data).then(function (res) {
            if (!res || res.ok === false) throw new Error((res && res.message) || 'failed');
            if (res.reference) data.reference = res.reference;
            window.dispatchEvent(new CustomEvent('booking:submitted', { detail: data }));
            setConfirmBusy(false);
            el.confirm.hidden = true;
            el.thanksRef.textContent = data.reference;
            el.thanks.hidden = false;
            el.thanksOk.focus({ preventScroll: true });
        }).catch(function (err) {
            setConfirmBusy(false);
            el.confErr.textContent = (err && err.message && err.message !== 'failed' && err.message !== 'Failed to fetch')
                ? err.message
                : 'We could not send your reservation. Please check your connection and try again. Your details are still here.';
            el.confErr.hidden = false;
        });
    });

    el.thanksOk.addEventListener('click', closeModal);

    /* =====================================================================
       OPEN / CLOSE WIRING, KEYBOARD, FOCUS TRAP
       ===================================================================== */
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-book-room]');
        if (btn) { e.preventDefault(); openModal(btn.getAttribute('data-book-room'), btn); }
    });

    Array.prototype.forEach.call(modal.querySelectorAll('[data-bm-close]'), function (b) { b.addEventListener('click', closeModal); });

    /* click on the dark background closes it - only while choosing, so nobody loses a filled-in checkout by accident */
    var downOnBackdrop = false;
    modal.addEventListener('mousedown', function (e) { downOnBackdrop = (e.target === modal); });
    modal.addEventListener('click', function (e) {
        if (e.target === modal && downOnBackdrop && S && S.step === 'select') { closeModal(); return; }
        if (!el.cal.hidden && !el.cal.contains(e.target) && !e.target.closest('.bm-date')) closeCal(false);   // click anywhere else closes the calendar
    });

    document.addEventListener('keydown', function (e) {
        if (modal.hidden) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            if (!el.confirm.hidden) { if (!busy) el.confNo.click(); }
            else if (!el.thanks.hidden) closeModal();
            else if (!el.cal.hidden) closeCal(true);
            else closeModal();
            return;
        }
        if (e.key !== 'Tab') return;
        var scope = !el.confirm.hidden ? el.confirm : (!el.thanks.hidden ? el.thanks : dialog);
        var list = Array.prototype.filter.call(
            scope.querySelectorAll('button, input, textarea, select, [href], [tabindex]:not([tabindex="-1"])'),
            function (n) { return !n.disabled && !n.hidden && n.offsetParent !== null; }
        );
        if (!list.length) return;
        var first = list[0], last = list[list.length - 1];
        if (!scope.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
})();