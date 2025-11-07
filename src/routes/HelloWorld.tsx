import React, { useEffect, useState } from "react";

/**
 * SmartPack — Hello World (/hello)
 * One-screen page that matches the Styleguide's look & feel.
 * Includes a React Native (desktop) getting-started block and a simple
 * checklist to confirm local load/reload & opening on the target device.
 */

export default function HelloPage() {
  useGoogleFonts();
  const [loaded, setLoaded] = useState(false);
  const [reloaded, setReloaded] = useState(false);
  const [opened, setOpened] = useState(false);

  return (
    <main className="sp">
      <style>{CSS}</style>
      <div className="sp-shell">
        {/* Header */}
        <header className="sp-hero">
          <div>
            <div className="sp-title"><span className="sp-gradient">SmartPack</span> — Hello World</div>
            <div className="sp-route">Route: <code className="sp-code">/hello</code></div>
          </div>
          <div className="sp-badges">
            <span className="sp-badge"><span className="sp-dot"/>Inter 500/600</span>
            <span className="sp-badge" data-accent><span className="sp-dot"/>Material Symbols</span>
          </div>
        </header>

        {/* Grid */}
        <div className="sp-grid" style={{ gridTemplateColumns: '1.1fr 1fr' }}>
          {/* Hello card */}
          <section className="sp-card">
            <div className="sp-secHead">
              <div>
                <div className="sp-overline">Demo</div>
                <div className="sp-h2">Hello World</div>
                <div className="sp-sub">One-screen app preview</div>
              </div>
              <span className="sp-spec">Spec</span>
            </div>
            <div className="sp-pad">
              <div className="hello-plate">
                <span className="material-symbols-rounded" aria-hidden>auto_awesome</span>
                <h1 className="hello-title">Hello, <span className="sp-gradient-text">Pack Smart</span></h1>
                <p className="hello-sub">This page mirrors the Styleguideʼs typography, spacing, and surface styles.</p>
              </div>
              <div className="sp-row" style={{ marginTop: 14 }}>
                <button className="sp-btn sp-btnPrimary" onClick={() => setReloaded(true)}>
                  <span className="material-symbols-rounded" aria-hidden>restart_alt</span>
                  Simulate Fast Refresh
                </button>
                <button className="sp-btn sp-btnSecondary" onClick={() => setLoaded(true)}>
                  <span className="material-symbols-rounded" aria-hidden>verified</span>
                  Mark Loaded
                </button>
              </div>
            </div>
          </section>

          {/* Check & RN setup */}
          <section className="sp-card">
            <div className="sp-secHead">
              <div>
                <div className="sp-overline">Setup</div>
                <div className="sp-h2">React Native — Desktop Target</div>
                <div className="sp-sub">Build, run, and verify locally</div>
              </div>
              <span className="sp-spec">Spec</span>
            </div>
            <div className="sp-pad" style={{ display: 'grid', gap: 14 }}>
              <ol className="sp-steps">
                <li className={loaded ? 'done' : ''}>
                  <span className="material-symbols-rounded" aria-hidden>{loaded ? 'check_circle' : 'radio_button_unchecked'}</span>
                  App loads locally
                  <button className="sp-link" onClick={() => setLoaded(!loaded)}>{loaded ? 'Undo' : 'Mark done'}</button>
                </li>
                <li className={reloaded ? 'done' : ''}>
                  <span className="material-symbols-rounded" aria-hidden>{reloaded ? 'check_circle' : 'radio_button_unchecked'}</span>
                  Fast Refresh / reload works
                  <button className="sp-link" onClick={() => setReloaded(!reloaded)}>{reloaded ? 'Undo' : 'Mark done'}</button>
                </li>
                <li className={opened ? 'done' : ''}>
                  <span className="material-symbols-rounded" aria-hidden>{opened ? 'check_circle' : 'radio_button_unchecked'}</span>
                  Opened on desktop target device
                  <button className="sp-link" onClick={() => setOpened(!opened)}>{opened ? 'Undo' : 'Mark done'}</button>
                </li>
              </ol>

              <div className="sp-divider" />

              <div>
                <div className="sp-overline" style={{ color: 'var(--ink-3)' }}>Minimal App.tsx</div>
                <pre className="sp-codeblock"><code>{RN_HELLO}</code></pre>
              </div>

              <div>
                <div className="sp-overline" style={{ color: 'var(--ink-3)' }}>Run commands (Windows / macOS)</div>
                <pre className="sp-codeblock"><code>{RUN_CMDS}</code></pre>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function useGoogleFonts() {
  useEffect(() => {
    const add = (id: string, href: string) => {
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id; link.rel = 'stylesheet'; link.href = href; document.head.appendChild(link);
      }
    };
    add('inter-hello', 'https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap');
    add('msr-hello', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300..700,0..1,-50..200');
  }, []);
}

const RUN_CMDS = `# Create a new RN app
npx react-native init SmartPackHello

# Add desktop target (choose one)
# Windows
yarn add react-native-windows
npx react-native-windows-init --overwrite
npx react-native run-windows

# macOS
yarn add react-native-macos
npx react-native-macos-init
npx react-native run-macos
`;

const RN_HELLO = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Hello, Pack Smart</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F9FC' },
  title: { fontSize: 28, fontWeight: '600', color: '#0F172A' },
});
`;

const CSS = `
:root {
  --indigo-600: #4F46E5; --sky-600: #0284C7; --slate-300: #B5C6DE;
  --bg: #F7F9FC; --card: #FFFFFF; --ink: #0F172A; --ink-2: #334155; --ink-3: #64748B;
  --shadow: 0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08);
  --border: 1px solid #E5E7EB; --radius: 14px;
}
.sp { min-height: 100dvh; background: var(--bg); color: var(--ink); font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto; }
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

/* Grid & Cards */
.sp-grid { display:grid; grid-template-columns: 1fr 1fr; gap:18px; margin-top: 18px; }
@media (max-width: 920px){ .sp-grid { grid-template-columns: 1fr; } }
.sp-card { background: var(--card); border: var(--border); border-radius: var(--radius); box-shadow: var(--shadow); overflow:hidden; display:flex; flex-direction:column; }
.sp-secHead { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 18px; border-bottom: 1px solid #F1F5F9; }
.sp-overline { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .11em; color: var(--ink-3); }
.sp-h2 { margin-top: 6px; font-size: 18px; font-weight: 600; }
.sp-sub { margin-top: 2px; font-size: 13px; color: var(--ink-3); }
.sp-spec { display:inline-flex; height: 28px; align-items:center; padding:0 10px; border-radius:999px; color:#fff; font-size:11px; font-weight:700; background: linear-gradient(90deg, var(--indigo-600), var(--sky-600)); }
.sp-pad { padding: 16px 18px; }

/* Buttons */
.sp-btn { appearance:none; outline: none; border:0; height:36px; padding:0 12px; border-radius:10px; font-size:13px; font-weight:600; display:inline-flex; align-items:center; gap:8px; cursor:pointer; box-shadow: 0 1px 2px rgba(16,24,40,.05); }
.sp-btn:focus-visible { box-shadow: 0 0 0 3px color-mix(in srgb, var(--indigo-600) 35%, transparent); }
.sp-btnPrimary { background: var(--indigo-600); color:#fff; }
.sp-btnPrimary:hover { filter: brightness(1.05); }
.sp-btnSecondary { background:#fff; border: 1px solid #E2E8F0; color: var(--ink-2); }
.sp-btnSecondary:hover { background:#F8FAFC; }
.sp-link { margin-left:auto; font-size:12px; color: var(--indigo-600); font-weight:600; background:none; border:0; cursor:pointer; }

/* Code */
.sp-code { background:#F8FAFC; border:1px solid #E2E8F0; color: var(--ink-2); padding: 6px 8px; border-radius: 8px; font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; }
.sp-codeblock { margin-top: 8px; background:#0F172A; color:#E5E7EB; border-radius: 12px; padding: 12px 14px; overflow:auto; box-shadow: inset 0 0 0 1px rgba(255,255,255,.05); }

/* Steps */
.sp-steps { list-style:none; padding:0; margin:0; display:grid; gap:8px; }
.sp-steps li { display:flex; align-items:center; gap:8px; background:#F8FAFC; border:1px solid #E2E8F0; padding:8px 10px; border-radius:10px; font-size:13px; color: var(--ink-2); }
.sp-steps li.done { background: #EEF2FF; border-color: #C7D2FE; color: #1E293B; }
.sp-divider { height:1px; background:#F1F5F9; margin: 2px 0 4px; }

/* Hello plate */
.hello-plate { display:grid; place-items:center; gap:12px; border: 1px solid #EEF2FF; background: linear-gradient(145deg, #FFFFFF, #F8FAFF); border-radius: 16px; padding: 28px; }
.hello-title { font-size: clamp(28px, 4.2vw, 44px); font-weight: 600; letter-spacing: -0.015em; margin: 0; }
.hello-sub { margin: 0; font-size: 14px; color: var(--ink-3); }
.sp-gradient-text { background: linear-gradient(90deg, var(--indigo-600), var(--sky-600)); -webkit-background-clip: text; background-clip: text; color: transparent; }

/* Material Symbols */
.material-symbols-rounded{ font-family: 'Material Symbols Rounded'; font-weight: normal; font-style: normal; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
`;
