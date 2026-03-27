/* ══════════════════════════════════════════════════
   HKFINANCEBRO — main.js
   Custom cursor · Magnetic buttons · Card tilt
   Terminal typewriter · Stat counters · Scroll reveal
══════════════════════════════════════════════════ */

// ── Custom Cursor ──────────────────────────────────────
const dot  = document.getElementById('c-dot');
const ring = document.getElementById('c-ring');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX  = mouseX;
let ringY  = mouseY;
let rafId;

if (dot && ring) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        rafId = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover state: enlarge ring over interactive elements
    document.querySelectorAll('a, button, [data-magnetic], label').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
    });
}

// ── Magnetic Buttons ───────────────────────────────────
document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width  / 2) * 0.28;
        const y = (e.clientY - rect.top  - rect.height / 2) * 0.28;
        btn.style.transform = `translate(${x}px, ${y}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), background 0.2s, box-shadow 0.3s';
        setTimeout(() => { btn.style.transition = ''; }, 500);
    });
});

// ── Card 3-D Tilt ──────────────────────────────────────
document.querySelectorAll('[data-tilt]').forEach(card => {
    const MAX_TILT = 4; // degrees

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotY =  dx * MAX_TILT;
        const rotX = -dy * MAX_TILT;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
        card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        setTimeout(() => { card.style.transition = ''; }, 600);
    });
});

// ── Terminal Typewriter ────────────────────────────────
const terminalEl = document.getElementById('terminal-code');
if (terminalEl) {
    const lines = [
        '$ python ib_model_builder.py --ticker 2899.HK',
        '',
        '  Loading sector config: mining.yaml',
        '  Fetching WSJ financial data...',
        '',
        '  Income statement      ████████████  done',
        '  Balance sheet         ████████████  done',
        '  Cash flow statement   ████████████  done',
        '',
        '  Building IB model structure...',
        '',
        '  Revenue CAGR (5Y)     +18.3%',
        '  EBITDA Margin         32.7%',
        '  Net Debt / EBITDA     1.2x',
        '  DCF Target Price      HKD 22.40',
        '',
        '  Model saved → 2899_ZIJIN_MODEL.xlsx ✓',
    ];

    let li = 0, ci = 0, out = '';

    function type() {
        if (li >= lines.length) { terminalEl.textContent = out; return; }
        const line = lines[li];
        if (ci < line.length) {
            out += line[ci];
            terminalEl.textContent = out + '▌';
            ci++;
            setTimeout(type, line.startsWith('$') ? 55 : 18);
        } else {
            out += '\n';
            terminalEl.textContent = out + '▌';
            li++; ci = 0;
            setTimeout(type, line === '' ? 70 : 150);
        }
    }

    setTimeout(type, 1800);
}

// ── Animated Stat Counters ─────────────────────────────
function countUp(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start    = performance.now();

    function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

const statEls = document.querySelectorAll('.stat-num');
if ('IntersectionObserver' in window && statEls.length) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    statEls.forEach(el => io.observe(el));
}

// ── Scroll Reveal for Feature Cards ───────────────────
const revealCards = document.querySelectorAll('.feature-card');
if ('IntersectionObserver' in window && revealCards.length) {
    const revealIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                revealIO.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealCards.forEach((card, i) => {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(28px) scale(0.99)';
        card.style.transition = `opacity 0.7s ease ${i * 0.14}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.14}s`;
        revealIO.observe(card);
    });
}

// ── Demo Modal ─────────────────────────────────────────
const modal   = document.getElementById('demo-modal');
const form    = document.getElementById('demo-form');
const success = document.getElementById('form-success');

function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        const first = modal.querySelector('input[type="radio"]');
        if (first) first.focus();
    }, 350);
}

function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
}

document.getElementById('hero-demo-btn').addEventListener('click', openModal);
document.getElementById('nav-demo-btn').addEventListener('click', openModal);
document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

// Form submit — email assembled in JS, never in HTML
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const service = form.querySelector('input[name="service"]:checked');
        const name    = document.getElementById('demo-name').value.trim();
        const email   = document.getElementById('demo-email').value.trim();
        const message = document.getElementById('demo-message').value.trim();

        if (!service) {
            const legend = form.querySelector('.form-legend');
            legend.style.color = 'var(--red)';
            legend.textContent = 'PLEASE SELECT A SERVICE ↓';
            setTimeout(() => {
                legend.style.color = '';
                legend.textContent = "I'M INTERESTED IN";
            }, 2500);
            return;
        }

        const dest    = ['admin', 'hkfinancebro.com'].join('@');
        const subject = encodeURIComponent(`Demo Request — ${service.value}`);
        const body    = encodeURIComponent(
            `Service: ${service.value}\nName: ${name}\nEmail: ${email}\n\n${message}`
        );

        window.location.href = `mailto:${dest}?subject=${subject}&body=${body}`;

        form.querySelectorAll('input, textarea, button[type="submit"]')
            .forEach(el => el.disabled = true);
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}
