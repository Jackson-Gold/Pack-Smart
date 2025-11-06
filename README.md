# SmartPack / Pack Smart (React + Vite + TS)

Changes in this build:
- **Add item** button moved to the **bottom of the Inventory list** (opens overlay).
- **Inventory scrolls** independently on the left; middle containers panel scrolls; page itself is non‑scrolling.
- **Undo/Redo** moved to the **bottom‑right** as floating buttons.
- **Remove from packing** by clicking **×** on an item (or Delete key).
- **Editable container name**: double‑click the name in the container toolbar, edit, and confirm (Enter/blur).

Other features kept:
- Dynamic containers; custom constraints (chips) per container; “Leave Room” slider with ring reservation.
- Optimizer (Web Worker); keyboard/drag snapping; help modal; error boundary page.

## Run
```bash
npm install
npm run dev
# /  → Login (click-through)
# /app → Main UI
# /styleguide → Tokens and icons
```
