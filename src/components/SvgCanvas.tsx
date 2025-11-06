import React from 'react'
import { usePackStore } from '../state/store'

type Props = { containerId: string }
const CELL = () => Number(getComputedStyle(document.documentElement).getPropertyValue('--cell-px') || '24')

export default function SvgCanvas({ containerId }: Props) {
  const { containers, packed, order, inventory, addPacked, movePacked, removePacked } = usePackStore()
  const container = containers[containerId]
  const svgRef = React.useRef<SVGSVGElement | null>(null)
  const [hover, setHover] = React.useState<{x:number,y:number,w:number,h:number,ok:boolean}|null>(null)
  const [focusId, setFocusId] = React.useState<string | null>(null)

  const cols = container.cols, rows = container.rows
  const width = cols * CELL(), height = rows * CELL()

  React.useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const handleDrop = (e: Event) => {
      const ce = e as CustomEvent
      const { itemId, clientX, clientY } = ce.detail
      const rect = el.getBoundingClientRect()
      const cell = CELL()
      const gx = Math.floor((clientX - rect.left) / cell)
      const gy = Math.floor((clientY - rect.top) / cell)
      const item = inventory[itemId]
      if (!item) return
      const rxc = Math.floor(container.reservePct * cols / 2)
      const ryc = Math.floor(container.reservePct * rows / 2)
      const pos = clampToGrid(gx, gy, item.w, item.h, cols, rows, rxc, ryc)
      const collision = collides(pos.x, pos.y, item.w, item.h, Object.values(packed).filter(p => p.containerId === containerId), inventory)
      const innerCols = cols - 2*rxc; const innerRows = rows - 2*ryc
      const allowedCells = innerCols * innerRows
      const usedCells = Object.values(packed).filter(p => p.containerId===containerId).reduce((acc,p)=>{ const ii = inventory[p.itemId]; return acc + (ii?.w||1)*(ii?.h||1) },0)
      const usedWeight = Object.values(packed).filter(p => p.containerId===containerId).reduce((acc,p)=> acc + (inventory[p.itemId]?.weight||0), 0)
      const withinRing = (pos.x >= rxc) && (pos.y >= ryc) && (pos.x + item.w <= rxc + innerCols) && (pos.y + item.h <= ryc + innerRows)
      const ok = !collision && withinRing && (usedCells + item.w*item.h) <= allowedCells && (usedWeight + item.weight) <= container.weightCap
      setHover({ x: pos.x, y: pos.y, w: item.w, h: item.h, ok })
      if (ok) {
        const pid = 'p-' + Math.random().toString(36).slice(2,9)
        addPacked({ id: pid, itemId, containerId, x: pos.x, y: pos.y })
      } else {
        window.alert('Cannot place item here (collision or capacity/reserve exceeded).')
      }
    }
    el.addEventListener('inventory-drop', handleDrop as any)
    return () => el.removeEventListener('inventory-drop', handleDrop as any)
  }, [svgRef.current, packed, inventory, container])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!focusId) return
    const p = packed[focusId]; if (!p || p.containerId !== containerId) return
    const step = e.shiftKey ? 2 : 1
    let nx = p.x, ny = p.y
    if (e.key === 'ArrowLeft') nx = p.x - step
    else if (e.key === 'ArrowRight') nx = p.x + step
    else if (e.key === 'ArrowUp') ny = p.y - step
    else if (e.key === 'ArrowDown') ny = p.y + step
    else if (e.key === 'Delete' || e.key === 'Backspace') { removePacked(p.id); return }
    else return
    e.preventDefault()
    const item = inventory[p.itemId]
    const rxc = Math.floor(container.reservePct * cols / 2)
    const ryc = Math.floor(container.reservePct * rows / 2)
    const pos = clampToGrid(nx, ny, item.w, item.h, cols, rows, rxc, ryc)
    const collision = collides(pos.x, pos.y, item.w, item.h, Object.values(packed).filter(q => q.containerId===containerId && q.id!==p.id), inventory)
    if (!collision) movePacked(p.id, pos.x, pos.y)
  }

  const packedForThis = order.map(id => packed[id]).filter(p => p?.containerId === containerId)

  return (
    <svg ref={svgRef} className="grid-svg" role="grid" tabIndex={0} aria-label={`${containerId} container grid`} data-canvas-id={containerId} width={width} height={height} onKeyDown={onKeyDown} onMouseLeave={() => setHover(null)}>
      <rect x={0} y={0} width={width} height={height} fill="white" stroke="#E5E7EB" rx={10} />
      {Array.from({ length: rows + 1 }).map((_, r) => (<line key={`r-${r}`} x1={0} y1={r*CELL()} x2={width} y2={r*CELL()} stroke="#E5E7EB" strokeWidth={1} />))}
      {Array.from({ length: cols + 1 }).map((_, c) => (<line key={`c-${c}`} x1={c*CELL()} y1={0} x2={c*CELL()} y2={height} stroke="#E5E7EB" strokeWidth={1} />))}

      {/* reserved area overlay (ring from all sides) */}
      {container.reservePct > 0 && (() => {
        const rx = Math.floor(container.reservePct * cols / 2) * CELL()
        const ry = Math.floor(container.reservePct * rows / 2) * CELL()
        const innerW = width - 2*rx
        const innerH = height - 2*ry
        return (
          <g opacity={0.35} fill="#FEE2E2">
            <rect x={0} y={0} width={width} height={ry} />
            <rect x={0} y={height-ry} width={width} height={ry} />
            <rect x={0} y={ry} width={rx} height={innerH} />
            <rect x={width-rx} y={ry} width={rx} height={innerH} />
          </g>
        )
      })()}

      {hover && (<rect className={hover.ok ? 'ghost' : 'ghost not-allowed'} x={hover.x*CELL()} y={hover.y*CELL()} width={hover.w*CELL()} height={hover.h*CELL()} fill="#A7F3D0" stroke="#10B981" rx={6} />)}

      {packedForThis.map(p => {
        const it = inventory[p.itemId]
        const focused = focusId === p.id
        return (
          <g key={p.id}>
            <rect x={p.x*CELL()} y={p.y*CELL()} width={it.w*CELL()} height={it.h*CELL()} fill={it.color} rx={8} stroke={focused ? '#111827' : '#6B7280'} strokeWidth={focused ? 2 : 1} tabIndex={0} role="button" aria-label={`${it.name} at ${p.x},${p.y}`} onFocus={() => setFocusId(p.id)} />
            {/* remove hotspot */}
            <rect x={(p.x + it.w - 0.6)*CELL()} y={p.y*CELL()+4} width={CELL()*0.5} height={CELL()*0.5} rx={4} fill="#111827" opacity="0.6" cursor="pointer" onClick={() => removePacked(p.id)} />
            <text x={(p.x + it.w - 0.45)*CELL()} y={p.y*CELL()+ (CELL()*0.5)} fill="#fff" style={{fontSize:10, pointerEvents:'none'}}>×</text>
            <text x={p.x*CELL()+8} y={p.y*CELL()+18} fill="white" style={{fontSize:12, fontWeight:600}}>{it.name}</text>
          </g>
        )
      })}
    </svg>
  )
}

function clampToGrid(x:number,y:number,w:number,h:number,cols:number,rows:number,rxc?:number,ryc?:number) {
  const left = rxc ?? 0, top = ryc ?? 0
  const right = cols - (rxc ?? 0), bottom = rows - (ryc ?? 0)
  return { x: Math.max(left, Math.min(right - w, x)), y: Math.max(top, Math.min(bottom - h, y)) }
}
function collides(x:number,y:number,w:number,h:number, others: any[], inventory: any) {
  return others.some(o => {
    const it = inventory[o.itemId]
    const ax1 = x, ay1 = y, ax2 = x+w, ay2 = y+h
    const bx1 = o.x, by1 = o.y, bx2 = o.x+it.w, by2 = o.y+it.h
    return !(ax2<=bx1 || ax1>=bx2 || ay2<=by1 || ay1>=by2)
  })
}
