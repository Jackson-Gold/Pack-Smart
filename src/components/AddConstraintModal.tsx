import React from 'react'
import { usePackStore } from '../state/store'

export default function AddConstraintModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { containerOrder, addCustomConstraint } = usePackStore()
  const [label, setLabel] = React.useState('')
  const [cid, setCid] = React.useState<string | null>(null)
  const noneAvailable = !containerOrder || containerOrder.length === 0
  React.useEffect(() => { if (!cid && containerOrder.length) setCid(containerOrder[0]) }, [containerOrder])
  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" aria-label="Add constraint" style={{position:'fixed', inset:0, background:'rgba(0,0,0,.3)', display:'grid', placeItems:'center', zIndex:60}} onClick={onClose}>
      <div style={{width:420, maxWidth:'92vw', background:'#fff', borderRadius:12, boxShadow:'var(--shadow-2)', padding:16}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
          <h2 style={{fontWeight:600}}>Add constraint</h2>
          <button className="icon-btn" onClick={onClose}><span className="material-symbols-rounded">close</span></button>
        </div>
        <div style={{display:'grid', gap:10}}>
          {noneAvailable && <div className="chip" data-status="warn"><span className="material-symbols-rounded">warning</span> No containers yet. Add a container first.</div>}
          <label className="input"><span>Label</span><input value={label} onChange={e=>setLabel(e.currentTarget.value)} placeholder="e.g., Keep toiletries separate" /></label>
          <label className="input"><span>Container</span>
            <select value={cid ?? ''} onChange={e=>setCid(e.currentTarget.value)} disabled={noneAvailable}>
              {containerOrder.map(id => <option key={id} value={id}>{id}</option>)}
            </select>
          </label>
        </div>
        <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:12}}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={noneAvailable || !label.trim() || !cid} onClick={() => { if (label.trim() && cid) { addCustomConstraint(cid, label.trim()); onClose() } }}>
            <span className="material-symbols-rounded">check</span> Add
          </button>
        </div>
      </div>
    </div>
  )
}
