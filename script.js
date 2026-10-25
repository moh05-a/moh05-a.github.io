const USER = "moh05-a";
const GH = `https://github.com/${USER}`;
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Featured projects (summarised from each repo's README) ----
const PROJECTS = [
  { repo: "TahonaOS", icon: "🦷", kind: "Product", title: "Tahona — Dental Clinic OS", cats: [".NET"],
    blurb: "Clinic management for independent dental clinics in Jordan and MENA: patients, appointments, dental chart, treatment plans, billing and reports.",
    points: ["“Revenue Recovery” view: who to contact today (unstarted plans, no-shows, unpaid balances, recalls)",
             "English + Arabic with full RTL, JOD currency, light/dark themes",
             "Role-based permissions, Docker setup and a documented, tested roadmap to pilot"],
    tags: ["C# / .NET", "TypeScript", "Docker", "i18n / RTL"] },
  { repo: "SeniorCare", icon: "🩺", kind: "Mobile app", title: "SeniorCare", cats: ["React", "Mobile"],
    blurb: "A calm, accessible mobile app that lets seniors book licensed nurses for at-home health visits.",
    points: ["Book blood work, pressure & sugar checks, heart checks and medicine reviews",
             "Medicine dose tracker with refill reminders; passwordless, large-type UI",
             "English + Arabic (RTL); Expo / React Native client with an Express API"],
    tags: ["React Native", "Expo", "TypeScript", "Express"] },
  { repo: "Ramadi-Cycle", icon: "🌱", kind: "Hackathon", ribbon: "JOSA Hacktoberfest ’26", title: "Ramadi-Cycle", cats: ["Python", "AI"],
    blurb: "Shows a Jordanian household what its greywater can grow: a local AI model designs a garden that recycled water and winter rain can keep alive all year.",
    points: ["Runs fully offline on a local LLM (Ollama). No cloud, no accounts, no personal data",
             "Code validates every litre and every plant the model suggests",
             "Calculates tanker trips, dinars and CO₂ saved, plus a priced plumbing build plan"],
    tags: ["Python", "LLMs / Ollama", "TypeScript", "Streamlit"] },
  { repo: "UniSys", icon: "🎓", kind: "Solo project", title: "UniSys — University Management", cats: [".NET", "React"],
    blurb: "Full-stack university management system for students, tutors and subjects, with an admin dashboard.",
    points: ["ASP.NET Core Web API with Entity Framework and PostgreSQL",
             "RabbitMQ messaging and xUnit test suite",
             "React + Vite admin dashboard talking to a RESTful API"],
    tags: ["ASP.NET Core", "PostgreSQL", "RabbitMQ", "React"] },
  { repo: "bennayaOS", icon: "🏗️", kind: "Product", title: "BennayaOS", cats: [".NET", "React"],
    blurb: "Financial and operational project management for small and medium construction contractors. Arabic-first, starting in Jordan.",
    points: ["Tracks payments, clients and materials per project",
             "Layered ASP.NET Core 10 API: thin controllers, services, DTOs, EF Core migrations",
             "React 19 + TypeScript + Tailwind 4 frontend, OpenAPI docs via Scalar"],
    tags: [".NET 10", "EF Core", "PostgreSQL", "React 19"] },
  { repo: "hos-trip-planner", icon: "🚚", kind: "Full-stack", title: "HOS Trip Planner", cats: ["Python", "React"],
    blurb: "Plans a truck trip under the US FMCSA Hours-of-Service rules and produces the paperwork automatically.",
    points: ["Simulation-based scheduler inserts legally required breaks, 10-hour rests, 34-hour restarts and fuel stops",
             "Route map with every stop",
             "Generates filled-in Driver’s Daily Log sheets drawn like the paper form"],
    tags: ["Django", "Python", "React", "Maps"] },
];
const FILTERS = ["All", ".NET", "React", "Python", "AI", "Mobile"];

$("project-grid").innerHTML = PROJECTS.map(p => `
  <article class="card project" data-cats="${p.cats.join("|")}">
    <div class="ph">${p.icon}${p.ribbon ? `<span class="ribbon">🏆 ${p.ribbon}</span>` : ""}</div>
    <div class="pmeta"><span>${p.kind}</span><span>${p.tags[0]}</span></div>
    <h4>${p.title}</h4>
    <p>${p.blurb}</p>
    <ul>${p.points.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
    <div class="plinks"><a href="${GH}/${p.repo}" target="_blank" rel="noopener">View code ↗</a></div>
  </article>`).join("");

$("filters").innerHTML = FILTERS.map((f, i) => `<button type="button" aria-pressed="${i === 0}">${f}</button>`).join("");
$("filters").addEventListener("click", e => {
  const btn = e.target.closest("button"); if (!btn) return;
  $("filters").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b === btn));
  const f = btn.textContent;
  document.querySelectorAll(".project").forEach(c =>
    c.classList.toggle("hide", f !== "All" && !c.dataset.cats.split("|").includes(f)));
});

// ---- Skills (from resume) ----
const SKILLS = {
  "Languages": ["Python", "C", "C++", "C#", "JavaScript", "TypeScript", "SQL"],
  "Backend": [".NET", "ASP.NET Core", "Entity Framework", "REST APIs", "PostgreSQL", "Django", "RabbitMQ"],
  "Frontend & Mobile": ["React", "TypeScript", "Next.js", "Tailwind CSS", "React Native", "HTML/CSS"],
  "Cloud & DevOps": ["AWS (Certified)", "Docker", "Git", "CI/CD", "Linux"],
  "AI & LLMs": ["Claude API", "Claude Code", "Ollama / local LLMs", "LLM integration", "Prompt engineering"],
  "Concepts": ["OOP", "Data modeling", "Testing (xUnit)", "i18n / RTL", "ML fundamentals"],
};
$("skills-grid").innerHTML = Object.entries(SKILLS).map(([k, v]) =>
  `<div class="card"><h4>${k}</h4><div class="tags">${v.map(s => `<span>${s}</span>`).join("")}</div></div>`).join("");

$("year").textContent = new Date().getFullYear();

// ---- Typing effect ----
const roles = ["Software Engineer", "Backend Developer (.NET)", "Full-Stack Developer", "AWS Certified · AI Practitioner"];
if (reduceMotion) $("typed").textContent = roles[0];
else {
  let ri = 0, ci = 0, del = false;
  (function tick() {
    const w = roles[ri];
    $("typed").textContent = w.slice(0, ci);
    if (!del && ci === w.length) { del = true; return setTimeout(tick, 1600); }
    if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    ci += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 75);
  })();
}

// ---- Nav: progress bar, scrolled state, scrollspy, mobile menu ----
const nav = $("nav"), menu = $("menu"), burger = $("burger");
addEventListener("scroll", () => {
  const h = document.documentElement;
  $("progress").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
  nav.classList.toggle("scrolled", scrollY > 30);
}, { passive: true });

const links = [...menu.querySelectorAll("a:not(.btn)")];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.hash === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));

const setMenu = open => { menu.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); };
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", e => e.target.closest("a") && setMenu(false));

// ---- Reveal & counters ----
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .1 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

document.querySelectorAll("[data-count]").forEach(el => {
  const to = +el.dataset.count, suf = el.dataset.suffix || "";
  if (reduceMotion) return (el.textContent = to + suf);
  let n = 0;
  const step = () => { n = Math.min(to, n + Math.max(.25, to / 40)); el.textContent = Math.round(n) + suf; if (n < to) requestAnimationFrame(step); };
  setTimeout(step, reduceMotion ? 0 : 600);
});

// ---- Card spotlight ----
document.addEventListener("pointermove", e => {
  const c = e.target.closest?.(".card"); if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty("--mx", e.clientX - r.left + "px");
  c.style.setProperty("--my", e.clientY - r.top + "px");
});

// ---- Contact: copy email, optional CV ----
const toast = msg => { const t = $("toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2200); };
$("copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText("mameerah42@gmail.com"); toast("Email copied ✓"); }
  catch { toast("mameerah42@gmail.com"); }
});
fetch("resume.pdf", { method: "HEAD" }).then(r => { if (r.ok) $("cv").hidden = false; }).catch(() => {});

// ---- GitHub: language bar + repo cards ----
// Fixed categorical order; color follows the language, never its rank on a given load.
const SERIES = ["--s1", "--s2", "--s3", "--s4", "--s5"].map(v => `var(${v})`);
const OTHER = "var(--s-other)";
const ago = iso => {
  const d = Math.round((Date.now() - new Date(iso)) / 864e5);
  return d < 1 ? "today" : d < 30 ? `${d}d ago` : d < 365 ? `${Math.round(d / 30)}mo ago` : `${Math.round(d / 365)}y ago`;
};

async function loadGitHub() {
  let data = null;
  try { const r = await fetch("repos.json"); if (r.ok) data = await r.json(); } catch {}
  if (!data) {
    try {
      const r = await fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=100`);
      if (r.ok) data = await r.json();
    } catch {}
  }
  // repos.json from build.py is {repos, languages}; the raw API is an array.
  let repos = Array.isArray(data) ? data : data?.repos || [];
  repos = repos.filter(r => !r.fork && r.name.toLowerCase() !== USER.toLowerCase())
    .sort((a, b) => !a.description - !b.description);  // empty repos last (stable sort keeps recency)
  let langs = data?.languages, unit = "of code";
  if (!langs) {
    langs = {}; unit = "of repos";
    repos.forEach(r => r.language && (langs[r.language] = (langs[r.language] || 0) + 1));
  }

  const entries = Object.entries(langs).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const color = {};
  const top = entries.slice(0, 5);
  top.forEach(([l], i) => color[l] = SERIES[i]);
  const rest = entries.slice(5).reduce((s, [, v]) => s + v, 0);
  const rows = [...top, ...(rest ? [["Other", rest]] : [])];
  const pct = v => (v / total * 100);

  if (total) {
    $("langs-note").textContent = `${repos.length} public repos · share ${unit}`;
    $("lang-bar").innerHTML = rows.map(([l, v]) =>
      `<div style="flex:${v};background:${color[l] || OTHER}" data-tip="${esc(l)} · ${pct(v).toFixed(1)}%"></div>`).join("");
    $("lang-legend").innerHTML = rows.map(([l, v]) =>
      `<span><i style="background:${color[l] || OTHER}"></i>${esc(l)} <em>${pct(v).toFixed(1)}%</em></span>`).join("");
    $("lang-bar").setAttribute("aria-label", "Share of code by language: " + rows.map(([l, v]) => `${l} ${pct(v).toFixed(0)}%`).join(", "));
  } else document.querySelector(".langs").remove();

  const box = $("repos");
  if (!repos.length) {
    box.innerHTML = `<a class="card repo" href="${GH}" target="_blank" rel="noopener"><h4>github.com/${USER}</h4><p>See all my repositories on GitHub →</p></a>`;
    return;
  }
  box.innerHTML = repos.slice(0, 9).map(r => `
    <a class="card repo" href="${esc(r.html_url)}" target="_blank" rel="noopener">
      <h4>${esc(r.name)}</h4>
      <p>${esc(r.description || "Work in progress.")}</p>
      <div class="meta">
        ${r.language ? `<span><span class="lang" style="background:${color[r.language] || OTHER}"></span>${esc(r.language)}</span>` : ""}
        <span>★ ${r.stargazers_count ?? 0}</span>
        ${r.updated_at ? `<span>Updated ${ago(r.updated_at)}</span>` : ""}
      </div>
    </a>`).join("");
}
loadGitHub();

// Tooltip for the language bar
const tip = $("tip");
$("lang-bar").addEventListener("pointermove", e => {
  const t = e.target.dataset?.tip; if (!t) return (tip.hidden = true);
  tip.textContent = t; tip.hidden = false;
  tip.style.left = Math.min(e.clientX + 12, innerWidth - tip.offsetWidth - 8) + "px";
  tip.style.top = e.clientY - 38 + "px";
});
$("lang-bar").addEventListener("pointerleave", () => tip.hidden = true);

// ---- Animated network background (pauses when hidden, static if reduced motion) ----
const cv = $("bg"), cx = cv.getContext("2d");
let W, H, pts = [], running = true;
const mouse = { x: -999, y: -999 };
function resize() {
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  pts = Array.from({ length: Math.min(90, Math.floor(W * H / 16000)) }, () => ({
    x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
  if (reduceMotion) frame();
}
function frame() {
  cx.clearRect(0, 0, W, H);
  const g = cx.createRadialGradient(W * .8, H * .1, 0, W * .8, H * .1, W * .6);
  g.addColorStop(0, "rgba(99,102,241,.16)"); g.addColorStop(1, "transparent");
  cx.fillStyle = g; cx.fillRect(0, 0, W, H);
  for (const p of pts) {
    if (!reduceMotion) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    cx.fillStyle = "rgba(6,182,212,.7)"; cx.beginPath(); cx.arc(p.x, p.y, 1.6, 0, 7); cx.fill();
  }
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 130) { cx.strokeStyle = `rgba(99,102,241,${.25 * (1 - d / 130)})`; cx.beginPath(); cx.moveTo(pts[i].x, pts[i].y); cx.lineTo(pts[j].x, pts[j].y); cx.stroke(); }
    }
    const dm = Math.hypot(pts[i].x - mouse.x, pts[i].y - mouse.y);
    if (dm < 160) { cx.strokeStyle = `rgba(236,72,153,${.5 * (1 - dm / 160)})`; cx.beginPath(); cx.moveTo(pts[i].x, pts[i].y); cx.lineTo(mouse.x, mouse.y); cx.stroke(); }
  }
}
function loop() { if (!running) return; frame(); requestAnimationFrame(loop); }
addEventListener("resize", resize);
resize();
if (!reduceMotion) {
  addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) loop(); });
  loop();
}
