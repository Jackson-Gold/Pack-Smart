import React from 'react'

const icons = [
  'backpack','auto_awesome','line_weight','ios_share','help','inventory_2','laptop','checkroom','menu_book','travel',
  'grid_on','add','close','delete','restart_alt','visibility','visibility_off','warning','verified','palette','logout','login','account_circle','undo','redo'
]

export default function Styleguide() {
  return (
    <div style={{padding:24, display:'grid', gap:24}}>
      <h1 style={{fontWeight:600}}>SmartPack — Styleguide</h1>
      <section>
        <h2>Color Palette</h2>
        <div style={{display:'grid', gap:12, maxWidth:560}}>
          {[
            ['Indigo 600','--indigo-600','var(--indigo-600)'],
            ['Sky 600','--sky-600','var(--sky-600)'],
            ['Slate 300','--slate-300','var(--slate-300)'],
            ['Slate 800','--slate-800','var(--slate-800)']
          ].map(([label, token, value]) => (
            <div key={token} className="swatch">
              <div className="box" style={{background:value as string}} />
              <div>
                <div style={{fontWeight:600}}>{label}</div>
                <code>{token}: {String(value)}</code>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>Typography</h2>
        <p style={{fontWeight:500}}>Inter Medium – 500</p>
        <p style={{fontWeight:600}}>Inter SemiBold – 600</p>
      </section>
      <section>
        <h2>Icons (Material Symbols Rounded)</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(120px, 1fr))', gap:12}}>
          {icons.map(ic => (
            <div key={ic} style={{display:'flex', alignItems:'center', gap:10, border:'1px solid #E5E7EB', padding:8, borderRadius:8}}>
              <span className="material-symbols-rounded" aria-hidden>{ic}</span>
              <code>{ic}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
