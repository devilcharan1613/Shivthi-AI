"use client";

import { useState } from "react";
import {
  Activity, ArrowUpRight, BrainCircuit, ChevronDown, Command, Compass,
  Cpu, Globe2, Layers3, Menu, Search, Sparkles, TrendingUp, X,
} from "lucide-react";

const sections = [
  { name: "Command Center", icon: Command, note: "Your intelligence overview" },
  { name: "Open Source", icon: Layers3, note: "Projects, releases, ecosystem" },
  { name: "AI Core", icon: BrainCircuit, note: "Models, papers, datasets" },
  { name: "Domains", icon: Compass, note: "Companies and industries" },
  { name: "Markets", icon: TrendingUp, note: "Global market signals" },
];

const signals = [
  { tag: "OPEN SOURCE", title: "Explore fast-growing GitHub projects", desc: "Discover repositories by language, topic, and recent activity.", icon: Layers3 },
  { tag: "AI RESEARCH", title: "Track new research and model releases", desc: "Follow papers, datasets, and model ecosystem updates.", icon: BrainCircuit },
  { tag: "GLOBAL MARKETS", title: "Build a cross-market watchlist", desc: "Bring company and macro indicators into one workspace.", icon: TrendingUp },
];

const sampleAssets = [
  ["S&P 500", "Index", "Sample data"],
  ["NASDAQ 100", "Index", "Sample data"],
  ["NIFTY 50", "Index", "Sample data"],
  ["FTSE 100", "Index", "Sample data"],
];

export default function Home() {
  const [active, setActive] = useState("Command Center");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = sections.find((s) => s.name === active)!;

  return (
    <main className="shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Sparkles size={19} /></div><div><b>shivthi<span>.ai</span></b><small>INTELLIGENCE SYSTEM</small></div><button className="close-nav" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18}/></button></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>{sections.map((s) => <button key={s.name} onClick={() => { setActive(s.name); setMobileOpen(false); }} className={active === s.name ? "nav-item active" : "nav-item"}><s.icon size={18}/><span>{s.name}</span>{active === s.name && <span className="nav-dot"/>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="status-line"><span className="status-dot"/> SYSTEM READY</div><div className="profile"><div className="avatar">S</div><div><b>Personal workspace</b><small>Free research mode</small></div><ChevronDown size={15}/></div></div>
      </aside>

      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation"/>}
      <section className="main-panel">
        <header className="topbar"><button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={20}/></button><div className="breadcrumb"><span>Workspace</span><span className="slash">/</span><b>{active}</b></div><div className="top-actions"><span className="live-pill"><i/> SYSTEM ONLINE</span><button className="icon-button" aria-label="Global search"><Search size={18}/></button><div className="avatar small-avatar">S</div></div></header>
        <div className="content">
          <div className="eyebrow"><span className="eyebrow-line"/> GLOBAL INTELLIGENCE PLATFORM <span className="version">PREVIEW 0.1</span></div>
          <div className="hero-row"><div><h1>{active === "Command Center" ? <>See the signal.<br/><em>Understand the world.</em></> : <>{activeSection.name}<br/><em>Intelligence, connected.</em></>}</h1><p className="hero-copy">{active === "Command Center" ? "One workspace to explore technology, research, industries, and global markets." : activeSection.note + ". Discover trusted information from connected public sources."}</p></div><div className="hero-orb"><div className="orb-ring ring-one"/><div className="orb-ring ring-two"/><Globe2 size={44}/><span className="orb-node node-a"/><span className="orb-node node-b"/><span className="orb-node node-c"/></div></div>
          <div className="search-box"><Search size={19}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search companies, AI models, papers, repositories..." onKeyDown={(e) => { if(e.key === "Enter" && query.trim()) setActive("Domains"); }}/><kbd>ENTER</kbd></div>
          <div className="section-heading"><div><span className="section-kicker">YOUR INTELLIGENCE FEED</span><h2>Explore the landscape</h2></div><button className="text-action" onClick={() => setActive("Open Source")}>Explore sources <ArrowUpRight size={15}/></button></div>
          <div className="signal-grid">{signals.map((item, i) => <button className="signal-card" key={item.tag} onClick={() => setActive(i === 0 ? "Open Source" : i === 1 ? "AI Core" : "Markets")}><div className="card-top"><div className="signal-icon"><item.icon size={19}/></div><ArrowUpRight size={17} className="card-arrow"/></div><span className="card-tag">{item.tag}</span><h3>{item.title}</h3><p>{item.desc}</p></button>)}</div>
          <div className="lower-grid"><section className="panel-card"><div className="panel-title"><div><span className="section-kicker">MARKET RADAR</span><h3>Global indices</h3></div><span className="demo-label">DEMO PLACEHOLDERS</span></div>{sampleAssets.map((a) => <div className="asset-row" key={a[0]}><div className="asset-symbol"><Activity size={16}/></div><div className="asset-name"><b>{a[0]}</b><small>{a[1]}</small></div><span className="asset-value">{a[2]}</span></div>)}<p className="disclaimer">Live quotes are not connected yet. No market values are fabricated.</p></section>
          <section className="panel-card briefing"><div className="panel-title"><div><span className="section-kicker">AI BRIEFING</span><h3>Make sense of the noise</h3></div><div className="brief-icon"><Cpu size={18}/></div></div><div className="brief-visual"><div className="brief-wave"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div><BrainCircuit size={28}/></div><p>AI-generated briefings will summarize sourced updates with links, timestamps, and clear confidence labels.</p><button className="outline-action" onClick={() => setActive("AI Core")}>Explore AI Core <ArrowUpRight size={15}/></button></section></div>
          <footer><span>SHIVTHI AI <b>·</b> BUILT FOR CURIOSITY</span><span>PUBLIC DATA FIRST · SOURCE ATTRIBUTION ALWAYS</span></footer>
        </div>
      </section>
    </main>
  );
}
