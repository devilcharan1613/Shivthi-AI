"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowUpRight, BrainCircuit, ChevronDown, Command, Compass,
  Cpu, Globe2, Layers3, Menu, Search, Sparkles, TrendingUp, X, RefreshCw,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const sections = [
  { name: "Command Center", icon: Command, note: "Your intelligence overview" },
  { name: "Open Source", icon: Layers3, note: "Live GitHub repository discovery" },
  { name: "AI Core", icon: BrainCircuit, note: "Models and research papers" },
  { name: "Domains", icon: Compass, note: "Company and industry intelligence" },
  { name: "Markets", icon: TrendingUp, note: "Global market signals" },
];

type Result = { title: string; description?: string; url: string; meta?: string; detail?: string };
type Feed = { source: string; fetched_at: string; items: Result[] };

export default function Home() {
  const [active, setActive] = useState("Command Center");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const activeSection = useMemo(() => sections.find((s) => s.name === active)!, [active]);

  async function loadFeed(section = active, search = query) {
    if (!["Open Source", "AI Core"].includes(section)) { setFeed(null); setError(""); return; }
    setLoading(true); setError(""); setFeed(null);
    const params = new URLSearchParams({ limit: "10" });
    if (search.trim()) params.set(section === "Open Source" ? "q" : "q", search.trim());
    const endpoint = section === "Open Source"
      ? `/api/v1/open-source/trending?${params}`
      : `/api/v1/ai/models?${params}`;
    try {
      const response = await fetch(API + endpoint, { cache: "no-store" });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || `Request failed (${response.status})`);
      }
      const data = await response.json();
      const items: Result[] = data.items.map((item: Record<string, unknown>) => section === "Open Source" ? ({
        title: String(item.name), description: String(item.description || "No description provided."),
        url: String(item.url), meta: `★ ${Number(item.stars || 0).toLocaleString()} stars`,
        detail: [item.language, item.updated_at ? `Updated ${new Date(String(item.updated_at)).toLocaleDateString()}` : ""].filter(Boolean).join(" · "),
      }) : ({
        title: String(item.id), description: `AI model on Hugging Face`, url: String(item.url),
        meta: `↓ ${Number(item.downloads || 0).toLocaleString()} downloads`,
        detail: [item.pipeline_tag, item.likes ? `♥ ${item.likes}` : ""].filter(Boolean).join(" · "),
      }));
      setFeed({ source: data.source, fetched_at: data.fetched_at, items });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load this feed.");
    } finally { setLoading(false); }
  }

  useEffect(() => { void loadFeed(active, ""); }, [active]);

  function chooseSection(name: string) {
    setActive(name); setMobileOpen(false);
  }

  function submitSearch() {
    if (query.trim()) {
      if (active === "AI Core" || active === "Open Source") void loadFeed(active, query);
      else chooseSection("Open Source");
    }
  }

  return (
    <main className="shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Sparkles size={19} /></div><div><b>shivthi<span>.ai</span></b><small>INTELLIGENCE SYSTEM</small></div><button className="close-nav" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18}/></button></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>{sections.map((s) => <button key={s.name} onClick={() => chooseSection(s.name)} className={active === s.name ? "nav-item active" : "nav-item"}><s.icon size={18}/><span>{s.name}</span>{active === s.name && <span className="nav-dot"/>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="status-line"><span className="status-dot"/> API CONNECTED WHEN AVAILABLE</div><div className="profile"><div className="avatar">S</div><div><b>Personal workspace</b><small>Public data mode</small></div><ChevronDown size={15}/></div></div>
      </aside>
      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation"/>}
      <section className="main-panel">
        <header className="topbar"><button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={20}/></button><div className="breadcrumb"><span>Workspace</span><span className="slash">/</span><b>{active}</b></div><div className="top-actions"><span className="live-pill"><i/> PUBLIC DATA</span><div className="avatar small-avatar">S</div></div></header>
        <div className="content">
          <div className="eyebrow"><span className="eyebrow-line"/> GLOBAL INTELLIGENCE PLATFORM <span className="version">PREVIEW 0.2</span></div>
          <div className="hero-row"><div><h1>{active === "Command Center" ? <>See the signal.<br/><em>Understand the world.</em></> : <>{activeSection.name}<br/><em>Intelligence, connected.</em></>}</h1><p className="hero-copy">{active === "Command Center" ? "One workspace to explore technology, research, industries, and global markets." : activeSection.note + ". Explore source-attributed public information."}</p></div><div className="hero-orb"><div className="orb-ring ring-one"/><div className="orb-ring ring-two"/><Globe2 size={44}/><span className="orb-node node-a"/><span className="orb-node node-b"/><span className="orb-node node-c"/></div></div>
          <div className="search-box"><Search size={19}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search repositories or AI models..." onKeyDown={(e) => { if(e.key === "Enter") submitSearch(); }}/><button className="text-action" onClick={submitSearch}>SEARCH <ArrowUpRight size={15}/></button></div>
          {active === "Open Source" ? (
            <section className="panel-card data-panel">
              <div className="panel-title"><div><span className="section-kicker">{active === "Open Source" ? "GITHUB EXPLORER" : "HUGGING FACE MODEL HUB"}</span><h3>{active === "Open Source" ? "Trending repositories" : "Popular AI models"}</h3></div><button className="outline-action" onClick={() => void loadFeed(active, query)} disabled={loading}><RefreshCw size={14}/> Refresh</button></div>
              {loading && <p className="feed-state">Retrieving public data from {active === "Open Source" ? "GitHub" : "Hugging Face"}…</p>}
              {error && <p className="feed-error">{error}. Check that the Shivthi API is running and try again.</p>}
              {!loading && !error && feed && <><div className="feed-meta">SOURCE: {feed.source} · FETCHED: {new Date(feed.fetched_at).toLocaleString()}</div>{feed.items.map((item) => <article className="result-row" key={item.url}><div className="result-main"><a href={item.url} target="_blank" rel="noreferrer">{item.title} <ArrowUpRight size={13}/></a><p>{item.description}</p><small>{item.detail}</small></div><span className="result-stat">{item.meta}</span></article>)}</>}
              {!loading && !error && feed?.items.length === 0 && <p className="feed-state">No matching results. Try another search.</p>}
              <p className="disclaimer">Data is retrieved live from the provider. Results may be subject to provider rate limits and availability.</p>
            </section>
          ) : active === "AI Core" ? null : (
            <>
              <div className="section-heading"><div><span className="section-kicker">YOUR INTELLIGENCE FEED</span><h2>Explore the landscape</h2></div><button className="text-action" onClick={() => chooseSection("Open Source")}>Explore sources <ArrowUpRight size={15}/></button></div>
              <div className="signal-grid">
                <button className="signal-card" onClick={() => chooseSection("Open Source")}><div className="card-top"><div className="signal-icon"><Layers3 size={19}/></div><ArrowUpRight size={17}/></div><span className="card-tag">OPEN SOURCE</span><h3>Explore fast-growing GitHub projects</h3><p>Discover repositories by language, topic, and recent activity.</p></button>
                <button className="signal-card" onClick={() => chooseSection("AI Core")}><div className="card-top"><div className="signal-icon"><BrainCircuit size={19}/></div><ArrowUpRight size={17}/></div><span className="card-tag">AI RESEARCH</span><h3>Track models and research</h3><p>Explore AI model releases and research papers from public sources.</p></button>
                <button className="signal-card" onClick={() => chooseSection("Markets")}><div className="card-top"><div className="signal-icon"><TrendingUp size={19}/></div><ArrowUpRight size={17}/></div><span className="card-tag">GLOBAL MARKETS</span><h3>Build a cross-market watchlist</h3><p>Market data integrations are planned. No prices are fabricated.</p></button>
              </div>
              <div className="lower-grid"><section className="panel-card"><div className="panel-title"><div><span className="section-kicker">MARKET RADAR</span><h3>Global indices</h3></div><span className="demo-label">NOT CONNECTED</span></div><p className="disclaimer">Live market feeds are not connected yet. No market values are displayed as real.</p></section>
              <section className="panel-card briefing"><div className="panel-title"><div><span className="section-kicker">AI BRIEFING</span><h3>Make sense of the noise</h3></div><div className="brief-icon"><Cpu size={18}/></div></div><div className="brief-visual"><div className="brief-wave">{Array.from({length:19},(_,i)=><span key={i}/>)}</div><BrainCircuit size={28}/></div><p>AI summaries will be added after a model provider and citation pipeline are configured.</p><button className="outline-action" onClick={() => chooseSection("AI Core")}>Explore AI Core <ArrowUpRight size={15}/></button></section></div>
            </>
          )}
          {active === "AI Core" && <section className="panel-card data-panel"><div className="panel-title"><div><span className="section-kicker">RESEARCH PAPERS</span><h3>Recent arXiv papers</h3></div><button className="outline-action" onClick={async()=>{setLoading(true);setError("");try{const r=await fetch(API+`/api/v1/research/papers?q=${encodeURIComponent(query.trim()||"artificial intelligence")}`);if(!r.ok)throw new Error("Research provider request failed");const d=await r.json();setFeed({source:d.source,fetched_at:d.fetched_at,items:d.items.map((x:Record<string,string>)=>({title:x.title,description:x.summary,url:x.url,detail:x.published||""}))});}catch(e){setError(e instanceof Error?e.message:"Unable to load papers");}finally{setLoading(false);}}} disabled={loading}><RefreshCw size={14}/> Load papers</button></div>{loading&&<p className="feed-state">Loading research papers…</p>}{error&&<p className="feed-error">{error}</p>}{feed&&<><div className="feed-meta">SOURCE: {feed.source} · FETCHED: {new Date(feed.fetched_at).toLocaleString()}</div>{feed.items.map((item)=><article className="result-row" key={item.url}><div className="result-main"><a href={item.url} target="_blank" rel="noreferrer">{item.title} <ArrowUpRight size={13}/></a><p>{item.description}</p><small>{item.detail}</small></div></article>)}</>}</section>}
          <footer><span>SHIVTHI AI <b>·</b> BUILT FOR CURIOSITY</span><span>PUBLIC DATA FIRST · SOURCE ATTRIBUTION ALWAYS</span></footer>
        </div>
      </section>
    </main>
  );
}
