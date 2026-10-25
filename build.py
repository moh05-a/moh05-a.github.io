"""Portfolio helper.

    python build.py            # fetch public GitHub repos -> repos.json
    python build.py --serve    # fetch, then serve the site at http://localhost:8000

Set GITHUB_TOKEN to raise the API rate limit (the GitHub Action does this).
"""
import base64
import http.server
import json
import os
import re
import socketserver
import sys
import urllib.request
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

USER = "moh05-a"
ROOT = Path(__file__).parent
API = "https://api.github.com"
KEEP = ("name", "html_url", "homepage", "description", "language", "topics",
        "stargazers_count", "forks_count", "fork", "updated_at")


def get(path):
    headers = {"User-Agent": "portfolio-build", "Accept": "application/vnd.github+json"}
    if token := os.environ.get("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {token}"
    with urllib.request.urlopen(urllib.request.Request(API + path, headers=headers), timeout=15) as r:
        return json.load(r)


def readme_summary(name):
    """First real paragraph of the README, used when a repo has no description."""
    try:
        text = base64.b64decode(get(f"/repos/{USER}/{name}/readme")["content"]).decode("utf-8", "ignore")
    except Exception:
        return None
    text = re.sub(r"```.*?```|<[^>]+>|!\[[^\]]*\]\([^)]*\)", " ", text, flags=re.S)
    for para in re.split(r"\n\s*\n", text):
        line = " ".join(l.strip() for l in para.splitlines()
                        if l.strip() and not l.lstrip().startswith(("#", "|", "---", "[!", "-", "*", ">")))
        line = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", line)
        line = re.sub(r"[*_`]", "", line).strip()
        if len(line) >= 25:
            return line if len(line) <= 180 else line[:177].rsplit(" ", 1)[0] + "…"
    return None


def fetch():
    try:
        data = get(f"/users/{USER}/repos?sort=updated&per_page=100")
    except Exception as e:
        print(f"Could not fetch repos ({e}); the site will fall back to the live API.")
        return
    repos, langs = [], Counter()
    for r in data:
        if r["fork"] or r["name"].lower() in (USER.lower(), f"{USER.lower()}.github.io"):
            continue
        repo = {k: r.get(k) for k in KEEP}
        if not repo["description"]:
            repo["description"] = readme_summary(r["name"])
        try:
            repo_langs = get(f"/repos/{USER}/{r['name']}/languages")
        except Exception:
            repo_langs = {}
        langs.update(repo_langs)
        repo["languages"] = list(repo_langs)
        repos.append(repo)
        print(f"  {r['name']:<22} {', '.join(repo_langs) or '-'}")
    out = {
        "generated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "repos": repos,
        "languages": dict(langs.most_common()),  # bytes of code per language, all repos
        "resume": (ROOT / "resume.pdf").exists(),  # shows the CV link on the site
    }
    (ROOT / "repos.json").write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"Wrote repos.json: {len(repos)} repos, {len(langs)} languages.")


def serve(port=8000):
    handler = lambda *a, **k: http.server.SimpleHTTPRequestHandler(*a, directory=str(ROOT), **k)
    with socketserver.TCPServer(("", port), handler) as s:
        print(f"Serving at http://localhost:{port}  (Ctrl+C to stop)")
        s.serve_forever()


if __name__ == "__main__":
    fetch()
    if "--serve" in sys.argv:
        serve()
