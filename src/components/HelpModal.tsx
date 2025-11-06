import React from 'react'

export default function HelpModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  if (!open) return null
  return (
    <div id="help-modal" role="dialog" aria-modal="true" aria-label="How to use SmartPack"
      style={{position:'fixed', inset:0, background:'rgba(0,0,0,.3)', display:'grid', placeItems:'center', zIndex:50}}
      onClick={onClose}
    >
      <div style={{width:680, maxWidth:'90vw', background:'white', borderRadius:12, boxShadow:'var(--shadow-2)'}}
           onClick={e => e.stopPropagation()}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:16, borderBottom:'1px solid #E5E7EB'}}>
          <h2 style={{fontWeight:600}}>Welcome to SmartPack</h2>
          <button className="icon-btn" onClick={onClose}><span className="material-symbols-rounded">close</span> Close</button>
        </div>
        <div style={{padding:16, display:'grid', gap:12}}>
          <ol style={{display:'grid', gap:12}}>
            <li>Use <strong>Undo / Redo</strong> (bottom-right) to step through changes.</li>
            <li><strong>Drag</strong> items from Inventory into a container. Snap + keyboard arrows supported.</li>
            <li><strong>Click the ×</strong> on any packed item to return it to Inventory.</li>
            <li><strong>Leave Room</strong> is a slider; the reserved margin comes from all sides.</li>
            <li><strong>Double‑click container name</strong> to rename it.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
