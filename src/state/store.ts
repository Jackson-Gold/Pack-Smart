import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ItemType = 'laptop'|'shirt'|'book'|'hat'|'other'|string

export type InventoryItem = {
  id: string
  name: string
  type: ItemType  // Can be old type enum or Material Design icon name
  color: string
  w: number
  h: number
  weight: number
  fragile?: boolean
  odd?: boolean
  count: number
}

export type Packed = {
  id: string
  itemId: string
  containerId: string
  x: number
  y: number
  rotated?: boolean
}

export type Container = {
  id: string
  name: string
  cols: number
  rows: number
  weightCap: number
  reservePct: number
  optimizeBy: 'space'|'weight'
  customConstraints: { id: string, label: string, enabled: boolean }[]
}

type Snapshot = {
  inventory: Record<string, InventoryItem>
  containers: Record<string, Container>
  containerOrder: string[]
  packed: Record<string, Packed>
  order: string[]
}

// Preset types so app & store can share the same shape
export type PackingPresetItem = Omit<InventoryItem, 'id'> & { id?: string }

export type PackingPreset = {
  id: string
  name: string
  icon: string
  summary: string
  items: PackingPresetItem[]
}

type State = {
  inventory: Record<string, InventoryItem>
  containers: Record<string, Container>
  containerOrder: string[]
  packed: Record<string, Packed>
  order: string[]
  past: Snapshot[]
  future: Snapshot[]

  record: () => void
  undo: () => void
  redo: () => void

  addPacked: (p: Packed) => void
  movePacked: (id: string, x: number, y: number) => void
  removePacked: (id: string) => void

  setReserve: (containerId: string, pct: number) => void
  addContainer: () => string
  removeContainer: (containerId: string) => void
  renameContainer: (containerId: string, name: string) => void

  addInventoryItem: (item: Omit<InventoryItem,'id'> & { id?: string }) => string
  updateInventoryItem: (id: string, patch: Partial<InventoryItem>) => void
  removeInventoryItem: (id: string) => void

  optimize: (by: 'space'|'weight') => void
  packedCountByItem: (itemId: string) => number

  addCustomConstraint: (containerId: string, label: string) => void
  toggleCustomConstraint: (containerId: string, id: string) => void

  loadPresetInventory: (preset: PackingPreset) => void

  // NEW: add container with user-specified dimensions
  addContainerWithConfig: (config: {
    name?: string
    cols: number
    rows: number
    weightCap: number
    reservePct: number // 0–1 fraction
  }) => string
}

const initialInventory: InventoryItem[] = [
  { id:'laptop-1', name:'Laptop', type:'laptop', color:'#4F46E5', w:6, h:4, weight:4.2, fragile:true, count:1 },
  { id:'shirt-1', name:'Shirt', type:'shirt', color:'#0284C7', w:4, h:4, weight:0.4, count:3 },
  { id:'book-1', name:'Book', type:'book', color:'#10B981', w:2, h:2, weight:0.6, count:4 },
  { id:'hat-1', name:'Hat', type:'hat', color:'#F59E0B', w:4, h:2, weight:0.5, count:1 },
  { id:'toiletry-1', name:'Toiletry Kit', type:'other', color:'#EF4444', w:4, h:2, weight:1, fragile:false, odd:true, count:1 },
]

function snapshot(s: State): Snapshot {
  return {
    inventory: structuredClone(s.inventory),
    containers: structuredClone(s.containers),
    containerOrder: structuredClone(s.containerOrder),
    packed: structuredClone(s.packed),
    order: structuredClone(s.order),
  }
}
function applySnapshot(target: State, snap: Snapshot) {
  target.inventory = structuredClone(snap.inventory)
  target.containers = structuredClone(snap.containers)
  target.containerOrder = structuredClone(snap.containerOrder)
  target.packed = structuredClone(snap.packed)
  target.order = structuredClone(snap.order)
}

export const usePackStore = create<State>()(persist((set, get) => ({
  inventory: Object.fromEntries(initialInventory.map(i => [i.id, i])),
  containers: { 'main-1': { id:'main-1', name:'Container 1', cols:16, rows:12, weightCap:10, reservePct:0.05, optimizeBy:'space', customConstraints:[] } },
  containerOrder: ['main-1'],
  packed: {},
  order: [],
  past: [],
  future: [],

  record: () => { const s = get(); set({ past: [...s.past, snapshot(s as any)], future: [] }) },
  undo: () => {
    const s = get(); if (!s.past.length) return
    const prev = s.past[s.past.length-1]; const cur = snapshot(s as any)
    set(state => { applySnapshot(state as any, prev); return { past: s.past.slice(0,-1), future: [cur, ...s.future] } })
  },
  redo: () => {
    const s = get(); if (!s.future.length) return
    const nxt = s.future[0]; const cur = snapshot(s as any)
    set(state => { applySnapshot(state as any, nxt); return { past: [...s.past, cur], future: s.future.slice(1) } })
  },

  addPacked: (p) => { get().record(); set(state => ({ packed: { ...state.packed, [p.id]: p }, order: [...state.order, p.id] })) },
  movePacked: (id, x, y) => { get().record(); set(state => ({ packed: { ...state.packed, [id]: { ...state.packed[id], x, y } } })) },
  removePacked: (id) => { get().record(); set(state => { const { [id]: removed, ...rest } = state.packed; return { packed: rest, order: state.order.filter(o => o !== id) } }) },

  setReserve: (containerId, pct) => { get().record(); set(state => ({ containers: { ...state.containers, [containerId]: { ...state.containers[containerId], reservePct: pct } } })) },
  addContainer: () => {
    const id = 'main-' + (get().containerOrder.length + 1)
    get().record()
    set(state => ({
      containers: { ...state.containers, [id]: { id, name:`Container ${state.containerOrder.length+1}`, cols:16, rows:12, weightCap:10, reservePct:0.05, optimizeBy:'space', customConstraints:[] } },
      containerOrder: [...state.containerOrder, id]
    }))
    return id
  },
  removeContainer: (containerId) => {
    get().record()
    set(state => {
      const { [containerId]: removed, ...rest } = state.containers
      const packed = Object.fromEntries(Object.entries(state.packed).filter(([_,p]) => p.containerId !== containerId))
      const order = state.order.filter(id => packed[id])
      return { containers: rest, containerOrder: state.containerOrder.filter(id => id !== containerId), packed, order }
    })
  },
  renameContainer: (containerId, name) => { get().record(); set(state => ({ containers: { ...state.containers, [containerId]: { ...state.containers[containerId], name } } })) },

  addInventoryItem: (item) => {
    const id = item.id ?? ('item-' + Math.random().toString(36).slice(2,9))
    get().record()
    set(state => ({ inventory: { ...state.inventory, [id]: { id, ...item } as any } }))
    return id
  },
  updateInventoryItem: (id, patch) => { get().record(); set(state => ({ inventory: { ...state.inventory, [id]: { ...state.inventory[id], ...patch } } })) },
  removeInventoryItem: (id) => {
    get().record()
    set(state => {
      const { [id]: removed, ...rest } = state.inventory
      const packed = Object.fromEntries(Object.entries(state.packed).filter(([_,p]) => p.itemId !== id))
      const order = state.order.filter(oid => packed[oid])
      return { inventory: rest, packed, order }
    })
  },

  packedCountByItem: (itemId) => Object.values(get().packed).filter(p => p.itemId === itemId).length,

  addCustomConstraint: (containerId, label) => {
    get().record()
    set(state => {
      const c = state.containers[containerId]
      return { containers: { ...state.containers, [containerId]: { ...c, customConstraints: [...c.customConstraints, { id:'cc-'+Math.random().toString(36).slice(2,9), label, enabled:true }] } } }
    })
  },
  toggleCustomConstraint: (containerId, id) => {
    get().record()
    set(state => {
      const c = state.containers[containerId]
      return { containers: { ...state.containers, [containerId]: { ...c, customConstraints: c.customConstraints.map(x => x.id===id ? { ...x, enabled: !x.enabled } : x) } } }
    })
  },

  loadPresetInventory: (preset) => {
    get().record()
    set(() => {
      const inventory: Record<string, InventoryItem> = {}

      preset.items.forEach((item, index) => {
        const id =
          item.id ??
          `preset-${preset.id}-${index}-${Math.random().toString(36).slice(2,7)}`
        inventory[id] = {
          id,
          name: item.name,
          type: item.type,
          color: item.color,
          w: item.w,
          h: item.h,
          weight: item.weight,
          fragile: item.fragile,
          odd: item.odd,
          count: item.count,
        }
      })

      // Clear packed items & order; keep containers as-is
      return {
        inventory,
        packed: {},
        order: [],
      }
    })
  },

  // NEW: add container with user-specified dimensions
  addContainerWithConfig: (config) => {
    const baseState = get()
    const id = 'main-' + (baseState.containerOrder.length + 1)
    get().record()
    set(state => {
      const name =
        config.name?.trim() || `Container ${state.containerOrder.length + 1}`
      const cols = Number.isFinite(config.cols) && config.cols > 0 ? config.cols : 16
      const rows = Number.isFinite(config.rows) && config.rows > 0 ? config.rows : 12
      const weightCap =
        Number.isFinite(config.weightCap) && config.weightCap > 0
          ? config.weightCap
          : 10
      const reservePct =
        typeof config.reservePct === 'number' && config.reservePct >= 0
          ? config.reservePct
          : 0.05

      return {
        containers: {
          ...state.containers,
          [id]: {
            id,
            name,
            cols,
            rows,
            weightCap,
            reservePct,
            optimizeBy: 'space',
            customConstraints: [],
          },
        },
        containerOrder: [...state.containerOrder, id],
      }
    })
    return id
  },

  optimize: async (by) => {
    const worker = new Worker(new URL('../workers/optimizer.worker.ts', import.meta.url), { type: 'module' })
    const state = get()
    const payload = { by, items: state.inventory, packed: state.packed, containers: state.containers, order: state.containerOrder }
    worker.postMessage({ type:'optimize', payload })
    worker.onmessage = (e) => {
      const { type, placements, unplacedCount, totalItems } = e.data || {}
      if (type === 'result') {
        set(() => ({ packed: placements, order: Object.keys(placements) }))
        if (typeof unplacedCount === 'number' && typeof totalItems === 'number' && unplacedCount > 0) {
          alert(
            `Some items could not be packed given the current bag sizes and limits.\n\n` +
            `We’ve still packed as much as possible (${totalItems - unplacedCount} of ${totalItems} items).\n` +
            `Try adding another container, removing items, or reducing contraints.`
          )
        }
      }
      worker.terminate()
    }
  },
}), {
  name:'pack-smart',
  version: 3,
  migrate: (state: any) => {
    const s = state?.state || state
    if (!s) return state
    if (!s.containerOrder || !Array.isArray(s.containerOrder)) s.containerOrder = Object.keys(s.containers || {})
    if (s.containers && s.containerOrder) s.containerOrder = s.containerOrder.filter((id: string) => !!s.containers[id])
    if (!s.containers || Object.keys(s.containers).length === 0) {
      s.containers = { 'main-1': { id:'main-1', name:'Container 1', cols:16, rows:12, weightCap:10, reservePct:0.05, optimizeBy:'space', customConstraints:[] } }
      s.containerOrder = ['main-1']
    }
    if (s.containers) {
      for (const k of Object.keys(s.containers)) {
        const c = s.containers[k] || {}
        if (typeof c.cols !== 'number') c.cols = 16
        if (typeof c.rows !== 'number') c.rows = 12
        if (typeof c.weightCap !== 'number') c.weightCap = 10
        if (typeof c.reservePct !== 'number') c.reservePct = 0
        if (!Array.isArray(c.customConstraints)) c.customConstraints = []
        if (!c.id) c.id = k
        if (!c.name) c.name = `Container ${Object.keys(s.containers).indexOf(k)+1}`
        s.containers[k] = c
      }
    }
    return state
  }
}))
