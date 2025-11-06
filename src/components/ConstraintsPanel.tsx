import React from 'react'
import { usePackStore } from '../state/store'

export default function ConstraintsPanel({ showAdvanced }: { showAdvanced: boolean }) {
  const { containers, containerOrder, setReserve, addCustomConstraint, toggleCustomConstraint } = usePackStore()
  const [reserveValues, setReserveValues] = React.useState<Record<string, number>>({})

  React.useEffect(() => {
    const values: Record<string, number> = {}
    containerOrder.filter(cid => containers[cid]).forEach(cid => {
      values[cid] = Math.round((containers[cid]?.reservePct ?? 0) * 100)
    })
    setReserveValues(values)
  }, [containers, containerOrder])

  return (
    <div style={{display:'grid', gap:12}}>
      {containerOrder.filter(cid => containers[cid]).map(cid => {
        const c = containers[cid]
        const reserve = reserveValues[cid] ?? Math.round((c?.reservePct ?? 0) * 100)
        const custom = (c?.customConstraints ?? [])
        return (
          <div key={cid} style={{padding:12, background:'#fff', border:'1px solid var(--slate-200)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-1)'}}>
            <div className="section-title" style={{marginBottom:12}}>{c?.name || cid}</div>
            <label className="input">
              <span>Leave room (margin %)</span>
              <div style={{display:'flex', alignItems:'center', gap:12}}>
                <input 
                  type="range" 
                  min={0} 
                  max={50} 
                  value={reserve}
                  onChange={e => {
                    const val = Math.max(0, Math.min(50, +e.currentTarget.value))
                    setReserveValues(prev => ({ ...prev, [cid]: val }))
                    setReserve(cid, val / 100)
                  }}
                  aria-describedby={`${cid}-reserve-help`}
                  style={{flex:1}}
                />
                <span style={{minWidth:40, textAlign:'right', fontSize:14, fontWeight:600, color:'var(--slate-700)'}}>{reserve}%</span>
              </div>
              <small id={`${cid}-reserve-help`} style={{color:'#6B7280', fontSize:12}}>Keeps some space free from all sides; prevents overstuffing.</small>
            </label>
            {showAdvanced && (
              <>
                <label className="input" style={{marginTop:12}}>
                  <span>Weight capacity (kg)</span>
                  <input type="number" min={1} defaultValue={c?.weightCap ?? 10} />
                </label>
                <div role="group" aria-label="Constraint toggles" style={{display:'flex', flexWrap:'wrap', gap:8, marginTop:12}}>
                  <label className="chip constraint-chip-new"><input type="checkbox" defaultChecked /> Fragile on top</label>
                  <label className="chip constraint-chip-new"><input type="checkbox" /> Odd items no-rotate</label>
                  <label className="chip constraint-chip-new"><input type="checkbox" /> Balance left/right</label>
                </div>
                <div style={{display:'flex', gap:8, marginTop:12}}>
                  <input id={`new-cc-${cid}`} className="input" placeholder="Add constraint (label)" />
                  <button className="icon-btn" onClick={() => {
                    const input = document.getElementById(`new-cc-${cid}`) as HTMLInputElement
                    if (input?.value?.trim()) { addCustomConstraint(cid, input.value.trim()); input.value='' }
                  }}><span className="material-symbols-rounded">add</span> Add</button>
                </div>
                <div style={{display:'flex', flexWrap:'wrap', gap:8, marginTop:12}}>
                  {custom.map(cc => (
                    <button key={cc.id} className={`chip constraint-chip-new`} onClick={() => toggleCustomConstraint(cid, cc.id)} aria-pressed={cc.enabled}>
                      <span className="material-symbols-rounded">{cc.enabled ? 'check' : 'add'}</span>
                      {cc.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
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
