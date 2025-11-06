import React from 'react'
import { usePackStore } from '../state/store'

export default function AddItemModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { addInventoryItem } = usePackStore()
  const [form, setForm] = React.useState({ name:'', type:'other', w:1, h:1, weight:0.5, count:1, color:'#94A3B8', fragile:false, odd:false })
  if (!open) return null
  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }))
  const submit = () => { if (!form.name.trim()) return alert('Please enter a name'); addInventoryItem({ ...form }); onClose() }
  return (
    <div role="dialog" aria-modal="true" aria-label="Add item" style={{position:'fixed', inset:0, background:'rgba(0,0,0,.3)', display:'grid', placeItems:'center', zIndex:60}} onClick={onClose}>
      <div style={{width:520, maxWidth:'92vw', background:'white', borderRadius:12, boxShadow:'var(--shadow-2)', padding:16}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
          <h2 style={{fontWeight:600}}>Add item</h2>
          <button className="icon-btn" onClick={onClose}><span className="material-symbols-rounded">close</span></button>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <label className="input"><span>Name</span><input value={form.name} onChange={e=>set('name', e.currentTarget.value)} /></label>
          <label className="input"><span>Type</span>
            <select value={form.type} onChange={e=>set('type', e.currentTarget.value)}>
              <option value="laptop">Laptop</option>
              <option value="shirt">Shirt</option>
              <option value="book">Book</option>
              <option value="hat">Hat</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="input"><span>Width (cells)</span><input type="number" min={1} max={8} value={form.w} onChange={e=>set('w', +e.currentTarget.value)} /></label>
          <label className="input"><span>Height (cells)</span><input type="number" min={1} max={8} value={form.h} onChange={e=>set('h', +e.currentTarget.value)} /></label>
          <label className="input"><span>Weight (kg)</span><input type="number" min={0} step="0.1" value={form.weight} onChange={e=>set('weight', +e.currentTarget.value)} /></label>
          <label className="input"><span>Count</span><input type="number" min={1} max={20} value={form.count} onChange={e=>set('count', +e.currentTarget.value)} /></label>
          <label className="input" style={{gridColumn:'1 / -1'}}><span>Color</span><input type="color" value={form.color} onChange={e=>set('color', e.currentTarget.value)} /></label>
          <label className="chip"><input type="checkbox" checked={form.fragile} onChange={e=>set('fragile', e.currentTarget.checked)} /> Fragile</label>
          <label className="chip"><input type="checkbox" checked={form.odd} onChange={e=>set('odd', e.currentTarget.checked)} /> Odd item</label>
        </div>
        <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:12}}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}><span className="material-symbols-rounded">check</span> Add</button>
        </div>
      </div>
    </div>
  )
}
