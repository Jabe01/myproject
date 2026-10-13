<!-- ABOUT US SECTION: "Why Choose Us?" + guest reviews + resort footer
     (included by index.php, below the facilities). Fits exactly one screen.
     Site footer "About Us" -> #about, "Contact" -> #contact (the contact column below) -->
<section class="about" id="about">

    <div class="about-top">

        <h2 class="about-title reveal">Why Choose Us?</h2>

        <p class="about-text reveal" style="--d:.15s">
            We offer everything you need for an unforgettable getaway in one place, from
            crystal-clear pool waters and direct shore access to cozy accommodations, boat rides,
            and even spacious venues for your tropical retreat seamless and memorable.
        </p>

        <h3 class="about-sub reveal" style="--d:.3s">Hear from our guests</h3>
    </div>

    <!-- GUEST REVIEWS (arrows rotate the cards).
         Cards are empty for now. To add a feedback, fill the <blockquote> with the guest's words
         (e.g. &ldquo;Great stay!&rdquo;) and the <figcaption> with the name (e.g. &ndash;Leanne). -->
    <div class="about-reviews reveal" style="--d:.4s" id="aboutReviews">
        <button type="button" class="about-arrow about-prev" aria-label="Previous review">
            <svg viewBox="0 0 14 30" aria-hidden="true"><path d="M12 1L2 15l10 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <div class="about-cards" aria-live="polite">
            <figure class="about-card">
                <span class="about-quote" aria-hidden="true">&rdquo;</span>
                <blockquote></blockquote>
                <figcaption></figcaption>
            </figure>
            <figure class="about-card">
                <span class="about-quote" aria-hidden="true">&rdquo;</span>
                <blockquote></blockquote>
                <figcaption></figcaption>
            </figure>
            <figure class="about-card">
                <span class="about-quote" aria-hidden="true">&rdquo;</span>
                <blockquote></blockquote>
                <figcaption></figcaption>
            </figure>
        </div>

        <button type="button" class="about-arrow about-next" aria-label="Next review">
            <svg viewBox="0 0 14 30" aria-hidden="true"><path d="M2 1l10 14L2 29" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
    </div>

    <!-- FOOTER (wavy top, palm leaves in the corners) -->
    <footer class="about-footer">
        <svg class="about-wave" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
            <path class="wave-fill" d="M0 20C240 4 470 30 720 15S1200 2 1440 18V40H0Z"/>
            <path class="wave-line" d="M0 20C240 4 470 30 720 15S1200 2 1440 18" vector-effect="non-scaling-stroke"/>
        </svg>

        <svg class="about-leaf about-leaf-l" viewBox="0 0 70 120" aria-hidden="true"><path d="M2 118 Q18 50 64 6" fill="none" stroke="currentColor" stroke-width="1.6"/><ellipse cx="0.1" cy="100.3" rx="8.1" ry="2.1" transform="rotate(-126.3 0.1 100.3)"/><ellipse cx="12.4" cy="103.8" rx="8.1" ry="2.1" transform="rotate(-22.3 12.4 103.8)"/><ellipse cx="3.9" cy="89.6" rx="7.7" ry="2.1" transform="rotate(-123.8 3.9 89.6)"/><ellipse cx="15.4" cy="93.4" rx="7.7" ry="2.1" transform="rotate(-19.8 15.4 93.4)"/><ellipse cx="8.1" cy="79.2" rx="7.3" ry="2.1" transform="rotate(-121.2 8.1 79.2)"/><ellipse cx="18.9" cy="83.3" rx="7.3" ry="2.1" transform="rotate(-17.2 18.9 83.3)"/><ellipse cx="12.7" cy="69.2" rx="6.9" ry="2.1" transform="rotate(-118.6 12.7 69.2)"/><ellipse cx="22.7" cy="73.6" rx="6.9" ry="2.1" transform="rotate(-14.6 22.7 73.6)"/><ellipse cx="17.7" cy="59.6" rx="6.6" ry="2.1" transform="rotate(-115.8 17.7 59.6)"/><ellipse cx="27.0" cy="64.2" rx="6.6" ry="2.1" transform="rotate(-11.8 27.0 64.2)"/><ellipse cx="23.1" cy="50.3" rx="6.2" ry="2.1" transform="rotate(-113.0 23.1 50.3)"/><ellipse cx="31.6" cy="55.0" rx="6.2" ry="2.1" transform="rotate(-9.0 31.6 55.0)"/><ellipse cx="28.9" cy="41.4" rx="5.8" ry="2.1" transform="rotate(-110.2 28.9 41.4)"/><ellipse cx="36.6" cy="46.2" rx="5.8" ry="2.1" transform="rotate(-6.2 36.6 46.2)"/><ellipse cx="35.1" cy="32.9" rx="5.4" ry="2.1" transform="rotate(-107.3 35.1 32.9)"/><ellipse cx="42.0" cy="37.7" rx="5.4" ry="2.1" transform="rotate(-3.3 42.0 37.7)"/><ellipse cx="41.6" cy="24.7" rx="5.0" ry="2.1" transform="rotate(-104.4 41.6 24.7)"/><ellipse cx="47.9" cy="29.5" rx="5.0" ry="2.1" transform="rotate(-0.4 47.9 29.5)"/><ellipse cx="48.6" cy="16.8" rx="4.6" ry="2.1" transform="rotate(-101.5 48.6 16.8)"/><ellipse cx="54.1" cy="21.5" rx="4.6" ry="2.1" transform="rotate(2.5 54.1 21.5)"/><ellipse cx="55.9" cy="9.3" rx="4.2" ry="2.1" transform="rotate(-98.6 55.9 9.3)"/><ellipse cx="60.7" cy="13.9" rx="4.2" ry="2.1" transform="rotate(5.4 60.7 13.9)"/></svg>
        <svg class="about-leaf about-leaf-r" viewBox="0 0 70 120" aria-hidden="true"><path d="M2 118 Q18 50 64 6" fill="none" stroke="currentColor" stroke-width="1.6"/><ellipse cx="0.1" cy="100.3" rx="8.1" ry="2.1" transform="rotate(-126.3 0.1 100.3)"/><ellipse cx="12.4" cy="103.8" rx="8.1" ry="2.1" transform="rotate(-22.3 12.4 103.8)"/><ellipse cx="3.9" cy="89.6" rx="7.7" ry="2.1" transform="rotate(-123.8 3.9 89.6)"/><ellipse cx="15.4" cy="93.4" rx="7.7" ry="2.1" transform="rotate(-19.8 15.4 93.4)"/><ellipse cx="8.1" cy="79.2" rx="7.3" ry="2.1" transform="rotate(-121.2 8.1 79.2)"/><ellipse cx="18.9" cy="83.3" rx="7.3" ry="2.1" transform="rotate(-17.2 18.9 83.3)"/><ellipse cx="12.7" cy="69.2" rx="6.9" ry="2.1" transform="rotate(-118.6 12.7 69.2)"/><ellipse cx="22.7" cy="73.6" rx="6.9" ry="2.1" transform="rotate(-14.6 22.7 73.6)"/><ellipse cx="17.7" cy="59.6" rx="6.6" ry="2.1" transform="rotate(-115.8 17.7 59.6)"/><ellipse cx="27.0" cy="64.2" rx="6.6" ry="2.1" transform="rotate(-11.8 27.0 64.2)"/><ellipse cx="23.1" cy="50.3" rx="6.2" ry="2.1" transform="rotate(-113.0 23.1 50.3)"/><ellipse cx="31.6" cy="55.0" rx="6.2" ry="2.1" transform="rotate(-9.0 31.6 55.0)"/><ellipse cx="28.9" cy="41.4" rx="5.8" ry="2.1" transform="rotate(-110.2 28.9 41.4)"/><ellipse cx="36.6" cy="46.2" rx="5.8" ry="2.1" transform="rotate(-6.2 36.6 46.2)"/><ellipse cx="35.1" cy="32.9" rx="5.4" ry="2.1" transform="rotate(-107.3 35.1 32.9)"/><ellipse cx="42.0" cy="37.7" rx="5.4" ry="2.1" transform="rotate(-3.3 42.0 37.7)"/><ellipse cx="41.6" cy="24.7" rx="5.0" ry="2.1" transform="rotate(-104.4 41.6 24.7)"/><ellipse cx="47.9" cy="29.5" rx="5.0" ry="2.1" transform="rotate(-0.4 47.9 29.5)"/><ellipse cx="48.6" cy="16.8" rx="4.6" ry="2.1" transform="rotate(-101.5 48.6 16.8)"/><ellipse cx="54.1" cy="21.5" rx="4.6" ry="2.1" transform="rotate(2.5 54.1 21.5)"/><ellipse cx="55.9" cy="9.3" rx="4.2" ry="2.1" transform="rotate(-98.6 55.9 9.3)"/><ellipse cx="60.7" cy="13.9" rx="4.2" ry="2.1" transform="rotate(5.4 60.7 13.9)"/></svg>

        <div class="about-foot-grid">

            <div class="about-foot-col about-foot-brand">
                <a class="about-foot-logo" href="./" aria-label="On Shore Beach Resort - back to top">
                    <img src="assets/img/logo.jpg" alt="On Shore Beach Resort">
                </a>
                <div>
                    <h4>Get Social</h4>
                    <!-- Facebook is set; replace the "#" of X and Instagram with your real page links -->
                    <ul class="about-social">
                        <li><a href="https://www.facebook.com/profile.php?id=61583746054010" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.2H7.7V13h2.7v8z"/></svg></a></li>
                        <li><a href="#" aria-label="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.8 4h2.9l-6.3 7.2L21.8 20h-5.8l-4.5-5.9L6.3 20H3.4l6.7-7.7L2.9 4h5.9l4.1 5.4zm-1 14.3h1.6L7.9 5.6H6.2z"/></svg></a></li>
                        <li><a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M8 3h8a5 5 0 015 5v8a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5zm0 2a3 3 0 00-3 3v8a3 3 0 003 3h8a3 3 0 003-3V8a3 3 0 00-3-3zm4 2.8a4.2 4.2 0 110 8.4 4.2 4.2 0 010-8.4zm0 2a2.2 2.2 0 100 4.4 2.2 2.2 0 000-4.4zm4.6-3.4a1 1 0 110 2 1 1 0 010-2z"/></svg></a></li>
                    </ul>
                    <a class="about-tag" href="https://www.facebook.com/profile.php?id=61583746054010" target="_blank" rel="noopener">Tag us in your photos!</a>
                </div>
            </div>

            <nav class="about-foot-col about-foot-acc" aria-label="Accommodations">
                <h4><a href="#accommodations">Accommodations</a></h4>
                <ul>
                    <li><a href="#accommodations">Rooms</a></li>
                    <li><a href="#accommodations">Cottages</a></li>
                    <li><a href="#accommodations">Tree House</a></li>
                </ul>
            </nav>

            <nav class="about-foot-col about-foot-nav" aria-label="Site">
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#facilities">Gallery</a></li>
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#my-booking">My Booking</a></li>
                </ul>
            </nav>

            <address class="about-foot-col about-foot-contact" id="contact">
                <div>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"/></svg>
                    <p><strong>Address:</strong>Apacible Boulevard Wawa, Nasugbu<br>4231 Batangas Philippines</p>
                </div>
                <div>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm1.6 2L12 12.6 19.4 7z"/></svg>
                    <p class="inline"><strong>Email:</strong><a href="mailto:ewanko@gmail.com">ewanko@gmail.com</a></p>
                </div>
                <div>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11 11 0 003.5.55 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.2.2 2.4.55 3.5a1 1 0 01-.25 1z"/></svg>
                    <p class="inline"><strong>Phone:</strong><a href="tel:+639278341455">0927 834 1455</a></p>
                </div>
            </address>

        </div>
    </footer>

</section>