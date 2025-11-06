import React from 'react'
import { usePackStore } from '../state/store'

export default function Meters() {
  const { inventory, packed, containers, containerOrder } = usePackStore()
  const items = Object.values(packed)
  const totalWeight = items.reduce((acc,p)=> acc + (inventory[p.itemId]?.weight ?? 0), 0)
  const totalCells = items.reduce((acc,p)=> { const it = inventory[p.itemId]; return acc + (it?.w||1)*(it?.h||1) },0)
  const maxCells = containerOrder.reduce((acc,id)=> acc + containers[id].cols*containers[id].rows, 0) || 1

  return (
    <div style={{display:'flex', alignItems:'center', gap:24}}>
      <div>
        <div style={{fontSize:12, marginBottom:6}}>Weight</div>
        <div className="meter" role="meter" aria-valuemin={0} aria-valuemax={20} aria-valuenow={totalWeight}>
          <span style={{ width: `${Math.min(100, totalWeight/20*100)}%` }} />
        </div>
        <small>{totalWeight.toFixed(1)} / 20 kg (all containers)</small>
      </div>
      <div>
        <div style={{fontSize:12, marginBottom:6}}>Volume (grid cells used)</div>
        <div className="meter" role="meter" aria-valuemin={0} aria-valuemax={maxCells} aria-valuenow={totalCells}>
          <span style={{ width: `${Math.min(100, totalCells/maxCells*100)}%` }} />
        </div>
        <small>{totalCells} / {maxCells} cells</small>
      </div>
    </div>
  )
}
