export type Message = { type: 'optimize', payload: any }

self.onmessage = (e: MessageEvent<Message>) => {
  if (e.data?.type !== 'optimize') return
  const { by, items, containers, order } = e.data.payload

  const inv = Object.values(items)

  // Respect container order: fill first container, then second, etc.
  const containersArr = Array.isArray(order) && order.length
    ? order.map((id: string) => containers[id]).filter(Boolean)
    : Object.values(containers)

  const expanded: any[] = []
  for (const it of inv) {
    for (let i = 0; i < it.count; i++) {
      expanded.push({ ...it, instanceId: `${it.id}#${i + 1}` })
    }
  }

  // Sort items by chosen optimization criterion: weight or area
  expanded.sort((a, b) => {
    const aKey = by === 'weight' ? a.weight : (a.w * a.h)
    const bKey = by === 'weight' ? b.weight : (b.w * b.h)
    return bKey - aKey
  })

  type Grid = {
    cols: number
    rows: number
    reservePct: number
    id: string
    weightCap: number
    usedWeight: number
    cells: boolean[][]
    placements: any[]
    rxc: number
    ryc: number
  }

  const grids: Grid[] = containersArr.map(c => ({
    cols: c.cols,
    rows: c.rows,
    reservePct: c.reservePct,
    id: c.id,
    weightCap: typeof c.weightCap === 'number' ? c.weightCap : Infinity,
    usedWeight: 0,
    cells: Array.from({ length: c.rows }, () =>
      Array.from({ length: c.cols }, () => false)
    ),
    placements: [],
    rxc: Math.floor(c.cols * c.reservePct / 2),
    ryc: Math.floor(c.rows * c.reservePct / 2),
  }))

  function canPlace(g: Grid, x: number, y: number, w: number, h: number) {
    // Respect reserved "ring" margin
    if (x < g.rxc || y < g.ryc || x + w > g.cols - g.rxc || y + h > g.rows - g.ryc) {
      return false
    }
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        if (g.cells[yy][xx]) return false
      }
    }
    return true
  }

  function place(g: Grid, x: number, y: number, w: number, h: number) {
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        g.cells[yy][xx] = true
      }
    }
  }

  const unplaced: any[] = []

  // Try to place each item, container by container, in order
  for (const it of expanded) {
    let placed = false
    const itemWeight = typeof it.weight === 'number' ? it.weight : 0

    // Always iterate grids in the same order so we "fill" the first container, then next, etc.
    for (const g of grids) {
      // Weight capacity check: skip this bag if adding this item would exceed its max
      if (g.usedWeight + itemWeight > g.weightCap) {
        continue
      }

      for (let y = 0; y <= g.rows - it.h; y++) {
        for (let x = 0; x <= g.cols - it.w; x++) {
          // Avoid odd items hugging the reserve boundaries
          if (it.odd) {
            if (
              x === g.rxc ||
              y === g.ryc ||
              x + it.w === g.cols - g.rxc ||
              y + it.h === g.rows - g.ryc
            ) {
              continue
            }
          }
          // Fragile items prefer the top ~30% of the bag
          if (it.fragile && y > Math.floor(g.rows * 0.3)) {
            break
          }

          if (canPlace(g, x, y, it.w, it.h)) {
            place(g, x, y, it.w, it.h)
            g.usedWeight += itemWeight
            g.placements.push({
              id: cryptoRandomId(),
              itemId: it.id,
              containerId: g.id,
              x,
              y,
            })
            placed = true
            break
          }
        }
        if (placed) break
      }
      if (placed) break
    }

    if (!placed) {
      unplaced.push(it)
    }
  }

  const finalPlacements: Record<string, any> = {}
  for (const g of grids) {
    for (const p of g.placements) {
      finalPlacements[p.id] = p
    }
  }

  ;(self as any).postMessage({
    type: 'result',
    placements: finalPlacements,
    // NEW: report packing completeness so UI can show a message
    unplacedCount: unplaced.length,
    totalItems: expanded.length,
  })
}

function cryptoRandomId() {
  try {
    const arr = new Uint32Array(2)
    crypto.getRandomValues(arr)
    return 'p-' + Array.from(arr).map(n => n.toString(36)).join('').slice(0, 10)
  } catch {
    return 'p-' + Math.random().toString(36).slice(2, 12)
  }
}
