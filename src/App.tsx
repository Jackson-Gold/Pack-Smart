import React from 'react'
import Inventory from './components/Inventory'
import SvgCanvas from './components/SvgCanvas'
import ConstraintsPanel from './components/ConstraintsPanel'
import Meters from './components/Meters'
import HelpModal from './components/HelpModal'
import AddItemModal from './components/AddItemModal'
import AddConstraintModal from './components/AddConstraintModal'
import { usePackStore } from './state/store'
import { Link } from 'react-router-dom'

export default function App() {
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const [helpOpen, setHelpOpen] = React.useState(false)
  const [addOpen, setAddOpen] = React.useState(false)
  const [addConstraintOpen, setAddConstraintOpen] = React.useState(false)
  const [unimplementedOpen, setUnimplementedOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingName, setEditingName] = React.useState('')
  const { optimize, packed, inventory, containers, containerOrder, addContainer, removeContainer, undo, redo, renameContainer } = usePackStore()

  const hasContainers = containerOrder.some(id => containers[id])

  return (
    <div className="app-shell">
      <header className="appbar" role="banner">
        <div className="brand" aria-label="SmartPack">
          <span className="logo"><span className="material-symbols-rounded" aria-hidden>backpack</span></span>
          SmartPack
        </div>
        <div className="toolbar">
          <button className="icon-btn" onClick={() => optimize('space')} title="Optimize for space">
            <span className="material-symbols-rounded">auto_awesome</span> Optimize
          </button>
          <button className="icon-btn" onClick={() => optimize('weight')} title="Optimize for weight">
            <span className="material-symbols-rounded">line_weight</span> What‑If?
          </button>
          <button className="icon-btn" onClick={() => window.alert('Share → export image / link (stub)')} title="Share layout">
            <span className="material-symbols-rounded">ios_share</span> Share
          </button>
          <button className="icon-btn" data-variant="filled" onClick={() => setHelpOpen(true)} aria-haspopup="dialog" aria-controls="help-modal">
            <span className="material-symbols-rounded">help</span> Help
          </button>
        </div>
      </header>
      <main className="content">
        <aside className="panel left-fixed panel-accent column-flex" aria-label="Inventory">
          <div className="panel-header">
            <div className="section-title">Inventory</div>
          </div>
          <Inventory onAddItem={() => setAddOpen(true)} />
        </aside>

        <section className="canvas-wrap middle-scroll column-flex" aria-label="Containers" style={{height:'100%', overflow:'hidden', display:'flex', flexDirection:'column', padding:'12px', background:'#fff', border:'1px solid var(--slate-200)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-1)'}}>
          {containerOrder.filter(cid => containers[cid]).length > 0 && (() => {
            const firstCid = containerOrder.filter(cid => containers[cid])[0]
            const cWeight = Object.values(packed).filter(p => p.containerId===firstCid).reduce((acc,p)=> acc + (inventory[p.itemId]?.weight||0), 0)
            const over = cWeight > (containers[firstCid]?.weightCap ?? Infinity)
            return (
              <div className="canvas-toolbar" style={{flexShrink:0, marginBottom:8}}>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  {editingId === firstCid ? (
                    <input autoFocus className="input" style={{padding:'6px 8px'}}
                           value={editingName}
                           onChange={e=>setEditingName(e.currentTarget.value)}
                           onBlur={()=> { if (editingName.trim()) renameContainer(firstCid, editingName.trim()); setEditingId(null) }}
                           onKeyDown={(e)=> { if (e.key==='Enter') { (e.target as HTMLInputElement).blur() } else if (e.key==='Escape') { setEditingId(null) } }}
                    />
                  ) : (
                    <span className="section-title" onDoubleClick={()=> { setEditingId(firstCid); setEditingName(containers[firstCid]?.name || firstCid) }} title="Double‑click to rename">
                      {containers[firstCid]?.name || firstCid}
                    </span>
                  )}
                  <span className="chip" data-status={over ? 'bad' : 'ok'}>
                    <span className="material-symbols-rounded">{over ? 'warning' : 'verified'}</span>
                    {over ? `Over weight cap (${cWeight.toFixed(1)} / ${containers[firstCid].weightCap}kg)` : 'Constraints OK'}
                  </span>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <label>Scale
                    <input style={{ marginLeft: 6 }} type="range" min={50} max={200} defaultValue={100}
                      onChange={(e) => document.documentElement.style.setProperty('--cell-px', String(Math.round((+e.currentTarget.value)/100*24)))}
                      aria-label="Scale canvas" />
                  </label>
                  <button className="icon-btn" onClick={() => removeContainer(firstCid)} title="Remove container" style={{color:'#DC2626'}}>
                    <span className="material-symbols-rounded">close</span>
                  </button>
                </div>
              </div>
            )
          })()}
          <div style={{overflow:'auto', minHeight:0, flex:1, paddingRight:4}}>
            {containerOrder.filter(cid => containers[cid]).map((cid, idx) => {
              if (idx === 0) {
                // First container's canvas only (title is above)
                return (
                  <div key={cid} style={{display:'grid', gap:8}}>
                    <div className="grid-card" style={{overflow:'hidden'}}>
                      <SvgCanvas containerId={cid} />
                    </div>
                  </div>
                )
              } else {
                // Other containers with full toolbar
                const cWeight = Object.values(packed).filter(p => p.containerId===cid).reduce((acc,p)=> acc + (inventory[p.itemId]?.weight||0), 0)
                const over = cWeight > (containers[cid]?.weightCap ?? Infinity)
                return (
                  <div key={cid} style={{display:'grid', gap:8, marginTop:8}}>
                    <div className="canvas-toolbar">
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        {editingId === cid ? (
                          <input autoFocus className="input" style={{padding:'6px 8px'}}
                                 value={editingName}
                                 onChange={e=>setEditingName(e.currentTarget.value)}
                                 onBlur={()=> { if (editingName.trim()) renameContainer(cid, editingName.trim()); setEditingId(null) }}
                                 onKeyDown={(e)=> { if (e.key==='Enter') { (e.target as HTMLInputElement).blur() } else if (e.key==='Escape') { setEditingId(null) } }}
                          />
                        ) : (
                          <span className="section-title" onDoubleClick={()=> { setEditingId(cid); setEditingName(containers[cid]?.name || cid) }} title="Double‑click to rename">
                            {containers[cid]?.name || cid}
                          </span>
                        )}
                        <span className="chip" data-status={over ? 'bad' : 'ok'}>
                          <span className="material-symbols-rounded">{over ? 'warning' : 'verified'}</span>
                          {over ? `Over weight cap (${cWeight.toFixed(1)} / ${containers[cid].weightCap}kg)` : 'Constraints OK'}
                        </span>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <label>Scale
                          <input style={{ marginLeft: 6 }} type="range" min={50} max={200} defaultValue={100}
                            onChange={(e) => document.documentElement.style.setProperty('--cell-px', String(Math.round((+e.currentTarget.value)/100*24)))}
                            aria-label="Scale canvas" />
                        </label>
                        <button className="icon-btn" onClick={() => removeContainer(cid)} title="Remove container" style={{color:'#DC2626'}}>
                          <span className="material-symbols-rounded">close</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid-card" style={{overflow:'hidden'}}>
                      <SvgCanvas containerId={cid} />
                    </div>
                  </div>
                )
              }
            })}
          </div>
          <div className="inventory-footer" style={{display:'flex', justifyContent:'flex-end', marginTop:8, flexShrink:0}}>
            <button className="btn btn-primary" onClick={() => addContainer()}><span className="material-symbols-rounded">add</span> Add container</button>
          </div>
        </section>

        <aside className="panel right-fixed panel-accent column-flex" aria-label="Constraints and settings">
          <div className="panel-header">
            <div className="section-title">Constraints</div>
            <div style={{display:'flex', gap:8}}>
              <button className="icon-btn" onClick={() => setAddConstraintOpen(true)} disabled={!hasContainers}>
                <span className="material-symbols-rounded">add</span> Add constraint
              </button>
              <button className="icon-btn" onClick={() => setShowAdvanced(s => !s)} aria-expanded={showAdvanced}>
                <span className="material-symbols-rounded">{showAdvanced ? 'visibility' : 'visibility_off'}</span>
                {showAdvanced ? 'Hide advanced' : 'Show advanced'}
              </button>
            </div>
          </div>
          <div style={{overflow:'auto', minHeight:0, flex:1}}>
            <ConstraintsPanel showAdvanced={showAdvanced} />
            <div style={{marginTop:16, display:'grid', gap:8}}>
              <Link className="icon-btn" to="/styleguide"><span className="material-symbols-rounded">palette</span> Styleguide</Link>
              <Link className="icon-btn" to="/"><span className="material-symbols-rounded">logout</span> Log out</Link>
            </div>
          </div>
          <div className="inventory-footer" style={{display:'flex', justifyContent:'flex-end', marginTop:8}}>
            <button className="btn btn-primary" onClick={() => setUnimplementedOpen(true)}><span className="material-symbols-rounded">add</span> Add constraints</button>
          </div>
        </aside>
      </main>
      <footer className="footer-bar" role="contentinfo">
        <Meters />
      </footer>

      {/* Floating Undo/Redo */}
      <div className="fab-undo-redo" aria-label="History controls">
        <button className="fab" title="Undo" onClick={() => undo()}><span className="material-symbols-rounded">undo</span></button>
        <button className="fab" title="Redo" onClick={() => redo()}><span className="material-symbols-rounded">redo</span></button>
      </div>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} />
      <AddConstraintModal open={addConstraintOpen} onClose={() => setAddConstraintOpen(false)} />
      {unimplementedOpen && (
        <div role="dialog" aria-modal="true" aria-label="Feature unavailable" style={{position:'fixed', inset:0, background:'rgba(0,0,0,.3)', display:'grid', placeItems:'center', zIndex:60}} onClick={() => setUnimplementedOpen(false)}>
          <div style={{width:420, maxWidth:'92vw', background:'white', borderRadius:12, boxShadow:'var(--shadow-2)', padding:16}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
              <h2 style={{fontWeight:600}}>Feature Unavailable</h2>
              <button className="icon-btn" onClick={() => setUnimplementedOpen(false)}><span className="material-symbols-rounded">close</span></button>
            </div>
            <div style={{marginBottom:12}}>
              <p style={{color:'#6B7280'}}>This feature is currently unimplemented.</p>
            </div>
            <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
              <button className="btn btn-primary" onClick={() => setUnimplementedOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
