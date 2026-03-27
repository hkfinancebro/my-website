// ── Terminal Typewriter ────────────────────────────────
const terminalLines = [
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

const el = document.getElementById('terminal-code');
if (el) {
    let lineIdx = 0;
    let charIdx = 0;
    let output = '';

    function typeNext() {
        if (lineIdx >= terminalLines.length) {
            el.textContent = output;
            return;
        }

        const line = terminalLines[lineIdx];

        if (charIdx < line.length) {
            output += line[charIdx];
            el.textContent = output + '▌';
            charIdx++;
            const delay = line.startsWith('$') ? 55 : 20;
            setTimeout(typeNext, delay);
        } else {
            output += '\n';
            el.textContent = output + '▌';
            lineIdx++;
            charIdx = 0;
            const pause = line === '' ? 80 : 160;
            setTimeout(typeNext, pause);
        }
    }

    setTimeout(typeNext, 1800);
}

// ── Scroll-reveal for feature cards ───────────────────
const cards = document.querySelectorAll('.feature-card');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`;
        observer.observe(card);
    });
}

// ── Demo Modal ─────────────────────────────────────────
const modal   = document.getElementById('demo-modal');
const form    = document.getElementById('demo-form');
const success = document.getElementById('form-success');

function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    // Focus first radio after transition
    setTimeout(() => {
        const first = modal.querySelector('input[type="radio"]');
        if (first) first.focus();
    }, 300);
}

function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
}

// Open triggers
document.getElementById('hero-demo-btn').addEventListener('click', openModal);
document.getElementById('nav-demo-btn').addEventListener('click', openModal);

// Close triggers
document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

// ── Form submission (mailto, email not in HTML source) ─
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const service = form.querySelector('input[name="service"]:checked');
    const name    = document.getElementById('demo-name').value.trim();
    const email   = document.getElementById('demo-email').value.trim();
    const message = document.getElementById('demo-message').value.trim();

    if (!service) {
        const legend = form.querySelector('.form-legend');
        legend.style.color = 'var(--red)';
        setTimeout(() => legend.style.color = '', 2000);
        return;
    }

    // Assemble destination without exposing in markup
    const dest = ['admin', 'hkfinancebro.com'].join('@');
    const subject = encodeURIComponent(`Demo Request — ${service.value}`);
    const body = encodeURIComponent(
        `Service: ${service.value}\nName: ${name}\nEmail: ${email}\n\n${message}`
    );

    window.location.href = `mailto:${dest}?subject=${subject}&body=${body}`;

    // Show success state
    form.querySelectorAll('input, textarea, button[type="submit"]')
        .forEach(el => el.disabled = true);
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
