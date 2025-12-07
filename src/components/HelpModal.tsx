import React from 'react'

export default function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [page, setPage] = React.useState<1 | 2>(1)

  // When the modal is opened, always start on page 1
  React.useEffect(() => {
    if (open) setPage(1)
  }, [open])

  if (!open) return null

  return (
    <div
      id="help-modal"
      role="dialog"
      aria-modal="true"
      aria-label="How to use PackSmart"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.3)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 700,
          maxWidth: '92vw',
          maxHeight: '80vh',
          background: 'white',
          borderRadius: 12,
          boxShadow: 'var(--shadow-2)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 14,
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <div>
            <h2 style={{ fontWeight: 600, margin: 0 }}>Welcome to PackSmart</h2>
            <p style={{ margin: 0, marginTop: 4, fontSize: 13, color: '#6B7280' }}>
              {page === 1 ? 'A quick intro before you start packing.' : 'Some quick FAQs before you dive in.'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>Page {page} of 2</span>
            {/* small red X */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close help"
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: 4,
                borderRadius: 999,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DC2626',
              }}
            >
              <span
                className="material-symbols-rounded"
                aria-hidden
                style={{ fontSize: 20, lineHeight: 1 }}
              >
                close
              </span>
            </button>
          </div>
        </div>

        {/* Body (paginated) */}
        <div
          style={{
            padding: 16,
            display: 'grid',
            gap: 16,
            overflowY: 'auto',
          }}
        >
          {page === 1 && (
            <>
              {/* What is PackSmart */}
              <section>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>What is PackSmart?</h3>
                <p style={{ fontSize: 14, color: '#4B5563', margin: 0 }}>
                  PackSmart lets you build a digital version of your bag (a “Packing Space”), drop in
                  your items, and see if everything fits by size and weight before you travel.
                </p>
              </section>

              {/* Quick walkthrough */}
              <section>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Quick walkthrough</h3>
                <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6, fontSize: 14 }}>
                  <li>
                    <strong>Add or edit items</strong> in the <em>Inventory</em> panel on the left
                    (size, weight, and color).
                  </li>
                  <li>
                    <strong>Create Packing Spaces</strong> (bags, suitcases, etc.) with{' '}
                    <em>Add Packing Space</em> and set their dimensions + weight limits.
                  </li>
                  <li>
                    <strong>Drag items</strong> from Inventory onto a Packing Space in the center grid.
                  </li>
                  <li>
                    <strong>Move packed items</strong> with the arrow keys after focusing them (TAB or
                    click). Use <kbd>Shift</kbd> + arrows to move faster.
                  </li>
                  <li>
                    <strong>Remove an item</strong> from a Packing Space by clicking the small ×
                    hotspot on the item.
                  </li>
                  <li>
                    <strong>Use “Pack For Me” / Optimize</strong> in the top bar to auto-arrange items
                    by space or weight while respecting bag limits.
                  </li>
                </ol>
              </section>
            </>
          )}

          {page === 2 && (
            <section>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                FAQs & key features
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6, fontSize: 14 }}>
                <li>
                  <strong>What does “Pack For Me / Optimize” do?</strong> It automatically arranges
                  items into your Packing Spaces in order, stopping each bag when it hits either its
                  space or weight limit.
                </li>
                <li>
                  <strong>What are Packing Spaces?</strong> Each Packing Space is a bag or suitcase
                  with its own width/height (grid cells), margin, and weight capacity. You can add
                  multiple and rename them.
                </li>
                <li>
                  <strong>What is the “Leave room (margin %)” slider?</strong> It reserves a border
                  inside each Packing Space so items stay away from the edges and you don&apos;t
                  overstuff the bag.
                </li>
                <li>
                  <strong>How do I change the grid size?</strong> Use the <em>Scale</em> slider above
                  the Packing Space to zoom the grid in or out without changing real dimensions.
                </li>
                <li>
                  <strong>What if not everything fits?</strong> PackSmart will still pack as much as
                  possible and let you know if some items couldn&apos;t be placed; try adding another
                  Packing Space or removing items.
                </li>
                <li>
                  <strong>How do I undo a mistake?</strong> Use the floating <em>Undo / Redo</em>{' '}
                  buttons in the bottom-right corner of the screen.
                </li>
                <li>
                  <strong>Can I share my layout?</strong> Yes. Use the <em>Share</em> button in the
                  top bar to copy a text summary of your Packing Spaces and items.
                </li>
              </ul>
            </section>
          )}
        </div>

        {/* Footer with paging buttons */}
        <div
          style={{
            padding: 12,
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {page === 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setPage(2)}
              style={{ minWidth: 140, justifyContent: 'center' }}
            >
              Next
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={onClose}
              style={{ minWidth: 160, justifyContent: 'center' }}
            >
              Let&apos;s Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
