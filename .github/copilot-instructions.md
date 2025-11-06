# MapLibre Terrain Visualization - AI Coding Instructions

## Project Overview
This is a React + TypeScript application that visualizes terrain data using MapLibre GL JS with multiple DEM (Digital Elevation Model) sources and custom protocol handlers.

## Architecture Patterns

### Terrain Data Pipeline
- **Custom Protocol Handlers**: Located in `src/hooks/`, these register MapLibre protocols for specialized data sources
  - `useGsidemProtocol`: Converts Japanese GSI DEM PNG tiles to terrain RGB format using `gsidem2terrainrgb()`
  - `usePmtilesProtocol`: Handles PMTiles protocol for local terrain files (`public/dem/*.pmtiles`)
- **MapLibre Style Configuration**: `public/styles/style.json` defines multiple terrain sources with different encodings:
  - `gsi-dem`: Uses custom `gsidem://` protocol for Japanese elevation data
  - `local-terrain`: Uses `pmtiles://` protocol for local PMTiles files
  - `aws-terrain`: Standard terrarium encoding from AWS

### Component Structure
- **MapComponent**: Main map container that sets up MapLibre instance and terrain effects
- **ExaggerationSlider**: UI control that dynamically adjusts both terrain exaggeration and hillshade properties
- Both terrain (`setTerrain()`) and hillshade paint properties are synchronized with exaggeration values

## Development Workflows

### Key Commands
```bash
npm run dev          # Vite dev server
npm run build        # TypeScript compilation + Vite build
npm run deploy       # Build and deploy to GitHub Pages
```

### Map Style Development
- Primary style file: `public/styles/style.json`
- Terrain sources support different encodings (terrarium, custom GSI format)
- Color relief layers use MapLibre's `color-relief` type with elevation-based interpolation
- Use `#00000000` (transparent) for elevation 0 to show underlying base map

## Project-Specific Conventions

### Protocol Handler Registration
- Custom protocols must be registered before map initialization
- Use singleton pattern to prevent double-registration (`pmtilesProtocolRegistered` flag)
- Clean up protocols in useEffect return function

### Terrain Exaggeration Patterns
```typescript
// Synchronized exaggeration for terrain and hillshade
map.setTerrain({ source: "local-terrain", exaggeration });
map.setPaintProperty("hillshade-local-terrain", "hillshade-exaggeration", exaggeration / 3);
```

### DEM Color Conversion
- GSI DEM tiles require conversion from proprietary format to terrain RGB
- Special case handling: `r=128, g=0, b=0` represents invalid elevation (set to 0)
- Conversion adds 100000 offset and multiplies by 10 for terrain RGB encoding

## File Organization
- `/src/hooks/`: MapLibre protocol registrations
- `/src/utils/`: DEM format conversion utilities
- `/src/components/`: React UI components for map and controls
- `/public/styles/`: MapLibre style definitions
- `/public/dem/`: Local terrain data files (PMTiles format)

## Integration Points
- **MapLibre GL JS**: Core mapping library with custom protocol support
- **PMTiles**: Efficient tile storage format for local terrain data
- **GitHub Pages**: Deployment target (note `base: "/maplibre-terrain/"` in vite.config.ts)
- **Japanese GSI**: External elevation data source requiring format conversion

## Critical Dependencies
- Always call protocol registration hooks before map initialization
- Terrain sources must match layer source references in style.json
- PMTiles files should be placed in `public/dem/` directory
- Use hash-based navigation (`hash: true`) for map state persistence