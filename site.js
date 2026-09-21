// Fresh Merch — reveal au scroll (léger, respecte prefers-reduced-motion)
export function initReveal(root) {
  if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const els = root.querySelectorAll("[data-reveal]");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.style.opacity = "1"; en.target.style.transform = "none"; io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  els.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(22px)";
    el.style.transition = `opacity .7s cubic-bezier(.2,.75,.2,1) ${Math.min(i % 3, 2) * 80}ms, transform .7s cubic-bezier(.2,.75,.2,1) ${Math.min(i % 3, 2) * 80}ms`;
    io.observe(el);
  });
}
