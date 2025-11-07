import React, { useEffect, useMemo, useState } from "react";

/**
 * SmartPack — Styleguide (/styleguide)
 * Fully self‑contained styling (no Tailwind required).
 *
 * Requirements
 * - Colors: #4F46E5, #0284C7, #B5C6DE
 * - Fonts: Inter (Medium 500, Semibold 600)
 * - Icons: Material Symbols Rounded (Google)
 */

const ICONS = [
  "backpack",
  "auto_awesome",
  "line_weight",
  "ios_share",
  "help",
  "inventory_2",
  "laptop",
  "checkroom",
  "menu_book",
  "travel",
  "grid_on",
  "add",
  "close",
  "delete",
  "restart_alt",
  "visibility",
  "visibility_off",
  "warning",
  "verified",
  "palette",
  "logout",
  "login",
  "account_circle",
  "undo",
  "redo",
];

const PALETTE: { label: string; token: string; hex: string; role: string }[] = [
  { label: "Indigo 600", token: "--indigo-600", hex: "#4F46E5", role: "Primary" },
  { label: "Sky 600", token: "--sky-600", hex: "#0284C7", role: "Accent" },
  { label: "Steel 300", token: "--slate-300", hex: "#B5C6DE", role: "Neutral" },
];

function useGoogleFonts() {
  useEffect(() => {
    const ensure = (id: string, href: string) => {
      if (!document.getElementById(id)) {
        const l = document.createElement("link");
        l.id = id;
        l.rel = "stylesheet";
        l.href = href;
        document.head.appendChild(l);
      }
    };
    ensure(
      "inter-font-smartpack",
      "https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap"
    );
    ensure(
      "material-symbols-rounded-smartpack",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300..700,0..1,-50..200"
    );
  }, []);
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1100);
    } catch {}
  };
  return { copied, copy };
}

function textOnBg(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? "#0f172a" : "#ffffff";
}

export default function Styleguide() {
  useGoogleFonts();

  const [iconQuery, setIconQuery] = useState("");
  const [iconSize, setIconSize] = useState(28);
  const filteredIcons = useMemo(
    () => ICONS.filter((i) => i.toLowerCase().includes(iconQuery.toLowerCase())).sort(),
    [iconQuery]
  );

  const { copied, copy } = useCopy();

  return (
    <main className="sp">
      {/* Self‑contained CSS */}
      <style>{`
        :root {
          --indigo-600: #4F46E5; /* Primary */
          --sky-600: #0284C7;   /* Accent  */
          --slate-300: #B5C6DE; /* Neutral */
          --bg: #F7F9FC;
          --card: #FFFFFF;
          --ink: #0F172A;
          --ink-2: #334155;
          --ink-3: #64748B;
          --ring: color-mix(in srgb, var(--indigo-600) 35%, transparent);
          --radius: 14px;
          --shadow: 0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08);
          --border: 1px solid #E5E7EB;
          --box-h: clamp(260px, 62dvh, 620px); /* max height for scrollable cards */
        }
        .sp { height: 100dvh; overflow-y: auto; -webkit-overflow-scrolling: touch; background: var(--bg); color: var(--ink); font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto; }
        .sp-shell { max-width: 1120px; margin: 0 auto; padding: 28px; }

        /* Header */
        .sp-hero { background: linear-gradient(90deg, #EEF2FF, #E0F2FE, #FFF); border: var(--border); border-radius: var(--radius); box-shadow: var(--shadow); padding: 18px 20px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
        .sp-title { font-size: clamp(24px, 2.2vw, 34px); font-weight: 600; letter-spacing: -0.01em; }
        .sp-title .sp-gradient { background: linear-gradient(90deg, var(--indigo-600), var(--sky-600)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .sp-route { margin-top: 6px; font-size: 12px; color: var(--ink-3); }
        .sp-badges { display:flex; gap:8px; align-items:center; }
        .sp-badge { display:inline-flex; align-items:center; gap:8px; padding: 6px 10px; font-size: 11px; font-weight: 600; border-radius: 999px; border: 1px solid #E2E8F0; background:#fff; color: var(--ink-2); }
        .sp-dot { width:8px; height:8px; border-radius:999px; background: var(--indigo-600); }
        .sp-badge[data-accent] .sp-dot { background: var(--sky-600); }

        /* Grid */
        .sp-grid { display:grid; grid-template-columns: 1fr; gap:18px; margin-top: 18px; }
        @media (min-width: 1040px) { .sp-grid { grid-template-columns: 1fr 1fr 1fr; } }

        /* Card */
        .sp-card { background: var(--card); border: var(--border); border-radius: var(--radius); box-shadow: var(--shadow); overflow:hidden; display:flex; flex-direction:column; }
        .sp-card--scroll {}
        .sp-secHead { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 18px; border-bottom: 1px solid #F1F5F9; }
        .sp-card--scroll .sp-secHead {}
        .sp-overline { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .11em; color: var(--ink-3); }
        .sp-h2 { margin-top: 6px; font-size: 18px; font-weight: 600; }
        .sp-sub { margin-top: 2px; font-size: 13px; color: var(--ink-3); }
        .sp-spec { display:inline-flex; height: 28px; align-items:center; padding:0 10px; border-radius:999px; color:#fff; font-size:11px; font-weight:700; background: linear-gradient(90deg, var(--indigo-600), var(--sky-600)); }
        .sp-pad { padding: 16px 18px; flex: 1 1 auto; overflow: visible; }
        .sp-card--scroll .sp-pad { overflow: visible; }

        /* Palette */
        .sp-swatchRow { display:flex; align-items:center; gap:14px; }
        .sp-swatch { position:relative; width: 52px; height: 52px; border-radius: 12px; border: 1px solid rgba(15,23,42,.06); box-shadow: inset 0 0 0 1px rgba(255,255,255,.6); }
        .sp-swatch:is(:hover,:focus-visible) { transform: translateY(-1px); }
        .sp-swatchInfo { flex:1; min-width:0; }
        .sp-swatchTop { display:flex; align-items:center; justify-content:space-between; font-size: 13px; }
        .sp-chip { display:inline-flex; align-items:center; gap:6px; padding:4px 8px; font-size: 11px; border-radius:999px; background:#F8FAFC; border:1px solid #E2E8F0; color: var(--ink-3); }
        .sp-code { background:#F8FAFC; border:1px solid #E2E8F0; color: var(--ink-2); padding: 6px 8px; border-radius: 8px; font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; }
        .sp-row { display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-top:6px; }

        /* Buttons */
        .sp-btn { appearance:none; outline: none; border:0; height:36px; padding:0 12px; border-radius:10px; font-size:13px; font-weight:600; display:inline-flex; align-items:center; gap:8px; cursor:pointer; box-shadow: 0 1px 2px rgba(16,24,40,.05); }
        .sp-btn:focus-visible { box-shadow: 0 0 0 3px var(--ring); }
        .sp-btnPrimary { background: var(--indigo-600); color:#fff; }
        .sp-btnPrimary:hover { filter: brightness(1.05); }
        .sp-btnSecondary { background:#fff; border: 1px solid #E2E8F0; color: var(--ink-2); }
        .sp-btnSecondary:hover { background:#F8FAFC; }
        .sp-btnTertiary { background:#F1F5F9; border: 1px solid #E2E8F0; color: var(--ink-2); }
        .sp-btnTertiary:hover { background:#E2E8F0; }

        /* Inputs */
        .sp-input { height: 38px; border-radius: 10px; border: 1px solid #E2E8F0; padding: 0 12px; font-size: 13px; min-width: 200px; }
        .sp-input:focus { outline: none; box-shadow: 0 0 0 3px var(--ring); }

        /* Icon grid */
        .sp-iconMeta { margin-bottom:10px; font-size: 13px; color: var(--ink-3); }
        .sp-iconGrid { display:grid; grid-template-columns: repeat(1, minmax(0,1fr)); gap:10px; }
        @media (min-width: 680px) { .sp-iconGrid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 960px) { .sp-iconGrid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1200px) { .sp-iconGrid { grid-template-columns: repeat(4, 1fr); } }
        .sp-iconCard { display:flex; align-items:center; gap:10px; padding:10px; border-radius:12px; border:1px solid #E5E7EB; background:#fff; box-shadow: 0 1px 2px rgba(16,24,40,.05); transition: transform .15s ease, box-shadow .15s ease; }
        .sp-iconCard:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(16,24,40,.08); }
        .sp-codeTiny { font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; font-size:12px; color: var(--ink-2); }

        /* Material Symbols setup */
        .material-symbols-rounded{ font-family: 'Material Symbols Rounded'; font-weight: normal; font-style: normal; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      <div className="sp-shell">
        {/* Header */}
        <header className="sp-hero">
          <div>
            <div className="sp-title"><span className="sp-gradient">SmartPack</span> — Styleguide</div>
            <div className="sp-route">Route: <code className="sp-code">/styleguide</code></div>
          </div>
          <div className="sp-badges">
            <span className="sp-badge"><span className="sp-dot"/>Inter 500/600</span>
            <span className="sp-badge" data-accent><span className="sp-dot"/>Material Symbols</span>
          </div>
        </header>

        {/* Grid */}
        <div className="sp-grid">
          {/* Palette */}
          <section className="sp-card">
            <div className="sp-secHead">
              <div>
                <div className="sp-overline">Style</div>
                <div className="sp-h2">Color Palette</div>
                <div className="sp-sub">Brand tokens & HEX values</div>
              </div>
              <span className="sp-spec">Spec</span>
            </div>
            <div className="sp-pad" style={{display:'grid', gap:12}}>
              {PALETTE.map(({ label, token, hex, role }) => (
                <div key={token} className="sp-swatchRow">
                  <button
                    className="sp-swatch"
                    style={{ background: hex }}
                    onClick={() => copy(hex, token+":hex")}
                    aria-label={`Copy HEX ${hex}`}
                    title="Click to copy HEX"
                  >
                    {copied === token+":hex" && (
                      <span
                        style={{position:'absolute',inset:0,display:'grid',placeItems:'center',fontSize:11,fontWeight:600,color:textOnBg(hex)}}
                      >Copied</span>
                    )}
                  </button>
                  <div className="sp-swatchInfo">
                    <div className="sp-swatchTop"><strong>{label}</strong><span style={{fontSize:12,color:'var(--ink-3)'}}>{hex}</span></div>
                    <div className="sp-row">
                      <span className="sp-chip">{role}</span>
                      <code className="sp-code">{token}</code>
                      <button className="sp-btn sp-btnSecondary" onClick={() => copy(`var(${token})`, token+":var")}>Copy var()</button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="sp-row" style={{marginTop:10}}>
                <button className="sp-btn sp-btnPrimary" onClick={() => copy('Primary Action','demo:primary')}>
                  <span className="material-symbols-rounded" aria-hidden>verified</span> Primary Action
                </button>
                <button className="sp-btn sp-btnSecondary" onClick={() => copy('Secondary','demo:secondary')}>Secondary</button>
                <button className="sp-btn sp-btnTertiary" onClick={() => copy('Tertiary','demo:tertiary')}>Tertiary</button>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section className="sp-card" style={{gridColumn: 'span 2'}}>
            <div className="sp-secHead">
              <div>
                <div className="sp-overline">Style</div>
                <div className="sp-h2">Typography</div>
                <div className="sp-sub">Inter — Medium (500) & Semibold (600)</div>
              </div>
              <span className="sp-spec">Spec</span>
            </div>
            <div className="sp-pad" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div>
                <div className="sp-overline" style={{color:'var(--ink-3)'}}>Display / Titles</div>
                <p style={{marginTop:8,fontSize:28,fontWeight:600,lineHeight:1.15}}>Display / H1</p>
                <p style={{marginTop:6,fontSize:22,fontWeight:600,lineHeight:1.2}}>H2 — Section</p>
                <p style={{marginTop:6,fontSize:18,fontWeight:600,lineHeight:1.25}}>H3 — Card Title</p>
                <p style={{marginTop:6,fontSize:16,fontWeight:500,lineHeight:1.35,color:'var(--ink-2)'}}>H4 — Subheading</p>
              </div>
              <div>
                <div className="sp-overline" style={{color:'var(--ink-3)'}}>Body & Meta</div>
                <p style={{marginTop:8,fontSize:15,fontWeight:500,lineHeight:1.7,color:'var(--ink-2)'}}>Body/Default — The quick brown fox jumps over the lazy dog.</p>
                <p style={{marginTop:6,fontSize:14,fontWeight:500,lineHeight:1.6,color:'var(--ink-3)'}}>Secondary — Used for helper text, descriptions, and notes.</p>
                <p style={{marginTop:8,fontSize:11,fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--ink-3)'}}>Overline / Label</p>
                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:10}}>
                  <span className="sp-badge"><span className="sp-dot"/>Medium 500</span>
                  <span className="sp-badge" data-accent><span className="sp-dot"/>Semibold 600</span>
                </div>
                <div style={{display:'flex',gap:8,alignItems:'center',marginTop:12}}>
                  <div style={{position:'relative'}}>
                    <span className="material-symbols-rounded" aria-hidden style={{position:'absolute',left:10,top:9,color:'var(--ink-3)'}}>search</span>
                    <input className="sp-input" placeholder="Search…" style={{paddingLeft:34,width:240}}/>
                  </div>
                  <button className="sp-btn sp-btnPrimary">Search</button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Icons */}
        <section className="sp-card" style={{marginTop:18}}>
          <div className="sp-secHead">
            <div>
              <div className="sp-overline">Style</div>
              <div className="sp-h2">Icons — Material Symbols Rounded</div>
              <div className="sp-sub">One example of every icon we plan to use</div>
            </div>
            <span className="sp-spec">Spec</span>
          </div>
          <div className="sp-pad">
            <div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',marginBottom:10}}>
              <div className="sp-iconMeta">Showing <strong style={{color:'var(--ink-2)'}}>{filteredIcons.length}</strong> icon{filteredIcons.length===1?'':'s'}</div>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--ink-3)'}}>
                  <span>Search</span>
                  <input className="sp-input" placeholder="icon name…" value={iconQuery} onChange={(e)=>setIconQuery(e.target.value)} />
                </label>
                <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--ink-3)'}}>
                  <span>Size</span>
                  <input type="range" min={20} max={72} value={iconSize} onChange={(e)=>setIconSize(parseInt(e.target.value,10))} />
                  <span style={{fontVariantNumeric:'tabular-nums',color:'var(--ink-2)'}}>{iconSize}px</span>
                </label>
              </div>
            </div>

            <div className="sp-iconGrid">
              {filteredIcons.map((ic) => (
                <button key={ic} className="sp-iconCard" onClick={() => copy(ic, `icon:${ic}`)} title="Click to copy the icon name">
                  <span className="material-symbols-rounded" aria-hidden style={{ fontSize: iconSize }}>{ic}</span>
                  <code className="sp-codeTiny">{ic}</code>
                  <span style={{marginLeft:'auto',fontSize:11,color:'var(--indigo-600)'}}>{copied===`icon:${ic}`? 'Copied' : 'Copy'}</span>
                </button>
              ))}
            </div>

            <div style={{marginTop:14,background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,padding:12,fontSize:13,color:'var(--ink-2)'}}>
              <div style={{fontWeight:600,marginBottom:6}}>Setup notes</div>
              <ol style={{paddingLeft:18,margin:0}}>
                <li>Inter 500/600 and Material Symbols are automatically loaded on this page.</li>
                <li>Tokens are exposed as CSS variables: <code className="sp-code">--indigo-600</code>, <code className="sp-code">--sky-600</code>, <code className="sp-code">--slate-300</code>.</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
