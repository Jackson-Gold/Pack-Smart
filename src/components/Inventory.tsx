import React from 'react'
import { usePackStore, InventoryItem } from '../state/store'

function typeIcon(t: InventoryItem['type']) {
  const map = { laptop:'laptop', shirt:'checkroom', book:'menu_book', hat:'travel', other:'inventory_2' } as const
  return (map as any)[t] ?? 'inventory_2'
}

export default function Inventory({ onAddItem }: { onAddItem: () => void }) {
  const { inventory, packedCountByItem } = usePackStore()

  const handleDragStart = (e: React.PointerEvent, item: InventoryItem) => {
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    const id = 'drag-' + Math.random().toString(36).slice(2,9)
    ;(e.target as HTMLElement).dataset.dragId = id
    ;(e.target as HTMLElement).dataset.itemId = item.id
    const ghost = document.createElement('div')
    ghost.id = 'ghost-' + id
    ghost.style.position = 'fixed'; ghost.style.inset = '0'; ghost.style.pointerEvents = 'none'
    const size = Number(getComputedStyle(document.documentElement).getPropertyValue('--cell-px')||'24')
    ghost.innerHTML = `<div style="position:absolute;left:${e.clientX-10}px;top:${e.clientY-10}px;width:${item.w*size}px;height:${item.h*size}px;background:${item.color};opacity:.35;border:2px dashed #4B5563;border-radius:6px"></div>`
    document.body.appendChild(ghost)
  }
  const handleDragMove = (e: React.PointerEvent) => {
    const id = (e.target as HTMLElement)?.dataset?.dragId
    const el = id ? document.getElementById('ghost-' + id)?.firstElementChild as HTMLDivElement | null : null
    if (el) { el.style.left = `${e.clientX-10}px`; el.style.top = `${e.clientY-10}px` }
  }
  const handleDragEnd = (e: React.PointerEvent, item: InventoryItem) => {
    const id = (e.target as HTMLElement)?.dataset?.dragId
    document.getElementById('ghost-' + id)?.remove()
    ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
    const canvas = el?.closest?.('[data-canvas-id]') as HTMLElement | null
    if (canvas) canvas.dispatchEvent(new CustomEvent('inventory-drop', { bubbles: true, detail: { itemId: item.id, clientX: e.clientX, clientY: e.clientY } }))
  }

  return (
    <div className="column-flex" style={{height:'100%'}}>
      <div role="list" aria-label="Inventory list" className="inventory-scroll" style={{display:'grid', gap:8}}>
        {Object.values(inventory).map(item => {
          const packedCount = packedCountByItem(item.id)
          const remaining = item.count - packedCount
          const disabled = remaining <= 0
          return (
            <div key={item.id}
              role="listitem"
              className="inventory-item"
              aria-disabled={disabled}
              onPointerDown={(e) => !disabled && handleDragStart(e, item)}
              onPointerMove={handleDragMove}
              onPointerUp={(e) => !disabled && handleDragEnd(e, item)}
            >
              <div className="icon-bubble"><span className="material-symbols-rounded" aria-hidden>{typeIcon(item.type)}</span></div>
              <div>
                <div style={{fontWeight:600}}>{item.name}</div>
                <div style={{fontSize:12, color:'#6B7280'}}>
                  {item.w}×{item.h} • {item.weight}kg {item.fragile ? '• Fragile' : ''} {item.odd ? '• Odd' : ''}
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:12}}><strong>{packedCount}</strong> / {item.count} packed</div>
                <div style={{fontSize:12, color: remaining>0 ? '#065F46' : '#991B1B'}}>{remaining} left</div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="inventory-footer" style={{display:'flex', justifyContent:'flex-end', marginTop:8}}>
        <button className="btn btn-primary" onClick={onAddItem}><span className="material-symbols-rounded">add</span> Add item</button>
      </div>
    </div>
  )
}
