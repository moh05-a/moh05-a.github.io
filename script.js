const USER = "moh05-a";
const GH = `https://github.com/${USER}`;
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---- Selected work (summarised from each repo's README) ----
const PROJECTS = [
  { repo: "TahonaOS", title: "Tahona", sub: "Dental clinic OS", type: "Product", cats: [".NET"],
    stack: "C# / .NET, TypeScript, Docker",
    blurb: "Clinic management for independent dental clinics in Jordan and the wider MENA region: patients, appointments, the dental chart, treatment plans, billing and reports.",
    points: ["A daily Revenue Recovery view lists which patients to contact and why: unstarted plans, no-shows, unpaid balances, recalls.",
             "English and Arabic with full right-to-left layout, JOD currency, Amman time zone, light and dark themes.",
             "Role-based permissions, Docker setup and a documented roadmap to a supervised pilot."] },
  { repo: "SeniorCare", title: "SeniorCare", sub: "At-home nursing for older adults", type: "Mobile app", cats: ["React", "Mobile"],
    stack: "React Native, Expo, TypeScript, Express",
    blurb: "A calm, accessible mobile app that lets seniors book licensed nurses for health visits at home.",
    points: ["Book blood work, pressure and sugar checks, heart checks and medicine reviews in a few taps.",
             "Medicine dose tracker with refill reminders. No passwords, large type throughout.",
             "Bilingual English / Arabic (RTL), with an Expo client and an Express API in a pnpm workspace."] },
  { repo: "Ramadi-Cycle", title: "Ramadi-Cycle", sub: "Greywater garden planner", type: "Hackathon", cats: ["Python", "AI"],
    badge: "JOSA Hacktoberfest ’26 · Green Tech",
    stack: "Python, local LLMs (Ollama), TypeScript, Streamlit",
    blurb: "Shows a Jordanian household what its greywater can grow. A local AI model designs a garden that shower, sink and laundry water, plus winter rain, can keep alive every month of the year.",
    points: ["Runs entirely offline on one laptop: no cloud, no accounts, no personal data.",
             "Every plant the model suggests and every litre is checked in code before the user sees the plan.",
             "Reports tanker trips, dinars and CO₂ saved, plus a priced build plan for the plumbing."] },
  { repo: "UniSys", title: "UniSys", sub: "University management system", type: "Solo project", cats: [".NET", "React"],
    stack: "ASP.NET Core, EF Core, PostgreSQL, RabbitMQ, React",
    blurb: "A full-stack system for managing students, tutors and subjects, with an admin dashboard on top of a RESTful API.",
    points: ["ASP.NET Core Web API with Entity Framework and PostgreSQL.",
             "RabbitMQ messaging between services and an xUnit test suite.",
             "React + Vite admin dashboard consuming the API."] },
  { repo: "bennayaOS", title: "BennayaOS", sub: "Operations for construction contractors", type: "Product", cats: [".NET", "React"],
    stack: ".NET 10, EF Core, PostgreSQL, React 19, Tailwind",
    blurb: "Financial and operational project management for small and medium construction contractors. Arabic-first, starting in Jordan.",
    points: ["Tracks payments, clients and materials per project.",
             "Layered API: thin controllers, services, DTOs and EF Core migrations.",
             "React 19 + TypeScript front end, with OpenAPI docs served through Scalar."] },
  { repo: "hos-trip-planner", title: "HOS Trip Planner", sub: "Hours-of-service trip planning", type: "Full-stack", cats: ["Python", "React"],
    stack: "Django, Python, React, maps",
    blurb: "Plans a truck trip under the US FMCSA Hours-of-Service rules and produces the paperwork automatically.",
    points: ["A step-by-step scheduler inserts the legally required breaks, 10-hour rests, 34-hour restarts and fuel stops.",
             "Route map showing every stop along the way.",
             "Generates filled-in Driver’s Daily Log sheets, drawn like the paper form."] },
];
const FILTERS = ["All", ".NET", "React", "Python", "AI", "Mobile"];

$("work-list").innerHTML = PROJECTS.map((p, i) => `
  <article class="work reveal" data-cats="${p.cats.join("|")}">
    <span class="work-idx">${String(i + 1).padStart(2, "0")}</span>
    <div class="work-head">
      <h3>${p.title}</h3>
      <p class="work-sub">${p.sub}</p>
      <dl class="work-meta"><dt>Type</dt><dd>${p.type}</dd><dt>Stack</dt><dd>${p.stack}</dd></dl>
      <a class="ul" href="${GH}/${p.repo}" target="_blank" rel="noopener">View source <span class="arrow" aria-hidden="true">↗</span></a>
      ${p.badge ? `<br><span class="badge mono">${p.badge}</span>` : ""}
    </div>
    <div class="work-body">
      <p class="work-blurb">${p.blurb}</p>
      <ol class="work-points">${p.points.map(x => `<li>${x}</li>`).join("")}</ol>
    </div>
  </article>`).join("");

const count = f => f === "All" ? PROJECTS.length : PROJECTS.filter(p => p.cats.includes(f)).length;
$("filters").innerHTML = FILTERS.map((f, i) =>
  `<button type="button" data-f="${f}" aria-pressed="${i === 0}">${f}<sup>${count(f)}</sup></button>`).join("");
$("filters").addEventListener("click", e => {
  const btn = e.target.closest("button"); if (!btn) return;
  $("filters").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b === btn));
  const f = btn.dataset.f;
  document.querySelectorAll(".work").forEach(w =>
    w.classList.toggle("hide", f !== "All" && !w.dataset.cats.split("|").includes(f)));
});

// ---- Toolbox (from résumé) ----
const TOOLBOX = {
  "Languages": ["C#", "TypeScript", "Python", "JavaScript", "SQL", "C / C++"],
  "Backend": [".NET / .NET Core", "ASP.NET Core", "Entity Framework", "REST APIs", "PostgreSQL", "Django", "RabbitMQ"],
  "Frontend & mobile": ["React", "Next.js", "Tailwind CSS", "React Native", "HTML / CSS"],
  "Cloud & DevOps": ["AWS (certified)", "Docker", "CI/CD", "Git", "Linux"],
  "AI & LLMs": ["Claude API", "Claude Code", "Ollama / local models", "Prompt engineering"],
  "Practice": ["OOP", "Data modeling", "Testing (xUnit)", "i18n / RTL", "ML fundamentals"],
};
$("toolbox-grid").innerHTML = Object.entries(TOOLBOX).map(([k, v]) =>
  `<div><h3>${k}</h3><ul>${v.map(s => `<li>${s}</li>`).join("")}</ul></div>`).join("");

$("year").textContent = new Date().getFullYear();

// ---- Local time in Amman ----
const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Amman", hour: "2-digit", minute: "2-digit" });
const tick = () => $("clock").textContent = `Amman ${fmt.format(new Date())}`;
tick(); setInterval(tick, 30_000);

// ---- Theme toggle (follows the OS until the visitor chooses) ----
$("theme").addEventListener("click", () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
});

// ---- Header: scrolled state, scrollspy, mobile menu ----
const header = $("top"), menu = $("menu"), menuBtn = $("menu-btn");
const onScroll = () => header.classList.toggle("scrolled", scrollY > 20);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const links = [...menu.querySelectorAll("a")];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.hash === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));

const setMenu = open => {
  menu.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.textContent = open ? "Close" : "Menu";
};
menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", e => e.target.closest("a") && setMenu(false));

// ---- Reveal on scroll ----
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .08 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ---- Contact: copy email, optional CV ----
const toast = msg => { const t = $("toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2000); };
$("copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText("mameerah42@gmail.com"); toast("Email copied"); }
  catch { toast("mameerah42@gmail.com"); }
});
fetch("resume.pdf", { method: "HEAD" }).then(r => { if (r.ok) $("cv").hidden = false; }).catch(() => {});

// ---- GitHub: language bar + repo list ----
// Fixed categorical order; color follows the language, never its rank on a given load.
const SERIES = ["--s1", "--s2", "--s3", "--s4", "--s5"].map(v => `var(${v})`);
const OTHER = "var(--s-other)";
const ago = iso => {
  const d = Math.round((Date.now() - new Date(iso)) / 864e5);
  return d < 1 ? "Today" : d < 30 ? `${d}d ago` : d < 365 ? `${Math.round(d / 30)}mo ago` : `${Math.round(d / 365)}y ago`;
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
  let langs = data?.languages, unit = "bytes";
  if (!langs) {
    langs = {}; unit = "repos";
    repos.forEach(r => r.language && (langs[r.language] = (langs[r.language] || 0) + 1));
  }

  const entries = Object.entries(langs).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const color = {};
  const top5 = entries.slice(0, 5);
  top5.forEach(([l], i) => color[l] = SERIES[i]);
  const rest = entries.slice(5).reduce((s, [, v]) => s + v, 0);
  const rows = [...top5, ...(rest ? [["Other", rest]] : [])];
  const pct = v => v / total * 100;

  if (total) {
    $("langs-note").textContent = `${repos.length} repos · by ${unit}`;
    $("lang-bar").innerHTML = rows.map(([l, v]) =>
      `<div style="flex:${v};background:${color[l] || OTHER}" data-tip="${esc(l)} — ${pct(v).toFixed(1)}%"></div>`).join("");
    $("lang-legend").innerHTML = rows.map(([l, v]) =>
      `<span><i style="background:${color[l] || OTHER}"></i>${esc(l)} <em>${pct(v).toFixed(1)}%</em></span>`).join("");
    $("lang-bar").setAttribute("aria-label", "Share of code by language: " + rows.map(([l, v]) => `${l} ${pct(v).toFixed(0)}%`).join(", "));
  } else document.querySelector(".langs").remove();

  $("repos").innerHTML = repos.length ? repos.slice(0, 10).map(r => `
    <a class="repo" href="${esc(r.html_url)}" target="_blank" rel="noopener">
      <span class="repo-name">${esc(r.name)}</span>
      <span class="repo-desc">${esc(r.description || "Work in progress")}</span>
      <span class="repo-lang">${r.language ? `<i class="dot" style="background:${color[r.language] || OTHER}"></i>${esc(r.language)}` : "—"}</span>
      <span class="repo-when">${r.updated_at ? ago(r.updated_at) : ""}</span>
    </a>`).join("") : `<p class="muted" style="padding:1rem 0">Repositories are on <a class="ul" href="${GH}">GitHub</a>.</p>`;
}
loadGitHub();

// Tooltip for the language bar
const tip = $("tip");
$("lang-bar").addEventListener("pointermove", e => {
  const t = e.target.dataset?.tip; if (!t) return (tip.hidden = true);
  tip.textContent = t; tip.hidden = false;
  tip.style.left = Math.min(e.clientX + 12, innerWidth - tip.offsetWidth - 8) + "px";
  tip.style.top = e.clientY - 36 + "px";
});
$("lang-bar").addEventListener("pointerleave", () => tip.hidden = true);
