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
import { useEffect } from 'react';

const BASE_CELL_PX = 24
const MIN_SCALE_PERCENT = 75
const MAX_SCALE_PERCENT = 300
const DEFAULT_SCALE_PERCENT = 225

type PresetItem = {
  name: string
  type: string
  w: number
  h: number
  weight: number
  count: number
  color: string
  fragile: boolean
  odd: boolean
}

export type PackingPreset = {
  id: string
  name: string
  icon: string
  summary: string
  items: PresetItem[]
}

const PACK_PRESETS: PackingPreset[] = [
  {
    id: 'beach-weekend',
    name: 'Beach Weekend',
    icon: 'beach_access',
    summary: 'Swimwear, light clothing, sun protection, and a beach bag.',
    items: [
      { name: 'Beach Tote', type: 'shopping_bag', w: 2, h: 2, weight: 0.8, count: 1, color: '#FBBF24', fragile: false, odd: false },
      { name: 'Swimsuit', type: 'beach_access', w: 1, h: 1, weight: 0.2, count: 2, color: '#38BDF8', fragile: false, odd: false },
      { name: 'Flip Flops', type: 'deck', w: 2, h: 1, weight: 0.4, count: 1, color: '#0EA5E9', fragile: false, odd: false },
      { name: 'Towels', type: 'dry_cleaning', w: 2, h: 2, weight: 1.2, count: 2, color: '#F97316', fragile: false, odd: false },
      { name: 'Sunscreen', type: 'medication', w: 1, h: 1, weight: 0.3, count: 1, color: '#FACC15', fragile: false, odd: false },
      { name: 'Sunglasses', type: 'eyeglasses', w: 1, h: 1, weight: 0.1, count: 1, color: '#0F172A', fragile: true, odd: false },
      { name: 'Light Outfits', type: 'checkroom', w: 2, h: 2, weight: 1.6, count: 3, color: '#60A5FA', fragile: false, odd: false }
    ]
  },
  {
    id: 'ski-trip',
    name: 'Ski Trip',
    icon: 'downhill_skiing',
    summary: 'Heavy layers, ski gear, helmet, and gloves for cold weather.',
    items: [
      { name: 'Ski Jacket', type: 'checkroom', w: 2, h: 2, weight: 1.5, count: 1, color: '#1D4ED8', fragile: false, odd: false },
      { name: 'Snow Pants', type: 'styler', w: 2, h: 2, weight: 1.2, count: 1, color: '#1E293B', fragile: false, odd: false },
      { name: 'Base Layers', type: 'checkroom', w: 2, h: 1, weight: 0.7, count: 2, color: '#22C55E', fragile: false, odd: false },
      { name: 'Gloves & Hat', type: 'redeem', w: 1, h: 1, weight: 0.3, count: 1, color: '#F97316', fragile: false, odd: false },
      { name: 'Goggles', type: 'eyeglasses', w: 1, h: 1, weight: 0.2, count: 1, color: '#0F172A', fragile: true, odd: false },
      { name: 'Helmet', type: 'sports_motorsports', w: 2, h: 2, weight: 0.9, count: 1, color: '#EF4444', fragile: true, odd: true },
      { name: 'Apres Shoes', type: 'hiking', w: 2, h: 1, weight: 0.9, count: 1, color: '#92400E', fragile: false, odd: false }
    ]
  },
  {
    id: 'business-trip',
    name: 'Business Trip',
    icon: 'work',
    summary: 'Laptop, work outfits, toiletries, and travel documents.',
    items: [
      { name: 'Laptop', type: 'laptop', w: 2, h: 1, weight: 1.3, count: 1, color: '#0EA5E9', fragile: true, odd: false },
      { name: 'Charger & Cables', type: 'power', w: 1, h: 1, weight: 0.3, count: 1, color: '#6B7280', fragile: false, odd: true },
      { name: 'Work Outfits', type: 'checkroom', w: 2, h: 2, weight: 2.0, count: 3, color: '#6366F1', fragile: false, odd: false },
      { name: 'Shoes (Dress)', type: 'hiking', w: 2, h: 1, weight: 0.8, count: 1, color: '#4B5563', fragile: false, odd: false },
      { name: 'Toiletry Kit', type: 'backpack', w: 2, h: 1, weight: 0.5, count: 1, color: '#F97316', fragile: false, odd: false },
      { name: 'Notebook & Pen', type: 'menu_book', w: 1, h: 1, weight: 0.2, count: 1, color: '#FACC15', fragile: false, odd: false },
      { name: 'Travel Docs', type: 'badge', w: 1, h: 1, weight: 0.1, count: 1, color: '#22C55E', fragile: true, odd: false }
    ]
  },
  {
    id: 'weekend-city',
    name: 'Weekend City Break',
    icon: 'location_city',
    summary: 'Casual outfits, light jacket, daypack, and small essentials.',
    items: [
      { name: 'Daypack', type: 'backpack', w: 2, h: 2, weight: 0.7, count: 1, color: '#22C55E', fragile: false, odd: false },
      { name: 'Casual Outfits', type: 'checkroom', w: 2, h: 2, weight: 1.5, count: 3, color: '#3B82F6', fragile: false, odd: false },
      { name: 'Light Jacket', type: 'checkroom', w: 2, h: 1, weight: 0.6, count: 1, color: '#0EA5E9', fragile: false, odd: false },
      { name: 'Walking Shoes', type: 'hiking', w: 2, h: 1, weight: 0.9, count: 1, color: '#F97316', fragile: false, odd: false },
      { name: 'Headphones', type: 'headphones', w: 1, h: 1, weight: 0.2, count: 1, color: '#6B7280', fragile: true, odd: false },
      { name: 'Small Umbrella', type: 'umbrella', w: 1, h: 1, weight: 0.3, count: 1, color: '#0F172A', fragile: false, odd: true }
    ]
  }
]

export default function App() {
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  // 3) Help opens by default when user lands on this page
  const [helpOpen, setHelpOpen] = React.useState(true)

  const [addOpen, setAddOpen] = React.useState(false)
  const [addConstraintOpen, setAddConstraintOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingName, setEditingName] = React.useState('')
  const {
    optimize,
    packed,
    inventory,
    containers,
    containerOrder,
    removeContainer,
    undo,
    redo,
    renameContainer,
    loadPresetInventory,
    addContainerWithConfig,
  } = usePackStore()

  const [shareOpen, setShareOpen] = React.useState(false)
  const [shareText, setShareText] = React.useState('')
  const [scalePercent, setScalePercent] = React.useState(DEFAULT_SCALE_PERCENT)
  const [packForMeOpen, setPackForMeOpen] = React.useState(false)

  // Add Packing Space overlay state
  const [newContainerOpen, setNewContainerOpen] = React.useState(false)
  const [newContainerForm, setNewContainerForm] = React.useState({
    name: '',
    cols: 16,
    rows: 12,
    weightCap: 10,
    reservePct: 5, // percent (0–50)
  })

  // Optimize menu state (header)
  const [optMenuOpen, setOptMenuOpen] = React.useState(false)
  const optMenuRef = React.useRef<HTMLDivElement | null>(null)

  const buildShareText = React.useCallback(() => {
    const lines: string[] = []
    const anyContainers = containerOrder.some(cid => containers[cid])

    if (!anyContainers) {
      lines.push('No containers yet — add one in the Packing zone.')
      return lines.join('\n')
    }

    containerOrder.forEach(cid => {
      const c = containers[cid]
      if (!c) return

      const reservePct = Math.round((c.reservePct ?? 0) * 100)
      const headerBits: string[] = []

      if (c.cols && c.rows) headerBits.push(`${c.cols}×${c.rows} cells`)
      if (reservePct) headerBits.push(`margin ${reservePct}%`)
      if (typeof c.weightCap === 'number') headerBits.push(`cap ${c.weightCap} kg`)

      lines.push(`Container: ${c.name || cid}`)
      if (headerBits.length) {
        lines.push(`  (${headerBits.join(' · ')})`)
      }

      const packedInContainer = Object.values(packed).filter(p => p.containerId === cid)

      if (!packedInContainer.length) {
        lines.push('  (no items)')
      } else {
        lines.push('  Items:')
        packedInContainer.forEach(p => {
          const item = inventory[p.itemId]
          if (!item) return
          lines.push(
            `    • ${item.name} — ${item.w}×${item.h} cells, ${item.weight} kg at (${p.x}, ${p.y})`
          )
        })
      }

      lines.push('')
    })

    return lines.join('\n')
  }, [containerOrder, containers, packed, inventory])

  const handleShareClick = () => {
    const text = buildShareText()
    setShareText(text)
    setShareOpen(true)
  }

  const handlePresetApply = (preset: PackingPreset) => {
    const confirmed = window.confirm(
      `This will clear your current items and load the "${preset.name}" packing list. Continue?`
    )
    if (!confirmed) return

    loadPresetInventory(preset as any)
    setPackForMeOpen(false)
  }

  // Create container from overlay
  const handleCreateContainer = () => {
    const cols = Math.max(1, Number(newContainerForm.cols) || 1)
    const rows = Math.max(1, Number(newContainerForm.rows) || 1)
    const weightCap = Math.max(1, Number(newContainerForm.weightCap) || 1)
    const reservePctPercent = Math.min(50, Math.max(0, Number(newContainerForm.reservePct) || 0))

    addContainerWithConfig({
      name: newContainerForm.name.trim() || undefined,
      cols,
      rows,
      weightCap,
      reservePct: reservePctPercent / 100,
    })

    setNewContainerOpen(false)
    setNewContainerForm({
      name: '',
      cols: 16,
      rows: 12,
      weightCap: 10,
      reservePct: 5,
    })
  }

  useEffect(() => {
    const px = Math.round((scalePercent / 100) * BASE_CELL_PX)
    document.documentElement.style.setProperty('--cell-px', String(px))
  }, [scalePercent])

  // Close optimize menu when clicking outside
  useEffect(() => {
    if (!optMenuOpen) return
    const handler = (event: MouseEvent) => {
      if (!optMenuRef.current) return
      if (!optMenuRef.current.contains(event.target as Node)) {
        setOptMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [optMenuOpen])

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScalePercent(Number(e.currentTarget.value))
  }

  return (
    <div className="app-shell">
      <header className="appbar" role="banner">
        <div className="brand" aria-label="SmartPack">
          <span className="logo"><span className="material-symbols-rounded" aria-hidden>backpack</span></span>
          PackSmart
        </div>
        <div className="toolbar">
          {/* Optimize dropdown (header) */}
          <div
            ref={optMenuRef}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <button
              className="icon-btn"
              onClick={() => setOptMenuOpen(o => !o)}
              title="Optimize packing"
            >
              <span className="material-symbols-rounded">auto_awesome</span>
              Pack For Me
              <span
                className="material-symbols-rounded"
                aria-hidden
                style={{ marginLeft: 4, fontSize: 18 }}
              >
                {optMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            {optMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 4,
                  minWidth: 220,
                  background: '#FFFFFF',
                  borderRadius: 8,
                  boxShadow: 'var(--shadow-2)',
                  border: '1px solid #E5E7EB',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    optimize('space')
                    setOptMenuOpen(false)
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    border: 'none',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  <span className="material-symbols-rounded" aria-hidden>
                    auto_awesome
                  </span>
                  <span>Optimize for space</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    optimize('weight')
                    setOptMenuOpen(false)
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    border: 'none',
                    borderTop: '1px solid #E5E7EB',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  <span className="material-symbols-rounded" aria-hidden>
                    line_weight
                  </span>
                  <span>Optimize for weight</span>
                </button>
              </div>
            )}
          </div>

          <button
            className="icon-btn"
            onClick={handleShareClick}
            title="Share layout"
          >
            <span className="material-symbols-rounded">ios_share</span> Share
          </button>

          <button
            className="icon-btn"
            data-variant="filled"
            onClick={() => setHelpOpen(true)}
            aria-haspopup="dialog"
            aria-controls="help-modal"
          >
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
                    <span className="section-title" onDoubleClick={()=> { setEditingId(firstCid); setEditingName(containers[firstCid]?.name || firstCid) }} title="Double-click to rename">
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
                    <input
                      style={{ marginLeft: 6 }}
                      type="range"
                      min={MIN_SCALE_PERCENT}
                      max={MAX_SCALE_PERCENT}
                      value={scalePercent}
                      onChange={handleScaleChange}
                      onInput={handleScaleChange}
                      aria-label="Scale canvas"
                    />
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
                          <span className="section-title" onDoubleClick={()=> { setEditingId(cid); setEditingName(containers[cid]?.name || cid) }} title="Double-click to rename">
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
                          <input
                            style={{ marginLeft: 6 }}
                            type="range"
                            min={MIN_SCALE_PERCENT}
                            max={MAX_SCALE_PERCENT}
                            value={scalePercent}
                            onChange={handleScaleChange}
                            onInput={handleScaleChange}
                            aria-label="Scale canvas"
                          />
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
            {/* Open Add Packing Space overlay */}
            <button className="btn btn-primary" onClick={() => setNewContainerOpen(true)}>
              <span className="material-symbols-rounded">add</span> Add Packing Space
            </button>
          </div>
        </section>

        <aside className="panel right-fixed panel-accent column-flex" aria-label="Constraints and settings">
          <div className="panel-header">
            <div className="section-title">Constraints</div>
            <div style={{display:'flex', gap:8}}>
              <button className="icon-btn" onClick={() => setShowAdvanced(s => !s)} aria-expanded={showAdvanced}>
                <span className="material-symbols-rounded">{showAdvanced ? 'visibility' : 'visibility_off'}</span>
                {showAdvanced ? 'Hide advanced' : 'Show advanced'}
              </button>
            </div>
          </div>
          <div style={{overflow:'auto', minHeight:0, flex:1}}>
            <ConstraintsPanel showAdvanced={showAdvanced} />
            <div style={{marginTop:16, display:'grid', gap:8}}>
              <Link className="icon-btn" to="/"><span className="material-symbols-rounded">logout</span> Log out</Link>
            </div>
          </div>
          <div className="inventory-footer" style={{display:'flex', justifyContent:'flex-end', marginTop:8}}>
            {/* Packing lists preset picker */}
            <button className="btn btn-primary" onClick={() => setPackForMeOpen(true)}>
              <span className="material-symbols-rounded">auto_fix_high</span> Packing Lists
            </button>
          </div>
        </aside>
      </main>
      <footer className="footer-bar" role="contentinfo">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
          <Meters />
        </div>
      </footer>

      {/* Floating Undo/Redo */}
      <div className="fab-undo-redo" aria-label="History controls">
        <button className="fab" title="Undo" onClick={() => undo()}><span className="material-symbols-rounded">undo</span></button>
        <button className="fab" title="Redo" onClick={() => redo()}><span className="material-symbols-rounded">redo</span></button>
      </div>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} />
      <AddConstraintModal open={addConstraintOpen} onClose={() => setAddConstraintOpen(false)} />

      {/* Share modal */}
      {shareOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Share layout"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.3)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 60,
          }}
          onClick={() => setShareOpen(false)}
        >
          <div
            style={{
              width: 520,
              maxWidth: '92vw',
              background: 'white',
              borderRadius: 12,
              boxShadow: 'var(--shadow-2)',
              padding: 16,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <h2 style={{ fontWeight: 600 }}>Share layout</h2>
              <button className="icon-btn" onClick={() => setShareOpen(false)}>
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 8 }}>
              Copy this summary and send it in chat or email.
            </p>

            <textarea
              readOnly
              value={shareText}
              style={{
                width: '100%',
                minHeight: 220,
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: 13,
                padding: 12,
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                resize: 'vertical',
                background: '#F9FAFB',
                whiteSpace: 'pre',
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 12,
                gap: 8,
              }}
            >
              <button
                type="button"
                className="btn"
                onClick={() => {
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard
                      .writeText(shareText)
                      .then(() => alert('Layout summary copied to clipboard.'))
                      .catch(() =>
                        alert(
                          'Could not copy automatically. Please copy the text manually.'
                        )
                      )
                  } else {
                    alert(
                      'Your browser does not support automatic copying. Please copy the text manually.'
                    )
                  }
                }}
              >
                <span className="material-symbols-rounded">content_copy</span>{' '}
                Copy to clipboard
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShareOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pack For Me modal (packing lists) */}
      {packForMeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pack For Me presets"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.35)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 60,
          }}
          onClick={() => setPackForMeOpen(false)}
        >
          <div
            style={{
              width: 560,
              maxWidth: '92vw',
              background: 'white',
              borderRadius: 12,
              boxShadow: 'var(--shadow-2)',
              padding: 16,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <h2 style={{ fontWeight: 600 }}>Pack For Me</h2>
              <button className="icon-btn" onClick={() => setPackForMeOpen(false)}>
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 12 }}>
              Choose a trip type below. We&apos;ll clear your current items and
              load a curated packing list for you (after confirmation).
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: 10,
                maxHeight: 360,
                overflowY: 'auto',
              }}
            >
              {PACK_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetApply(preset)}
                  style={{
                    textAlign: 'left',
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    background: '#F9FAFB',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    transition: 'background 0.15s, border-color 0.15s, transform 0.1s',
                  }}
                  onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.99)')}
                  onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="material-symbols-rounded" aria-hidden style={{ fontSize: 24 }}>
                        {preset.icon}
                      </span>
                      <span style={{ fontWeight: 600 }}>{preset.name}</span>
                    </div>
                    <span
                      className="material-symbols-rounded"
                      aria-hidden
                      style={{ fontSize: 20, color: '#9CA3AF' }}
                    >
                      arrow_forward
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#4B5563' }}>{preset.summary}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Packing Space modal */}
      {newContainerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add container"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.3)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 60,
          }}
          onClick={() => setNewContainerOpen(false)}
        >
          <div
            style={{
              width: 420,
              maxWidth: '92vw',
              background: 'white',
              borderRadius: 12,
              boxShadow: 'var(--shadow-2)',
              padding: 16,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <h2 style={{ fontWeight: 600 }}>Add Packing Space</h2>
              <button className="icon-btn" onClick={() => setNewContainerOpen(false)}>
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginTop: 4,
              }}
            >
              <label className="input" style={{ gridColumn: '1 / -1' }}>
                <span>Name (optional)</span>
                <input
                  type="text"
                  value={newContainerForm.name}
                  onChange={e =>
                    setNewContainerForm(f => ({ ...f, name: e.currentTarget.value }))
                  }
                />
              </label>
              <label className="input">
                <span>Width (cells)</span>
                <input
                  type="number"
                  min={1}
                  max={48}
                  value={newContainerForm.cols}
                  onChange={e =>
                    setNewContainerForm(f => ({
                      ...f,
                      cols: Number(e.currentTarget.value),
                    }))
                  }
                />
              </label>
              <label className="input">
                <span>Height (cells)</span>
                <input
                  type="number"
                  min={1}
                  max={48}
                  value={newContainerForm.rows}
                  onChange={e =>
                    setNewContainerForm(f => ({
                      ...f,
                      rows: Number(e.currentTarget.value),
                    }))
                  }
                />
              </label>
              <label className="input">
                <span>Max weight (kg)</span>
                <input
                  type="number"
                  min={1}
                  value={newContainerForm.weightCap}
                  onChange={e =>
                    setNewContainerForm(f => ({
                      ...f,
                      weightCap: Number(e.currentTarget.value),
                    }))
                  }
                />
              </label>
              <label className="input">
                <span>Margin (%)</span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={newContainerForm.reservePct}
                  onChange={e =>
                    setNewContainerForm(f => ({
                      ...f,
                      reservePct: Number(e.currentTarget.value),
                    }))
                  }
                />
              </label>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
                marginTop: 12,
              }}
            >
              <button className="btn" onClick={() => setNewContainerOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateContainer}>
                <span className="material-symbols-rounded">add</span> Add Packing Space
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
