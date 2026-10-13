<?php
/*
 * BOOKING / RATES: ACCOMMODATIONS + FACILITIES  (book_acco_faci.php)
 * One file, two sections: Accommodations first, Facilities right below it.
 * Included by guestaccomo.php, below the pool / beach / rules section:
 *     <?php include __DIR__ . '/book_acco_faci.php'; ?>
 * Styles: assets/css/book_acco_faci.css  (linked automatically below)
 * Images: assets/img/room1.jpg, treehouse.jpg, cottage.jpg, event.jpg, pool2.jpg, beach2.jpg
 *
 * Links from the home section (accomodation.php) - buttons / cards only:
 *     guestaccomo.php#rates-room | #rates-treehouse | #rates-cottage   (#rates = Accommodations)
 *     #faci-event | #faci-pool | #faci-boat                           (#facilities-rates = Facilities)
 *
 * To change a price or a time, edit the two lists below - the cards are built from them.
 * ALL "Book now" buttons (Accommodations + Facilities) open the booking pop-up (assets/js/book_modal.js + the markup at the bottom of this file).
 * Pop-up flow: choose (room / hours / guests + optional fees) -> Payment & Reservation Checkout -> Confirm -> Thank you.
 * Pop-up settings (logo, QR codes, down payment %, save endpoint, booked rooms) are in section 3 below.
 * Replace each '?' with the real amount (numbers only, e.g. '3,500').
 */

/* ===================== 1) ACCOMMODATIONS DATA ===================== */
$bk_day_time   = '8:00am &ndash; 5:00pm';
$bk_night_time = '3:00pm &ndash; 12:00nn';

$bk_items = [
    [
        'name'      => 'De Luxe Room',
        'id'        => 'rates-room',
        'img'       => 'assets/img/room1.jpg',
        'alt'       => 'Air-conditioned room with two beds',
        'pos'       => 'center 55%',
        'pax'       => 6,
        'amenities' => ['Air-Condition', 'Free Wi-Fi', 'Table &amp; Chairs', 'Premium Bedding'],
        'weekday'   => ['day' => '5,000', 'overnight' => '7,000'],
        'weekend'   => ['day' => '?',     'overnight' => '?'],
        'holiday'   => ['day' => '?',     'overnight' => '?'],
    ],
    [
        'name'      => 'Tree House Cottage',
        'id'        => 'rates-treehouse',
        'img'       => 'assets/img/treehouse.jpg',
        'alt'       => 'Tree house cottage built around a tree',
        'pos'       => 'center 40%',
        'pax'       => 10,
        'amenities' => [],
        'weekday'   => ['day' => '3,000', 'overnight' => '4,000'],
        'weekend'   => ['day' => '?',     'overnight' => '?'],
        'holiday'   => ['day' => '?',     'overnight' => '?'],
    ],
    [
        'name'      => 'Cottage',
        'id'        => 'rates-cottage',
        'img'       => 'assets/img/cottage.jpg',
        'alt'       => 'Beachside cottage',
        'pos'       => 'center 55%',
        'pax'       => 10,
        'amenities' => [],
        'weekday'   => ['day' => '2,000', 'overnight' => '3,000'],
        'weekend'   => ['day' => '?',     'overnight' => '?'],
        'holiday'   => ['day' => '?',     'overnight' => '?'],
    ],
];

/* ===================== 2) FACILITIES DATA =====================
 *   'cols' = column headings (leave [] for a plain label / value list)
 *   'rows' = [label, value, value...]   (a row with ONE value spans all columns)
 *   'icon' = people | ticket | boat
 */
$bf_items = [
    [
        'id'    => 'faci-event',
        'name'  => 'Event Place',
        'img'   => 'assets/img/event.jpg',
        'alt'   => 'Covered event place with green leaf ceiling',
        'pos'   => 'center 60%',
        'icon'  => 'people',
        'head'  => '20 &ndash; 40 pax',
        'note'  => '',
        'cols'  => ['20 pax', '40 pax'],
        'rows'  => [
            ['2&ndash;4 hours', '8,000',  '16,000'],
            ['4&ndash;6 hours', '10,000', '20,000'],
            ['6&ndash;8 hours', '12,000', '24,000'],
        ],
    ],
    [
        'id'    => 'faci-pool',
        'name'  => 'Swimming Pool',
        'img'   => 'assets/img/pool2.jpg',
        'alt'   => 'Swimming pool facing the beach cottages',
        'pos'   => 'center 60%',
        'icon'  => 'ticket',
        'head'  => 'Entrance Fee',
        'note'  => 'Swimming pool access only',
        'cols'  => ['Day', 'Night'],
        'rows'  => [
            ['1&ndash;6 years old',       '100'],
            ['7 years old &amp; above',   '150', '200'],
        ],
    ],
    [
        'id'    => 'faci-boat',
        'name'  => 'Boat Rental',
        'img'   => 'assets/img/beach2.jpg',
        'alt'   => 'Fishing boats on the beach in front of the cottages',
        'pos'   => 'center 55%',
        'icon'  => 'boat',
        'head'  => 'Good for 10 pax',
        'note'  => 'Depends on the destination. No activities, rental only.',
        'cols'  => [],
        'rows'  => [
            ['Capacity',     '10 pax'],
            ['Duration',     '3 hours'],
            ['Minimum rate', '&#8369;2,500'],
        ],
    ],
];

$bf_icons = [
    'people' => 'M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zM8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z',
    'ticket' => 'M22 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4a2 2 0 0 1 0 4v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4z',
    'boat'   => 'M12 2 11 13h9L12 2zM10 5 4 13h5L10 5zM3 15l2 4a2 2 0 0 0 1.8 1h10.4a2 2 0 0 0 1.8-1l2-4H3z',
];

/* ===================== 3) DATA FOR THE BOOKING POP-UP =====================
 * Built from the two lists above, so a price change there also changes the pop-up. '?' becomes null (= "TBA"). */
$bk_rate = function ($v) { $n = str_replace(',', '', (string)$v); return is_numeric($n) ? (int)$n : null; };
$bk_dec  = function ($t) { return html_entity_decode(strip_tags((string)$t), ENT_QUOTES | ENT_HTML5, 'UTF-8'); };

/* ---- pop-up settings: edit these ---- */
$bm_logo     = 'assets/img/logo.png';     // shown at the top-left of the pop-up and on the confirm / thank-you cards
$bm_dp       = 50;                        // required down payment, in percent (non-refundable)
$bm_endpoint = '';                        // LATER: 'book_save.php'. Empty = demo mode (nothing is saved, no email is sent)
$bm_payment  = [                          // QR images go in assets/img/. Fill in 'number' to show it beside the QR code.
    'qrph'    => ['label' => 'Online Banking (QRPH)',    'qr' => 'assets/img/qr_qrph.png',    'name' => 'On Shore Beach Resort', 'number' => ''],
    'ewallet' => ['label' => 'E-Wallet (GCash / Maya)',  'qr' => 'assets/img/qr_ewallet.png', 'name' => 'On Shore Beach Resort', 'number' => ''],
];
$bm_perks    = ['No Corkage fee', 'Free use of Grill', 'Free 1 car for parking', 'Free parking for motorcycle'];
/* Rooms / cottages that are already taken, so guests cannot pick them. Fill this from your database later:
 *   [ 'rates-room' => [ '2026-10-02' => ['Room 4', 'Room 7'] ] ]    (one entry per night / day) */
$bm_unavailable = [];

/* Event Place: first / last hour guests can start. Boat Rental: destinations (rate = minimum rate) and 3-hour time slots. */
$bm_event_start_min = 6;
$bm_boat = [
    'pax'          => 10,
    'hours'        => 3,
    'destinations' => [['name' => 'Twin Island', 'rate' => 2500]],
    'slots'        => ['6:00 am - 9:00 am', '9:00 am - 12:00 nn', '12:00 nn - 3:00 pm', '3:00 pm - 6:00 pm'],
];

/* ---- additional fees (price null = "?" / TBA, max = most a guest can add, maxPerUnit = per room booked) ---- */
$nd = "\u{2013}";
$A_bed    = ['id' => 'bed',     'label' => 'Extra Bed',  'sum' => 'Extra Bed', 'price' => 300, 'maxPerUnit' => 1];
$A_people = [
    ['id' => 'adult', 'group' => 'Extra Person (Overpax):', 'label' => 'Adult',                   'sum' => 'Extra Person (Adult)',          'price' => 300, 'max' => 30],
    ['id' => 'kid',   'group' => 'Extra Person (Overpax):', 'label' => "Kids (4{$nd}6 years old)", 'sum' => "Extra Person (Kid, 4{$nd}6)",   'price' => 150, 'max' => 30],
];
$A_basic  = [
    ['id' => 'videoke', 'label' => 'Videoke Rental', 'sum' => 'Videoke Rental', 'price' => 1500, 'max' => 1],
    ['id' => 'chair',   'label' => 'Extra Chair',    'sum' => 'Extra Chair',    'price' => 50,   'per' => '/piece', 'max' => 200],
    ['id' => 'table',   'label' => 'Extra Table',    'sum' => 'Extra Table',    'price' => 500,  'max' => 50],
];
$A_car    = ['id' => 'car', 'label' => 'Extra Car for parking', 'sum' => 'Extra Car for parking', 'price' => null, 'max' => 5];
$withGroup = function ($list, $group) { foreach ($list as &$a) { $a['group'] = $group; } return $list; };

$bm_stay_cfg = [
    'rates-room'      => ['title' => 'Rooms',              'photoLabel' => 'Rooms',       'label' => 'Room',       'pickTitle' => 'Available Rooms:',      'count' => 10, 'multi' => true,
                          'addons' => array_merge([$A_bed], $A_people, $A_basic, [$A_car])],
    'rates-treehouse' => ['title' => 'Tree House Cottage', 'photoLabel' => 'Tree House', 'label' => 'Tree House', 'pickTitle' => 'Available Tree House:', 'count' => 1,  'multi' => false,
                          'addons' => array_merge($A_people, $A_basic, [$A_car])],
    'rates-cottage'   => ['title' => 'Cottages',           'photoLabel' => 'Cottages',    'label' => 'Cottage',    'pickTitle' => 'Available Cottages:',   'count' => 5,  'multi' => true,
                          'addons' => array_merge($A_people, $A_basic, [$A_car])],
];

$bm_items = [];

/* accommodations */
foreach ($bk_items as $it) {
    if (!isset($bm_stay_cfg[$it['id']])) { continue; }
    $c = $bm_stay_cfg[$it['id']];
    $units = [];
    for ($i = 1; $i <= $c['count']; $i++) { $units[] = $c['label'] . ' ' . $i; }
    $bm_items[$it['id']] = [
        'id' => $it['id'], 'kind' => 'accom', 'model' => 'stay',
        'title' => $c['title'], 'photoLabel' => $c['photoLabel'], 'label' => $c['label'], 'pickTitle' => $c['pickTitle'],
        'units' => $units, 'multi' => $c['multi'],
        'img' => $it['img'], 'alt' => $it['alt'], 'pos' => $it['pos'],
        'pax' => (int)$it['pax'],
        'amenities' => array_map($bk_dec, $it['amenities']),
        'times' => ['day' => $bk_dec($bk_day_time), 'overnight' => $bk_dec($bk_night_time)],
        'rates' => [
            'day'       => ['weekday' => $bk_rate($it['weekday']['day']),       'weekend' => $bk_rate($it['weekend']['day']),       'holiday' => $bk_rate($it['holiday']['day'])],
            'overnight' => ['weekday' => $bk_rate($it['weekday']['overnight']), 'weekend' => $bk_rate($it['weekend']['overnight']), 'holiday' => $bk_rate($it['holiday']['overnight'])],
        ],
        'perks' => true, 'addons' => $c['addons'],
        'addTitle' => 'Additional Fees (optional):', 'another' => 'Book another accommodation',
    ];
}

/* facilities */
foreach ($bf_items as $f) {
    $base = [
        'id' => $f['id'], 'kind' => 'facility', 'title' => $bk_dec($f['name']), 'photoLabel' => $bk_dec($f['name']),
        'img' => $f['img'], 'alt' => $f['alt'], 'pos' => $f['pos'],
        'addTitle' => 'Additional Fees (optional):', 'another' => 'Book another facility',
    ];
    if ($f['id'] === 'faci-event') {
        $tiers = []; foreach ($f['cols'] as $c) { $tiers[] = (int)$bk_dec($c); }
        $hours = [];
        foreach ($f['rows'] as $row) {
            $lab = $bk_dec(array_shift($row));
            if (!preg_match('/(\d+)\D+(\d+)/u', $lab, $m)) { continue; }
            $rates = []; foreach ($tiers as $k => $t) { $rates[$t] = $bk_rate(isset($row[$k]) ? $row[$k] : null); }
            $hours[] = ['id' => $m[1] . '-' . $m[2], 'label' => str_replace('hours', 'hrs', $lab), 'min' => (int)$m[1], 'max' => (int)$m[2], 'rates' => $rates];
        }
        $bm_items[$f['id']] = $base + [
            'model' => 'event', 'pickTitle' => 'Available Hours:', 'tiers' => $tiers, 'hours' => $hours, 'startMin' => $bm_event_start_min,
            'perks' => true,
            'addons' => array_merge(
                $withGroup($A_basic, 'Add-ons:'),
                [
                    ['id' => 'swim7', 'group' => 'Swimming Fee:', 'label' => '7 years old & above', 'sum' => 'Swimming Fee (7 & above)',    'price' => 150, 'max' => 100],
                    ['id' => 'swim1', 'group' => 'Swimming Fee:', 'label' => "1{$nd}6 years old",    'sum' => "Swimming Fee (1{$nd}6, free)", 'price' => 0,   'max' => 100, 'priceText' => 'Free Entrance'],
                ]
            ),
        ];
    } elseif ($f['id'] === 'faci-pool') {
        $bm_items[$f['id']] = $base + [
            'model' => 'pool', 'pickTitle' => 'Guest:', 'perks' => true,
            'rates' => ['kid' => $bk_rate($f['rows'][0][1]), 'adultDay' => $bk_rate($f['rows'][1][1]), 'adultNight' => $bk_rate($f['rows'][1][2])],
            'addons' => $A_basic,
        ];
    } elseif ($f['id'] === 'faci-boat') {
        $bm_items[$f['id']] = $base + [
            'model' => 'boat', 'pickTitle' => 'Guest:', 'perks' => false,
            'pax' => $bm_boat['pax'], 'hours' => $bm_boat['hours'], 'destinations' => $bm_boat['destinations'], 'slots' => $bm_boat['slots'],
            'addTitle' => 'Additional Accessories (optional):',
            'addons' => [['id' => 'goggles', 'label' => 'Goggles', 'sum' => 'Goggles', 'price' => null, 'max' => 20]],
        ];
    }
}

$bm_cfg = ['dp' => $bm_dp, 'endpoint' => $bm_endpoint, 'payment' => $bm_payment, 'perks' => $bm_perks, 'unavailable' => (object)$bm_unavailable];
$bm_json = JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;

/* plain numbers get a peso sign, text (e.g. "10 pax") stays as is */
if (!function_exists('bf_money')) {
    function bf_money($v) {
        return preg_match('/^[\d,?]+$/', $v) ? '&#8369;' . $v : $v;
    }
}
?>
<link rel="stylesheet" href="assets/css/book_acco_faci.css">   <!-- harmless if guestaccomo.php already links it -->

<!-- BOOKING / RATES SECTION -->
<section class="bk" id="rates" aria-labelledby="bkTitle">
    <div class="bk-inner">

        <h2 class="bk-title ga-reveal" id="bkTitle">Accommodations</h2>

        <div class="bk-grid">
            <?php foreach ($bk_items as $i => $it): ?>
            <article class="bk-card ga-reveal" id="<?= $it['id'] ?>" style="--d:<?= number_format(0.1 + $i * 0.15, 2) ?>s">
                <h3 class="bk-name"><?= $it['name'] ?></h3>

                <div class="bk-photo">
                    <img src="<?= $it['img'] ?>" alt="<?= $it['alt'] ?>" style="object-position:<?= $it['pos'] ?>">


                    <!-- amenities (chips on the photo) -->
                    <?php if (!empty($it['amenities'])): ?>
                    <ul class="bk-chips" aria-label="Amenities">
                        <?php foreach ($it['amenities'] as $a): ?>
                        <li><?= $a ?></li>
                        <?php endforeach; ?>
                    </ul>
                    <?php endif; ?>
                </div>

                <div class="bk-box">
                    <!-- header: capacity -->
                    <div class="bk-head">
                        <p class="bk-pax">Good for <?= (int)$it['pax'] ?> pax</p>
                        <svg class="bk-ico" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zM8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z" fill="currentColor"/></svg>
                    </div>

                    <!-- rates table: same layout in every card so everything lines up -->
                    <div class="bk-rates" role="table" aria-label="Rates">
                        <div class="bk-row bk-row-head" role="row">
                            <span role="columnheader"></span>
                            <span role="columnheader">Weekdays</span>
                            <span role="columnheader">Weekends</span>
                            <span role="columnheader">Holidays</span>
                        </div>
                        <div class="bk-row" role="row">
                            <span class="bk-type" role="rowheader">Day Tour<small><?= $bk_day_time ?></small></span>
                            <span role="cell">&#8369;<?= $it['weekday']['day'] ?></span>
                            <span role="cell">&#8369;<?= $it['weekend']['day'] ?></span>
                            <span role="cell">&#8369;<?= $it['holiday']['day'] ?></span>
                        </div>
                        <div class="bk-row" role="row">
                            <span class="bk-type" role="rowheader">Overnight<small><?= $bk_night_time ?></small></span>
                            <span role="cell">&#8369;<?= $it['weekday']['overnight'] ?></span>
                            <span role="cell">&#8369;<?= $it['weekend']['overnight'] ?></span>
                            <span role="cell">&#8369;<?= $it['holiday']['overnight'] ?></span>
                        </div>
                    </div>

                    <!-- footer: book button -->
                    <div class="bk-foot">
                        <button type="button" class="bk-btn" data-book-room="<?= $it['id'] ?>" aria-haspopup="dialog" aria-label="Book <?= strip_tags($it['name']) ?>">
                            <span>Book now</span>
                            <svg viewBox="0 0 10 14" width="8" height="11" aria-hidden="true"><path d="M2 1l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>

    </div>
</section>

<!-- FACILITIES BOOKING / RATES SECTION -->
<section class="bf" id="facilities-rates" aria-labelledby="bfTitle">
    <div class="bf-inner">

        <h2 class="bf-title ga-reveal" id="bfTitle">Facilities</h2>

        <div class="bf-grid">
            <?php foreach ($bf_items as $i => $it): $n = max(1, count($it['cols']) ?: (count($it['rows'][0]) - 1)); ?>
            <article class="bf-card ga-reveal" id="<?= $it['id'] ?>" style="--d:<?= number_format(0.1 + $i * 0.15, 2) ?>s">
                <h3 class="bf-name"><?= $it['name'] ?></h3>

                <div class="bf-photo">
                    <img src="<?= $it['img'] ?>" alt="<?= $it['alt'] ?>" loading="lazy" style="object-position:<?= $it['pos'] ?>">
                </div>

                <div class="bf-box">
                    <div class="bf-head">
                        <p class="bf-pax"><?= $it['head'] ?></p>
                        <svg class="bf-ico" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="<?= $bf_icons[$it['icon']] ?>" fill="currentColor"/></svg>
                    </div>

                    <?php if ($it['note'] !== ''): ?>
                    <p class="bf-note"><?= $it['note'] ?></p>
                    <?php endif; ?>

                    <div class="bf-rates" role="table" aria-label="<?= strip_tags($it['name']) ?> rates" style="--n:<?= $n ?>">
                        <?php if (!empty($it['cols'])): ?>
                        <div class="bf-row bf-row-head" role="row">
                            <span role="columnheader"></span>
                            <?php foreach ($it['cols'] as $c): ?><span role="columnheader"><?= $c ?></span><?php endforeach; ?>
                        </div>
                        <?php endif; ?>
                        <?php foreach ($it['rows'] as $r): $label = array_shift($r); ?>
                        <div class="bf-row" role="row">
                            <span class="bf-type" role="rowheader"><?= $label ?></span>
                            <?php if (count($r) === 1): ?>
                            <span role="cell" class="bf-span"><?= bf_money($r[0]) ?></span>
                            <?php else: foreach ($r as $v): ?>
                            <span role="cell"><?= bf_money($v) ?></span>
                            <?php endforeach; endif; ?>
                        </div>
                        <?php endforeach; ?>
                    </div>

                    <div class="bf-foot">
                        <button type="button" class="bf-btn" data-book-room="<?= $it['id'] ?>" aria-haspopup="dialog" aria-label="Book <?= strip_tags($it['name']) ?>">
                            <span>Book now</span>
                            <svg viewBox="0 0 10 14" width="8" height="11" aria-hidden="true"><path d="M2 1l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>

    </div>
</section>

<!-- BOOKING POP-UP: opened by every "Book now" button (logic: assets/js/book_modal.js) -->
<div class="bm" id="bookModal" hidden>
    <div class="bm-dialog" role="dialog" aria-modal="true" aria-labelledby="bmTitle" data-step="select">
        <div class="bm-bg" id="bmBg" aria-hidden="true"></div>

        <button type="button" class="bm-close" data-bm-close aria-label="Close booking form">
            <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true"><path d="M2 2l10 10M12 2 2 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>

        <header class="bm-top">
            <img class="bm-logo" id="bmLogo" src="<?= htmlspecialchars($bm_logo, ENT_QUOTES) ?>" alt="On Shore Beach Resort" onerror="this.style.visibility='hidden'">
            <h2 class="bm-title" id="bmTitle"></h2>
        </header>

        <!-- ============ STEP 1: choose ============ -->
        <section class="bm-step" id="bmStepSelect">
            <!-- dates / type of stay are pinned above the scrolling area so they are always visible -->
            <div class="bm-whenwrap" id="bmWhenWrap">
                <div class="bm-when" id="bmWhen"></div>
                <div class="bm-cal" id="bmCal" role="dialog" aria-label="Choose a date" hidden></div>
            </div>

            <div class="bm-body" id="bmBody1">
                <div class="bm-cols">
                    <div class="bm-col bm-col-info">
                        <p class="bm-photo-label" id="bmPhotoLabel"></p>
                        <div class="bm-photo"><img id="bmImg" src="" alt=""></div>
                        <div class="bm-infobox" id="bmInfo" aria-live="polite"></div>
                    </div>

                    <div class="bm-col bm-col-pick">
                        <h3 class="bm-step-h"><span class="bm-num" aria-hidden="true">1</span><span id="bmPickTitle"></span></h3>
                        <div id="bmPick"></div>
                        <ul class="bm-perks" id="bmPerks"></ul>
                    </div>

                    <div class="bm-col bm-col-add">
                        <h3 class="bm-step-h"><span class="bm-num" aria-hidden="true">2</span><span id="bmAddTitle"></span></h3>
                        <div class="bm-addbox" id="bmAdd"></div>
                        <div class="bm-poolnote" id="bmNote" hidden></div>
                    </div>
                </div>
            </div>

            <footer class="bm-foot">
                <div class="bm-foot-total"><small>Estimated total</small><strong id="bmTotal">&mdash;</strong></div>
                <p class="bm-foot-msg" id="bmMsg" role="alert" hidden></p>
                <button type="button" class="bm-btn-ghost" id="bmAnother">
                    <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M7 1 3 5l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span>Book another accommodation</span>
                </button>
                <button type="button" class="bm-btn bm-next is-off" id="bmNext" aria-disabled="true">
                    <span>Next</span>
                    <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true"><path d="M2 2l5 5-5 5M7 2l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </footer>
        </section>

        <!-- ============ STEP 2: Payment & Reservation Checkout ============ -->
        <form class="bm-step bm-pay" id="bmForm" novalidate autocomplete="on" hidden>
            <div class="bm-body" id="bmBody2">
                <div class="bm-paycols">

                    <section class="bm-pcol">
                        <h3 class="bm-sec-h">Reservation Summary</h3>
                        <div class="bm-box bm-sumbox">
                            <div class="bm-sumhead">
                                <img id="bmSumImg" src="" alt="">
                                <div>
                                    <p class="bm-sum-name" id="bmSumName"></p>
                                    <p id="bmSumSub"></p>
                                    <p id="bmSumPax"></p>
                                    <p class="bm-sum-price" id="bmSumPrice"></p>
                                </div>
                            </div>
                            <p class="bm-sub-h">Selected Dates:</p>
                            <dl class="bm-dl" id="bmSumDates"></dl>
                            <p class="bm-sub-h">Charges:</p>
                            <dl class="bm-dl" id="bmSumBase"></dl>
                            <p class="bm-sub-h">Add-ons:</p>
                            <dl class="bm-dl" id="bmSumAdd"></dl>
                            <dl class="bm-dl bm-dl-total"><div><dt>Total Add-on:</dt><dd id="bmSumAddTot"></dd></div></dl>
                        </div>
                    </section>

                    <section class="bm-pcol">
                        <h3 class="bm-sec-h">Guest Information</h3>
                        <div class="bm-field">
                            <input class="bm-pill" id="bmName" name="name" type="text" autocomplete="name" placeholder="Full Name" aria-label="Full name" maxlength="80">
                            <p class="bm-err" hidden></p>
                        </div>
                        <div class="bm-field">
                            <input class="bm-pill" id="bmEmail" name="email" type="email" autocomplete="email" placeholder="Email Address" aria-label="Email address" maxlength="100">
                            <p class="bm-err" hidden></p>
                        </div>
                        <div class="bm-field">
                            <input class="bm-pill" id="bmPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Mobile #" aria-label="Mobile number" maxlength="20">
                            <p class="bm-err" hidden></p>
                        </div>
                        <div class="bm-field">
                            <input class="bm-pill" id="bmNotes" name="request" type="text" placeholder="Request (optional)" aria-label="Special request (optional)" maxlength="200">
                        </div>

                        <h3 class="bm-sec-h bm-sec-gap">Payment Details</h3>
                        <div class="bm-box bm-paybox">
                            <p class="bm-sub-h bm-first">Payment Breakdown</p>
                            <dl class="bm-dl">
                                <div><dt>Subtotal:</dt><dd id="bmBdSub"></dd></div>
                                <div class="bm-rule"><dt id="bmBdDpLbl">Required DP</dt><dd id="bmBdDp"></dd></div>
                                <div class="bm-strong"><dt>Amount to Pay Now:</dt><dd id="bmBdPay"></dd></div>
                                <div class="bm-rule"><dt>Balance (Due on Arrival):</dt><dd id="bmBdBal"></dd></div>
                            </dl>
                            <p class="bm-tba-note" id="bmBdNote" hidden></p>
                        </div>
                    </section>

                    <section class="bm-pcol">
                        <h3 class="bm-sec-h">Mode of Payment</h3>
                        <div class="bm-field">
                            <div class="bm-modes" id="bmModes" role="radiogroup" aria-label="Mode of payment"></div>
                            <p class="bm-err" hidden></p>
                        </div>
                        <div class="bm-qr" id="bmQr" hidden></div>
                        <p class="bm-paynote">To pay, scan the QR code or use the payment details provided. After payment, upload your screenshot and enter the reference number for verification.</p>

                        <h3 class="bm-sec-h">Upload Proof of Payment</h3>
                        <div class="bm-field">
                            <div class="bm-file" id="bmFileBox">
                                <span id="bmFileName">No file chosen</span>
                                <label class="bm-browse">Browse&hellip;<input type="file" id="bmFile" name="proof" accept="image/*,application/pdf" aria-label="Upload proof of payment"></label>
                            </div>
                            <p class="bm-err" hidden></p>
                        </div>
                        <div class="bm-field">
                            <input class="bm-pill bm-pill-line" id="bmRef" name="reference" type="text" placeholder="Reference Number" aria-label="Payment reference number" maxlength="40" autocomplete="off">
                            <p class="bm-err" hidden></p>
                        </div>
                    </section>
                </div>
            </div>

            <footer class="bm-foot">
                <p class="bm-legal" id="bmLegal"><span></span><br><span></span></p>
                <button type="button" class="bm-btn-line" id="bmBack">
                    <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M7 1 3 5l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span id="bmBackLbl">Back</span>
                </button>
                <button type="submit" class="bm-btn-line bm-confirm-btn" id="bmConfirmBtn">
                    <span>Confirm</span>
                    <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M3 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </footer>
        </form>

        <!-- ============ STEP 3: Confirm Your Reservation? ============ -->
        <div class="bm-pop" id="bmConfirm" hidden>
            <div class="bm-card" role="alertdialog" aria-modal="true" aria-labelledby="bmConfT" aria-describedby="bmConfD">
                <img class="bm-card-logo" src="<?= htmlspecialchars($bm_logo, ENT_QUOTES) ?>" alt="" onerror="this.style.display='none'">
                <h3 class="bm-card-h" id="bmConfT">Confirm Your Reservation?</h3>
                <p class="bm-card-sub" id="bmConfD">Please review your details before proceeding:</p>
                <ul class="bm-card-list" id="bmConfList"></ul>
                <p class="bm-card-agree">By confirming, you agree that the <?= (int)$bm_dp ?>% down payment is non-refundable.</p>
                <p class="bm-card-err" id="bmConfErr" role="alert" hidden></p>
                <div class="bm-card-actions">
                    <button type="button" class="bm-cbtn" id="bmConfNo">Cancel</button>
                    <button type="button" class="bm-cbtn bm-cbtn-fill" id="bmConfYes">Confirm</button>
                </div>
            </div>
        </div>

        <!-- ============ STEP 4: Thank You ============ -->
        <div class="bm-pop" id="bmThanks" hidden>
            <div class="bm-card" role="alertdialog" aria-modal="true" aria-labelledby="bmThanksT">
                <img class="bm-card-logo" src="<?= htmlspecialchars($bm_logo, ENT_QUOTES) ?>" alt="" onerror="this.style.display='none'">
                <h3 class="bm-card-h" id="bmThanksT">Thank You for Your Booking!</h3>
                <p class="bm-card-sub">Your Reservation Request Has Been Received</p>
                <p class="bm-card-ref">Reference no. <b id="bmThanksRef"></b></p>
                <div class="bm-mail">
                    <svg viewBox="0 0 64 44" width="64" height="44" aria-hidden="true"><rect x="2" y="2" width="60" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M4 6l28 22L60 6" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/></svg>
                    <div>
                        <b>Reservation Details Sent!</b>
                        <p>We have sent your complete booking summary and check-in guidelines directly to your registered email address. Please check your inbox (and spam folder) to review your stay details.</p>
                    </div>
                </div>
                <div class="bm-card-actions">
                    <button type="button" class="bm-cbtn" id="bmThanksOk">Okay</button>
                </div>
            </div>
        </div>

    </div>
</div>

<script>window.BK_ITEMS = <?= json_encode($bm_items, $bm_json) ?>; window.BK_CFG = <?= json_encode($bm_cfg, $bm_json) ?>;</script>
<script src="assets/js/book_modal.js" defer></script>