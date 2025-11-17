# PackSmart

**PackSmart** is an innovative packing optimization tool that transforms the tedious task of organizing luggage into an intuitive, visual experience. Unlike traditional packing methods that rely on guesswork and trial-and-error, PackSmart provides a smart grid-based interface that helps you visualize exactly how your items fit before you even start packing.

**Live Hosting**
PackSmart is currently hosted here: https://jackson-gold.github.io/Pack-Smart/

## Why PackSmart is Useful and Innovative

Packing efficiently is a complex optimization problem that most people solve through trial and error. PackSmart addresses this by:

- **Visual Planning**: See exactly how items fit in your containers before you pack, eliminating the frustration of unpacking and repacking
- **Smart Optimization**: Automatically calculate optimal arrangements based on space or weight constraints using advanced algorithms
- **Constraint Management**: Set custom rules like weight limits, reserve margins, and item relationships to match real-world packing scenarios
- **Real-time Feedback**: Track weight and volume usage across all containers with live meters, preventing overpacking
- **Drag-and-Drop Interface**: Intuitive visual manipulation makes planning as easy as moving items on a screen
- **Multi-Container Support**: Manage multiple bags, boxes, or containers simultaneously with independent constraints

PackSmart turns packing from a stressful chore into a strategic, efficient process—whether you're preparing for travel, moving, or organizing storage.

## Features

### Inventory Management
- **Add Items**: Create items with customizable properties including:
  - Name and icon (80+ Material Design Icons to choose from)
  - Dimensions (width × height in grid cells)
  - Weight (in kg)
  - Color coding for visual organization
  - Count (multiple instances of the same item)
  - Flags for fragile and odd-shaped items
- **Icon Picker**: Searchable selection menu with Material Design Icons for visual item identification
- **Remove Items**: Delete items from inventory with a simple click
- **Fixed-Size Item Cards**: Consistent, scrollable inventory list that maintains layout stability

### Container Management
- **Multiple Containers**: Create and manage multiple containers (bags, boxes, etc.)
- **Container Properties**:
  - Customizable name (double-click to rename)
  - Grid dimensions (columns × rows)
  - Weight capacity limits
  - Reserve margin percentage (keeps space free from all sides)
- **Add/Remove Containers**: Dynamically add or remove containers as needed
- **Visual Grid**: Interactive SVG-based grid showing exact item placement

### Packing Interface
- **Drag and Drop**: Intuitively drag items from inventory into containers
- **Grid Snapping**: Items automatically snap to grid positions for precise placement
- **Keyboard Navigation**: 
  - Arrow keys to move packed items
  - Delete/Backspace to remove items from containers
- **Visual Feedback**: 
  - Hover preview shows valid placement areas
  - Color-coded items for easy identification
  - Collision detection prevents overlapping items
- **Item Removal**: Click × on any packed item to return it to inventory

### Optimization
- **Space Optimization**: Automatically arrange items to maximize space efficiency
- **Weight Optimization**: Optimize for weight distribution across containers
- **Web Worker Processing**: Background optimization using Web Workers for smooth performance
- **What-If Analysis**: Test different optimization strategies without affecting current layout

### Constraints & Rules
- **Reserve Margin**: Adjustable slider (0-50%) to keep space free from container edges
- **Weight Capacity**: Set maximum weight per container with real-time tracking
- **Custom Constraints**: Add text-based constraints per container (e.g., "Keep toiletries separate")
- **Constraint Toggles**: Enable/disable constraints as needed
- **Weight Warnings**: Visual indicators when containers exceed weight limits

### User Experience
- **Undo/Redo**: Full history support with floating action buttons for easy access
- **Persistent State**: All data automatically saved to localStorage
- **Real-time Meters**: 
  - Weight meter showing total weight across all containers
  - Volume meter showing grid cells used vs. available
- **Help Modal**: Built-in guide explaining key features and interactions
- **Responsive Design**: Clean, modern UI that adapts to different screen sizes
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML

### Advanced Features
- **Item Properties**:
  - Fragile flag for delicate items
  - Odd shape flag for non-rectangular items
  - Color customization for visual organization
- **Container Scaling**: Adjustable zoom level for detailed or overview views
- **Multi-Item Support**: Track multiple instances of the same item with count tracking
- **Packed Count Tracking**: See how many of each item are packed vs. remaining

## Getting Started

### Local Development

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Routes

- `/` → Login page (click-through authentication)
- `/app` → Main packing interface
- `/styleguide` → Design tokens and icon reference

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

### GitHub Pages

PackSmart is configured for automatic deployment to GitHub Pages. When you push to the `main` or `master` branch, GitHub Actions will:

1. Build the application
2. Deploy it to the `gh-pages` branch
3. Make it available at `https://[username].github.io/Pack-Smart/`

**Setup Instructions:**

1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. Push to `main` or `master` branch - the workflow will automatically deploy

The deployment workflow is located at `.github/workflows/deploy.yml` and will run on every push to the main branch.

**Note:** If your repository name is different from "Pack-Smart", update the `BASE_PATH` in `vite.config.ts` or set it as an environment variable in the GitHub Actions workflow.

### Usage

1. **Add Items**: Click "Add item" at the bottom of the inventory panel to create new items
2. **Add Containers**: Click "Add container" at the bottom of the containers section
3. **Pack Items**: Drag items from inventory into containers, or use the optimizer for automatic arrangement
4. **Adjust Constraints**: Use the constraints panel to set reserve margins and weight limits
5. **Optimize**: Click "Optimize" in the toolbar to automatically arrange items for space or weight efficiency

## Technology Stack

- **React** + **TypeScript** for type-safe, component-based UI
- **Vite** for fast development and optimized builds
- **Zustand** for state management with persistence
- **Material Design Icons** for visual item representation
- **Web Workers** for background optimization processing


## Artificial Intelligence Accreditation 
Developed collaboratively with OpenAI GPT-5, Claude Sonet 4.5, and Cursor Composer 1 to implement and refine the Pack Smart front-end experience, including layout generation, code synthesis, interface styling, and iterative debugging.

## Project Structure

```
src/
├── components/        # React components
│   ├── AddItemModal.tsx      # Item creation with icon picker
│   ├── AddConstraintModal.tsx # Constraint creation
│   ├── ConstraintsPanel.tsx   # Container constraints UI
│   ├── HelpModal.tsx          # Help documentation
│   ├── Inventory.tsx          # Inventory list with drag support
│   ├── Meters.tsx             # Weight/volume meters
│   └── SvgCanvas.tsx          # Grid-based container visualization
├── state/
│   └── store.ts               # Zustand store with persistence
├── workers/
│   └── optimizer.worker.ts    # Background optimization worker
└── styles/                    # Global styles and design tokens
```

---

**PackSmart** - Plan smarter, pack better.
