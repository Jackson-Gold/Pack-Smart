import React from 'react'
import { usePackStore } from '../state/store'

const MATERIAL_ICONS = [
  'laptop', 'phone_iphone', 'tablet', 'watch', 'headphones', 'speaker', 'camera', 'tv',
  'checkroom', 'luggage',
  'menu_book', 'book', 'library_books', 'newspaper', 'description', 'folder',
  'travel', 'flight', 'hotel', 'restaurant', 'local_cafe', 'fastfood',
  'inventory_2', 'shopping_bag', 'shopping_cart', 'store', 'package', 'box',
  'sports_soccer', 'sports_basketball', 'sports_tennis', 'fitness_center', 'pool', 'golf_course',
  'kitchen', 'microwave', 'coffee', 'wine_bar', 'restaurant_menu', 'cake',
  'toys', 'pets', 'child_care', 'school', 'work', 'home',
  'medical_services', 'medication', 'vaccines', 'healing', 'local_pharmacy',
  'construction', 'hardware', 'build', 'settings', 'handyman',
  'outdoor_garden', 'yard', 'park', 'nature', 'forest', 'beach_access',
  'music_note', 'headset', 'radio', 'piano', 'theater_comedy',
  'directions_car', 'two_wheeler', 'directions_bike', 'sailing', 'snowmobile',
  'camping', 'hiking', 'kayaking', 'surfing', 'skateboarding', 'snowboarding'
]

function IconPicker({ value, onChange }: { value: string, onChange: (icon: string) => void }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const filteredIcons = React.useMemo(() => 
    MATERIAL_ICONS.filter(icon => icon.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  return (
    <div style={{position:'relative'}}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width:'100%',
          display:'flex',
          alignItems:'center',
          gap:8,
          padding:'8px 12px',
          border:'1px solid #D1D5DB',
          borderRadius:8,
          background:'white',
          cursor:'pointer',
          fontSize:14
        }}
      >
        <span className="material-symbols-rounded" style={{fontSize:20}}>{value || 'inventory_2'}</span>
        <span style={{flex:1, textAlign:'left'}}>{value || 'Select icon'}</span>
        <span className="material-symbols-rounded" style={{fontSize:16, color:'#6B7280'}}>
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {isOpen && (
        <>
          <div
            style={{
              position:'fixed',
              inset:0,
              zIndex:61
            }}
            onClick={() => setIsOpen(false)}
          />
          <div
            style={{
              position:'absolute',
              top:'100%',
              left:0,
              right:0,
              marginTop:4,
              background:'white',
              borderRadius:12,
              boxShadow:'var(--shadow-2)',
              border:'1px solid #E5E7EB',
              zIndex:62,
              maxHeight:300,
              display:'flex',
              flexDirection:'column'
            }}
            onClick={e=>e.stopPropagation()}
          >
            <div style={{padding:12, borderBottom:'1px solid #E5E7EB'}}>
              <input
                type="text"
                placeholder="Search icons..."
                value={search}
                onChange={e=>setSearch(e.currentTarget.value)}
                style={{
                  width:'100%',
                  padding:'8px 12px',
                  border:'1px solid #D1D5DB',
                  borderRadius:8,
                  fontSize:14
                }}
                autoFocus
              />
            </div>
            <div
              style={{
                overflowY:'auto',
                padding:8,
                display:'grid',
                gridTemplateColumns:'repeat(auto-fill, minmax(48px, 1fr))',
                gap:8,
                maxHeight:240
              }}
            >
              {filteredIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => { onChange(icon); setIsOpen(false); setSearch('') }}
                  style={{
                    aspectRatio:'1',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    border:'2px solid',
                    borderColor:value === icon ? 'var(--indigo-600)' : '#E5E7EB',
                    borderRadius:8,
                    background:value === icon ? '#EEF2FF' : 'white',
                    cursor:'pointer',
                    transition:'all 0.2s'
                  }}
                  title={icon}
                >
                  <span className="material-symbols-rounded" style={{fontSize:24}}>{icon}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function AddItemModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { addInventoryItem } = usePackStore()
  const [form, setForm] = React.useState({ name:'', type:'inventory_2', w:1, h:1, weight:0.5, count:1, color:'#94A3B8', fragile:false, odd:false })
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
          <label className="input"><span>Icon</span>
            <IconPicker value={form.type} onChange={icon => set('type', icon)} />
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
