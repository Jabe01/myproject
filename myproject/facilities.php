<!-- FACILITIES SECTION (included by index.php, below the accommodations) -->
<section class="fac" id="facilities">

    <a class="fac-logo reveal-fade" href="./" aria-label="On Shore Beach Resort - back to top">
        <img src="assets/img/logo.jpg" alt="On Shore Beach Resort">
    </a>

    <h2 class="fac-title reveal">Facilities</h2>

    <p class="fac-text reveal" style="--d:.12s">
        Enjoy our refreshing pool, direct beach access, scenic event venue, boat rides, and
        spacious parking&mdash;everything you need for a complete beachside escape.
    </p>

    <div class="fac-grid">

        <figure class="fac-card reveal" style="--d:.15s">
            <div class="fac-frame" tabindex="0" role="button">
                <div class="fac-photo">
                    <img src="assets/img/home2.jpg" alt="Swimming Pool" style="object-position:center 70%">
                    <figcaption>Swimming Pool</figcaption>
                </div>
            </div>
        </figure>

        <figure class="fac-card reveal" style="--d:.25s">
            <div class="fac-frame" tabindex="0" role="button">
                <div class="fac-photo">
                    <img src="assets/img/boat.jpg" alt="Boats on the shore" style="object-position:center 68%">
                    <figcaption>Boats</figcaption>
                </div>
            </div>
        </figure>

        <figure class="fac-card reveal" style="--d:.35s">
            <div class="fac-frame" tabindex="0" role="button">
                <div class="fac-photo">
                    <img src="assets/img/beach.jpg" alt="Waves at the beach" style="object-position:center 55%">
                    <figcaption>Beach</figcaption>
                </div>
            </div>
        </figure>

        <figure class="fac-card reveal" style="--d:.2s">
            <div class="fac-frame" tabindex="0" role="button">
                <div class="fac-photo">
                    <img src="assets/img/event.jpg" alt="Event Place" style="object-position:center 55%">
                    <figcaption>Event Place</figcaption>
                </div>
            </div>
        </figure>

        <figure class="fac-card reveal" style="--d:.3s">
            <div class="fac-frame" tabindex="0" role="button">
                <div class="fac-photo">
                    <img src="assets/img/beach1.jpg" alt="Sunset at the beach" style="object-position:center 40%">
                    <figcaption>Beach</figcaption>
                </div>
            </div>
        </figure>

        <figure class="fac-card reveal" style="--d:.4s">
            <div class="fac-frame" tabindex="0" role="button">
                <div class="fac-photo">
                    <img src="assets/img/parking1.jpg" alt="Parking area" style="object-position:center 45%">
                    <figcaption>Parking</figcaption>
                </div>
            </div>
        </figure>

    </div>
</section>

<!-- PHOTO VIEWER: opens when a facilities picture is clicked -->
<div class="fac-lb" id="facLightbox" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
    <button type="button" class="fac-lb-close" aria-label="Close">
        <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>
    </button>
    <button type="button" class="fac-lb-nav fac-lb-prev" aria-label="Previous photo">
        <svg viewBox="0 0 10 14" width="12" height="16" aria-hidden="true"><path d="M8 1L2 7l6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <figure class="fac-lb-figure">
        <img src="" alt="">
        <figcaption></figcaption>
    </figure>
    <button type="button" class="fac-lb-nav fac-lb-next" aria-label="Next photo">
        <svg viewBox="0 0 10 14" width="12" height="16" aria-hidden="true"><path d="M2 1l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
</div>