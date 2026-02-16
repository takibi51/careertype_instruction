/* ============================================
   キャリアタイプ診断 説明スライド — slides.js
   ============================================ */

(function () {
    'use strict';

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-nav-dot');
    const prevBtn = document.getElementById('arrow-prev');
    const nextBtn = document.getElementById('arrow-next');
    const counter = document.getElementById('slide-counter');
    const progressBar = document.getElementById('progress-bar');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let isAnimating = false;

    /* ---------- helpers ---------- */
    function updateUI() {
        const pct = ((currentIndex + 1) / totalSlides) * 100;
        progressBar.style.width = pct + '%';

        counter.textContent = String(currentIndex + 1).padStart(2, '0') + ' / ' + String(totalSlides).padStart(2, '0');

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalSlides - 1;

        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === currentIndex);
        });
    }

    function goTo(index) {
        if (isAnimating || index === currentIndex || index < 0 || index >= totalSlides) return;
        isAnimating = true;

        const current = slides[currentIndex];
        const next = slides[index];

        current.classList.remove('active');
        current.classList.add('exiting');

        next.classList.add('active');

        setTimeout(function () {
            current.classList.remove('exiting');
            isAnimating = false;
        }, 750);

        currentIndex = index;
        updateUI();
    }

    function goNext() {
        goTo(currentIndex + 1);
    }
    function goPrev() {
        goTo(currentIndex - 1);
    }

    /* ---------- events ---------- */
    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            goTo(i);
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            goNext();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goPrev();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            goNext();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            goPrev();
        }
    });

    // Touch / swipe support
    let touchStartY = 0;
    let touchStartX = 0;

    document.addEventListener('touchstart', function (e) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        const dy = e.changedTouches[0].clientY - touchStartY;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDx < 40 && absDy < 40) return;

        if (absDx > absDy) {
            if (dx < -40) goNext();
            else if (dx > 40) goPrev();
        } else {
            if (dy < -40) goNext();
            else if (dy > 40) goPrev();
        }
    }, { passive: true });

    // Mouse wheel
    let wheelTimeout = null;
    document.addEventListener('wheel', function (e) {
        if (wheelTimeout) return;
        wheelTimeout = setTimeout(function () {
            wheelTimeout = null;
        }, 1000);
        if (e.deltaY > 30) goNext();
        else if (e.deltaY < -30) goPrev();
    }, { passive: true });

    /* ---------- init ---------- */
    slides[0].classList.add('active');
    updateUI();

})();
