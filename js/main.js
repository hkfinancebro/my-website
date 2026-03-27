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
            // Remove cursor and done
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

    // Start after page load animation settles
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
