import React from 'react'
import { usePackStore } from '../state/store'

export default function ConstraintsPanel({ showAdvanced }: { showAdvanced: boolean }) {
  const { containers, containerOrder, setReserve, addCustomConstraint, toggleCustomConstraint } = usePackStore()

  return (
    <div style={{display:'grid', gap:12}}>
      {containerOrder.filter(cid => containers[cid]).map(cid => {
        const c = containers[cid]
        const reserve = Math.round((c?.reservePct ?? 0) * 100)
        const custom = (c?.customConstraints ?? [])
        return (
          <fieldset key={cid} style={{border:'1px solid #E5E7EB', borderRadius:10, padding:10}}>
            <legend style={{padding:'0 6px', fontWeight:600}}>{c?.name || cid}</legend>
            <label style={{display:'grid', gap:6}}>
              <span>Leave room (margin %)</span>
              <input type="range" min={0} max={50} defaultValue={reserve}
                     onChange={e => setReserve(cid, Math.max(0, Math.min(50, +e.currentTarget.value))/100)}
                     aria-describedby={`${cid}-reserve-help`} />
              <small id={`${cid}-reserve-help`} style={{color:'#0F172A'}}>Keeps some space free from all sides; prevents overstuffing.</small>
            </label>
            {showAdvanced && (
              <>
                <label className="input">
                  <span>Weight capacity (kg)</span>
                  <input type="number" min={1} defaultValue={c?.weightCap ?? 10} />
                </label>
                <div role="group" aria-label="Constraint toggles" style={{display:'flex', flexWrap:'wrap', gap:8}}>
                  <label className="chip constraint-chip-new"><input type="checkbox" defaultChecked /> Fragile on top</label>
                  <label className="chip constraint-chip-new"><input type="checkbox" /> Odd items no-rotate</label>
                  <label className="chip constraint-chip-new"><input type="checkbox" /> Balance left/right</label>
                </div>
                <div style={{display:'flex', gap:8, marginTop:8}}>
                  <input id={`new-cc-${cid}`} className="input" placeholder="Add constraint (label)" />
                  <button className="icon-btn" onClick={() => {
                    const input = document.getElementById(`new-cc-${cid}`) as HTMLInputElement
                    if (input?.value?.trim()) { addCustomConstraint(cid, input.value.trim()); input.value='' }
                  }}><span className="material-symbols-rounded">add</span> Add</button>
                </div>
                <div style={{display:'flex', flexWrap:'wrap', gap:8, marginTop:6}}>
                  {custom.map(cc => (
                    <button key={cc.id} className={`chip constraint-chip-new`} onClick={() => toggleCustomConstraint(cid, cc.id)} aria-pressed={cc.enabled}>
                      <span className="material-symbols-rounded">{cc.enabled ? 'check' : 'add'}</span>
                      {cc.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </fieldset>
        )
      })}

      <details>
        <summary className="section-title" style={{cursor:'pointer'}}>Danger zone</summary>
        <button className="icon-btn" onClick={() => {
          if (confirm('Clear all packed items?')) {
            localStorage.removeItem('pack-smart')
            location.reload()
          }
        }}><span className="material-symbols-rounded">restart_alt</span> Reset state</button>
      </details>
    </div>
  )
}
