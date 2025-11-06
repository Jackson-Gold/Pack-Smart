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
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingName, setEditingName] = React.useState('')
  const { optimize, packed, inventory, containers, containerOrder, addContainer, undo, redo, renameContainer } = usePackStore()

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

        <section className="canvas-wrap middle-scroll" aria-label="Containers">
          <div className="canvas-toolbar">
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <span className="section-title">Containers</span>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <button className="icon-btn" onClick={() => addContainer()} title="Add container">
                <span className="material-symbols-rounded">add</span> Add container
              </button>
            </div>
          </div>
          {containerOrder.filter(cid => containers[cid]).map(cid => {
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
                  </div>
                </div>
                <div className="grid-card">
                  <SvgCanvas containerId={cid} />
                </div>
              </div>
            )
          })}
        </section>

        <aside className="panel right-fixed panel-accent" aria-label="Constraints and settings">
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
          <ConstraintsPanel showAdvanced={showAdvanced} />
          <div style={{marginTop:16, display:'grid', gap:8}}>
            <Link className="icon-btn" to="/styleguide"><span className="material-symbols-rounded">palette</span> Styleguide</Link>
            <Link className="icon-btn" to="/"><span className="material-symbols-rounded">logout</span> Log out</Link>
          </div>
        </aside>
      </main>
      <footer className="footer-bar" role="contentinfo">
        <Meters />
        <div style={{opacity:.9}}>© {new Date().getFullYear()} SmartPack</div>
      </footer>

      {/* Floating Undo/Redo */}
      <div className="fab-undo-redo" aria-label="History controls">
        <button className="fab" title="Undo" onClick={() => undo()}><span className="material-symbols-rounded">undo</span></button>
        <button className="fab" title="Redo" onClick={() => redo()}><span className="material-symbols-rounded">redo</span></button>
      </div>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} />
      <AddConstraintModal open={addConstraintOpen} onClose={() => setAddConstraintOpen(false)} />
    </div>
  )
}
