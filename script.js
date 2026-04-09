// ── Scroll reveal ──────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Terminal typing effect (index.html only) ──────────────────────────────────
const termLines = document.querySelectorAll('.t-anim');
if (termLines.length) {
    termLines.forEach(line => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(8px)';
        line.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    });

    const delays = [400, 1200, 1900, 2600, 3300];
    termLines.forEach((line, i) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, delays[i] || i * 700);
    });
}

// ── Version badge — fetch latest GitHub tag ───────────────────────────────────
(async () => {
    const badge = document.getElementById('version-badge');
    if (!badge) return;
    try {
        const res = await fetch('https://api.github.com/repos/getzikra/zikra/tags', {
            headers: { 'Accept': 'application/vnd.github+json' }
        });
        if (!res.ok) return;
        const tags = await res.json();
        if (tags && tags.length && tags[0].name) {
            badge.textContent = tags[0].name.startsWith('v') ? tags[0].name : 'v' + tags[0].name;
        }
    } catch (_) {}
})();

// ── Active nav link highlight ─────────────────────────────────────────────────
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (
        href === page ||
        (page === '' && href === 'index.html') ||
        (page === 'index.html' && href === 'index.html')
    ) {
        a.classList.add('active');
    }
});
