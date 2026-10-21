export interface StageDetail {
  id: number;
  slug: string;
  filename: string;
  title: string;
  category: string;
  tagline: string;
  dimensions: {
    imperial: string;
    metric: string;
  };
  area: {
    sqFt: number;
    sqM: number;
    label: string;
  };
  clearHeight?: string;
  keySpecs: { label: string; value: string }[];
  architecturalNotes: string;
  componentsList: string[];
}

export interface DesignOption {
  id: string;
  code: string;
  title: string;
  status: "ready" | "in-progress" | "concept";
  statusText: string;
  tagline: string;
  summary: string;
  circulation: string;
  facadeAesthetic: string;
  rentalPotential: string;
  solarOrientation: string;
  advantages: string[];
  considerations: string[];
}

export const PROJECT_INFO = {
  familyName: "Vunguturi",
  title: "Vunguturi Residence",
  subtitle: "G+2 residence, design package",
  location: "Plot No. 15, Katheruvu, Rajamahendravaram Rural, Andhra Pradesh",
  permitNo: "IPLP2020/RUDA/KATH/000685",
  orientation: "West facing, on a 6.60 m (21'-8\") road",
  floors: "Ground + First + Second floor, with terrace",
  agency: {
    name: "OneMarK",
    legalName: "OneMarK Digital Architecture & Engineering",
    url: "https://onemark.co.in",
    logo: "/OM-Sintry-White.png",
    credit: "Website and 3D models designed by",
  },
  metrics: {
    grossSiteAreaSqFt: 1349.9,
    grossSiteAreaSqM: 125.41,
    grossPlotDimensions: "29.99 ft × 45.01 ft (9.14 m × 13.72 m)",
    roadWideningStrip: "3.94 ft (1.20 m) across the full 29.99 ft frontage",
    roadWideningAreaSqFt: 118.0,
    roadWideningAreaSqM: 10.96,
    netSiteAreaSqFt: 1231.9,
    netSiteAreaSqM: 114.45,
    netPlotDimensions: "29.99 ft × 41.08 ft (9.14 m × 12.52 m)",
    plinthAreaPerFloorSqFt: 885.7,
    plinthAreaPerFloorSqM: 82.28,
    plinthDimensions: "25.07 ft × 35.33 ft (7.64 m × 10.77 m)",
    totalBuiltUpAreaSqFt: 2657.0,
    totalBuiltUpAreaSqM: 246.84,
    openSiteAreaSqFt: 346.3,
    openSiteAreaSqM: 32.17,
  },
  setbacks: [
    { side: "Front (west)", feet: "3.28 ft", meters: "1.00 m", note: "Between the road-widening line and the building" },
    { side: "Rear (east)", feet: "2.46 ft", meters: "0.75 m", note: "Utility and plumbing gap" },
    { side: "North", feet: "2.46 ft", meters: "0.75 m", note: "Facing Plot No. 14" },
    { side: "South", feet: "2.46 ft", meters: "0.75 m", note: "Facing Plot No. 16" },
  ],
  heights: [
    { element: "Foundation depth", value: "1.50 m (4'11\") below ground" },
    { element: "Plinth", value: "0.75 m (2'6\") above road level" },
    { element: "Ground floor", value: "3.00 m (9'10\") floor to floor" },
    { element: "First floor", value: "3.00 m (9'10\") floor to floor" },
    { element: "Second floor", value: "3.00 m (9'10\") floor to floor" },
    { element: "Terrace parapet", value: "0.75 m, top at 10.50 m (34'5\")" },
  ],
};

export const ALL_STAGES_DATA: StageDetail[] = [
  {
    id: 1,
    slug: "01_site",
    filename: "01_site.glb",
    title: "Site and survey",
    category: "Site",
    tagline: "Plot boundary, neighbours and the road-widening strip",
    dimensions: {
      imperial: "29.99 ft × 45.01 ft gross, 29.99 ft × 41.08 ft net",
      metric: "9.14 m × 13.72 m gross, 9.14 m × 12.52 m net",
    },
    area: { sqFt: 1349.9, sqM: 125.41, label: "Gross plot area" },
    keySpecs: [
      { label: "Front road", value: "6.60 m (21.65 ft), marked 22'-0\" on the drawing" },
      { label: "Road widening", value: "1.20 m (3.94 ft) along the full frontage" },
      { label: "Net site", value: "1,231.9 sq.ft (114.45 m²)" },
      { label: "Neighbours", value: "North: Plot 14. South: Plot 16. Rear: Plot 26" },
    ],
    architecturalNotes: "The surveyed plot, with the road-widening strip given up to the road and the 25.07 ft × 35.33 ft building footprint set back from every boundary.",
    componentsList: ["Terrain", "Neighbouring plots", "Road-widening strip", "Plot ground", "Boundary lines", "Road markings", "Dimension lines"],
  },
  {
    id: 2,
    slug: "02_site_compound_wall",
    filename: "02_site_compound_wall.glb",
    title: "Compound wall and gate",
    category: "Perimeter",
    tagline: "Boundary wall, piers and a 3.00 m vehicle gate",
    dimensions: {
      imperial: "142.14 ft of wall, 5.5 ft high",
      metric: "43.32 m of wall, 1.68 m high",
    },
    area: { sqFt: 1231.9, sqM: 114.45, label: "Enclosed area" },
    keySpecs: [
      { label: "Gate", value: "3.00 m (9.84 ft) clear opening" },
      { label: "Front wall", value: "Built behind the road-widening strip" },
      { label: "Coping", value: "RCC coping, lamps on the gate piers" },
      { label: "Gate type", value: "Steel sliding gate" },
    ],
    architecturalNotes: "The compound wall on all four sides, with piers, coping, and a sliding gate lined up with the parking bay.",
    componentsList: ["Front wall and gate opening", "Gate leaf", "Gate lamps", "Piers", "North wall", "South wall", "Rear wall", "Coping"],
  },
  {
    id: 3,
    slug: "03_site_wall_pillars",
    filename: "03_site_wall_pillars.glb",
    title: "Foundations and columns",
    category: "Substructure",
    tagline: "Isolated footings and RCC columns",
    dimensions: {
      imperial: "Excavation 4.92 ft deep, plinth 2.46 ft above road",
      metric: "Excavation 1.50 m deep, plinth 0.75 m above road",
    },
    area: { sqFt: 885.7, sqM: 82.28, label: "Building footprint" },
    keySpecs: [
      { label: "Foundation depth", value: "1.50 m (4'11\") below ground" },
      { label: "Plinth", value: "0.75 m (2'6\") above road level" },
      { label: "Footings", value: "Reinforced concrete, isolated" },
      { label: "Columns", value: "RCC, full height to the terrace" },
    ],
    architecturalNotes: "Pits are dug, sand-filled and compacted, the footings are cast, and the columns are taken up for all three floors.",
    componentsList: ["RCC footings", "Plinth", "RCC columns", "Excavated soil", "Excavation pits"],
  },
  {
    id: 4,
    slug: "04_site_wall_pillars_beams",
    filename: "04_site_wall_pillars_beams.glb",
    title: "Beams and frame",
    category: "Frame",
    tagline: "Plinth, floor and roof beams tying the columns together",
    dimensions: {
      imperial: "25.07 ft × 35.33 ft grid, spans up to 13.29 ft",
      metric: "7.64 m × 10.77 m grid, spans up to 4.05 m",
    },
    area: { sqFt: 885.7, sqM: 82.28, label: "Frame footprint per floor" },
    keySpecs: [
      { label: "Plinth beams", value: "At 0.75 m above road level" },
      { label: "First floor beams", value: "Perimeter and cross beams" },
      { label: "Second floor beams", value: "Perimeter and cross beams" },
      { label: "Roof beams", value: "Under the terrace slab" },
    ],
    architecturalNotes: "Beams at every level join the columns into one concrete frame, which carries the floors and resists wind and settlement.",
    componentsList: ["Plinth beams", "First floor beams", "Second floor beams", "Roof beams", "RCC columns"],
  },
  {
    id: 5,
    slug: "05_ground_floor",
    filename: "05_ground_floor.glb",
    title: "Ground floor",
    category: "Floor plan",
    tagline: "Tandem parking for two cars and a 1BHK",
    dimensions: {
      imperial: "Building 25.07 ft × 35.33 ft, parking 13.29 ft × 33.82 ft",
      metric: "Building 7.64 m × 10.77 m, parking 4.05 m × 10.31 m",
    },
    area: { sqFt: 885.7, sqM: 82.28, label: "Ground floor plinth area" },
    clearHeight: "3.00 m (9'10\") floor to floor",
    keySpecs: [
      { label: "Parking", value: "4.05 m × 10.31 m, two cars one behind the other" },
      { label: "Hall", value: "3.02 m × 4.36 m (9.91 ft × 14.30 ft)" },
      { label: "Bedroom", value: "3.02 m × 3.30 m (9.91 ft × 10.83 ft)" },
      { label: "Kitchen and bath", value: "Kitchen 3.02 × 2.43 m, bath 1.27 × 1.23 m" },
    ],
    architecturalNotes: "Covered parking entered through the 3.00 m gate, with a separate 1BHK beside it for elders, guests or a caretaker.",
    componentsList: ["Parking floor", "Hall", "Bedroom", "Kitchen", "Bath", "Driveway entry", "Entrance steps", "Doors"],
  },
  {
    id: 6,
    slug: "06_first_floor",
    filename: "06_first_floor.glb",
    title: "First floor",
    category: "Floor plan",
    tagline: "2BHK with hall, dining and puja",
    dimensions: {
      imperial: "Hall 13.29 ft × 25.49 ft, dining 13.29 ft × 7.97 ft",
      metric: "Hall 4.05 m × 7.77 m, dining 4.05 m × 2.43 m",
    },
    area: { sqFt: 885.7, sqM: 82.28, label: "First floor plinth area" },
    clearHeight: "3.00 m (9'10\") floor to floor",
    keySpecs: [
      { label: "Hall", value: "4.05 m × 7.77 m (338.8 sq.ft)" },
      { label: "Dining", value: "4.05 m × 2.43 m" },
      { label: "Puja", value: "North-east corner" },
      { label: "Bedrooms", value: "Master 3.02 × 3.24 m, second 3.02 × 3.30 m" },
    ],
    architecturalNotes: "The main family floor. Kitchen in the south-east corner, puja in the north-east, and an attached bath for each bedroom.",
    componentsList: ["Hall", "Dining", "Puja", "Kitchen", "Master bedroom", "Second bedroom", "Baths", "Floor slab"],
  },
  {
    id: 7,
    slug: "07_second_floor",
    filename: "07_second_floor.glb",
    title: "Second floor",
    category: "Floor plan",
    tagline: "A second 2BHK, same layout as the first floor",
    dimensions: {
      imperial: "Plinth 25.07 ft × 35.33 ft, 9.84 ft floor to floor",
      metric: "Plinth 7.64 m × 10.77 m, 3.00 m floor to floor",
    },
    area: { sqFt: 885.7, sqM: 82.28, label: "Second floor plinth area" },
    clearHeight: "3.00 m (9'10\") floor to floor",
    keySpecs: [
      { label: "Unit", value: "Self-contained 2BHK" },
      { label: "Hall", value: "4.05 m × 7.77 m" },
      { label: "Bedrooms", value: "Two, each with its own bath" },
      { label: "Access", value: "Own door off the front stair landing" },
    ],
    architecturalNotes: "Repeats the first floor plan as an independent flat, for family or for rent.",
    componentsList: ["Hall", "Dining", "Puja", "Kitchen", "Master bedroom", "Second bedroom", "Baths", "Floor slab"],
  },
  {
    id: 8,
    slug: "08_floors_pillars_beams",
    filename: "08_floors_pillars_beams.glb",
    title: "All three floors",
    category: "Assembly",
    tagline: "The three floors on the frame, before the stair",
    dimensions: {
      imperial: "25.07 ft × 35.33 ft footprint, 31.99 ft to the terrace slab",
      metric: "7.64 m × 10.77 m footprint, 9.75 m to the terrace slab",
    },
    area: { sqFt: 2657.0, sqM: 246.84, label: "Total built-up area" },
    keySpecs: [
      { label: "Built-up area", value: "2,657.0 sq.ft (246.84 m²)" },
      { label: "Floors", value: "Ground, first and second" },
      { label: "Structure", value: "Columns run straight down to the footings" },
      { label: "Setbacks", value: "Front 1.00 m, rear and sides 0.75 m" },
    ],
    architecturalNotes: "Floor slabs, brick walls, and door and window openings on all three floors, shown before the stair is added.",
    componentsList: ["Foundation", "Columns", "Beams", "Ground floor", "First floor", "Second floor"],
  },
  {
    id: 9,
    slug: "09_plus_stairs",
    filename: "09_plus_stairs.glb",
    title: "Front stair",
    category: "Circulation",
    tagline: "Outside stair with landings at each floor",
    dimensions: {
      imperial: "Stair, landing and walkway sit outside the 25.07 ft × 35.33 ft building line",
      metric: "Stair, landing and walkway sit in front of the 7.64 m × 10.77 m building line",
    },
    area: { sqFt: 2657.0, sqM: 246.84, label: "Built-up area (stair outside the plinth)" },
    keySpecs: [
      { label: "Type", value: "Dog-legged stair, open to the outside" },
      { label: "Landings", value: "At the first and second floors" },
      { label: "Entry", value: "Separate door for each floor" },
      { label: "Edges", value: "Masonry parapet and handrails" },
    ],
    architecturalNotes: "The stair is at the front, so people can reach the upper floors without passing through the ground floor home or the parking.",
    componentsList: ["Stair", "Stair parapet", "Landing slabs", "Handrails", "Landing parapet"],
  },
  {
    id: 10,
    slug: "10_complete",
    filename: "10_complete.glb",
    title: "Finished house",
    category: "Complete",
    tagline: "Terrace, tanks, solar frames and the front elevation",
    dimensions: {
      imperial: "34.45 ft to the parapet top, 25.07 ft wide, 35.33 ft deep",
      metric: "10.50 m to the parapet top, 7.64 m wide, 10.77 m deep",
    },
    area: { sqFt: 2657.0, sqM: 246.84, label: "Total built-up area" },
    keySpecs: [
      { label: "Terrace", value: "Water tanks, solar panel frames, downpipes" },
      { label: "Stair headroom", value: "Covered stair top with a terrace door, above the parapet" },
      { label: "Front", value: "Fascia bands and wall cladding" },
      { label: "Compound", value: "Gate lamps, nameplate, planting" },
    ],
    architecturalNotes: "The house as it will look when finished, with terrace services, gate lamps, nameplate and planting.",
    componentsList: ["Roof slab", "Stair headroom cover", "Roof services", "Solar frames", "Overhead tanks", "Downpipes", "Gate lamps", "Nameplate", "Front elevation", "Planting"],
  },
  {
    id: 11,
    slug: "11_underground_services",
    filename: "11_underground_services.glb",
    title: "Underground services",
    category: "Services",
    tagline: "Sump, borewell, drains and soak pits",
    dimensions: {
      imperial: "Compound 29.99 ft × 41.08 ft, sump 8.0 ft deep",
      metric: "Compound 9.14 m × 12.52 m, sump 2.44 m deep",
    },
    area: { sqFt: 1231.9, sqM: 114.45, label: "Site area served" },
    keySpecs: [
      { label: "Sump", value: "Underground RCC drinking water tank" },
      { label: "Borewell", value: "Connection point and casing" },
      { label: "Drainage", value: "Manholes, sewer lines and stormwater pits" },
      { label: "Recharge", value: "Gravel trench around the plot for rainwater" },
    ],
    architecturalNotes: "Shown last so it is easy to see. On site, this work is done along with the foundations and plinth.",
    componentsList: ["Sump and pits", "Pipes and borewell", "Manholes", "Gravel fill"],
  },
];

export const ELEVATION_OPTIONS: DesignOption[] = [
  {
    id: "option-front-stairs",
    code: "01",
    title: "Front stair",
    status: "ready",
    statusText: "Approved layout, modelled in 3D",
    tagline: "Separate entry to every floor",
    summary: "The approved layout. An outside stair at the front gives each floor its own entrance. All 11 stages below show this option.",
    circulation: "Outside dog-legged stair at the front, with a landing at each floor.",
    facadeAesthetic: "The stair and its railings are part of the front view.",
    rentalPotential: "Each floor works as a separate home, for family or tenants.",
    solarOrientation: "The stair's masonry takes some of the afternoon sun before it reaches the rooms.",
    advantages: [
      "Every floor has its own entrance",
      "Parking stays clear of the stair",
      "No stair inside the rooms",
      "Matches the RUDA approval (permit 000685)",
    ],
    considerations: [
      "The stair is open to sun and rain unless it is enclosed",
      "The landings and railings show on the front",
    ],
  },
  {
    id: "option-rear-stairs",
    code: "02",
    title: "Rear stair",
    status: "in-progress",
    statusText: "Design in progress",
    tagline: "A cleaner front, stair at the back",
    summary: "Moves the stair to the east side at the back, so the front can have wider balconies and windows.",
    circulation: "Stair at the rear, reached through the parking and the side setback.",
    facadeAesthetic: "Plain horizontal front with continuous balconies and louvres.",
    rentalPotential: "Upper floors still get separate access, along the 0.75 m side setback, which is tighter once the compound wall is built.",
    solarOrientation: "The stair is on the morning-sun side. The west windows are shaded by recessed balconies.",
    advantages: [
      "Uncluttered front elevation",
      "Stair is out of the street dust and afternoon sun",
      "Stair can share the rear plumbing zone",
    ],
    considerations: [
      "Visitors walk past the parked cars to reach the stair",
      "The rear bedroom and utility need small changes",
    ],
  },
  {
    id: "option-duplex",
    code: "03",
    title: "Duplex",
    status: "in-progress",
    statusText: "Design in progress",
    tagline: "One family home over the top two floors",
    summary: "Parking and a guest room on the ground floor. The first and second floors join into one home with an inside stair.",
    circulation: "Inside stair in the living and dining area.",
    facadeAesthetic: "Tall window across the double-height living room.",
    rentalPotential: "Not for renting. Built as one family home.",
    solarOrientation: "Deep overhangs and side windows give soft light in the double-height room.",
    advantages: [
      "About 6 m high ceiling over the living room",
      "The whole house is private to one family",
      "The upper floor can hold the master suite and a family room",
    ],
    considerations: [
      "No separate units to rent",
      "Less floor area on the second floor because of the open double-height space",
    ],
  },
];

export const SCHEDULE_OF_OPENINGS = [
  { code: "D", name: "Main and room doors", sizeM: "1.00 m × 2.00 m", sizeFt: "3'3\" × 6'7\"", qty: 10, description: "Entrance, hall, kitchen and bedroom doors" },
  { code: "D1", name: "Bath and rear doors", sizeM: "0.75 m × 2.00 m", sizeFt: "2'6\" × 6'7\"", qty: 8, description: "Flush doors with waterproof laminate" },
  { code: "W", name: "Large windows", sizeM: "1.50 m × 1.30 m", sizeFt: "4'11\" × 4'3\"", qty: 8, description: "Sliding windows with grills" },
  { code: "W1", name: "Windows", sizeM: "1.00 m × 1.30 m", sizeFt: "3'3\" × 4'3\"", qty: 20, description: "Bedrooms, kitchens and halls" },
  { code: "V", name: "Large ventilators", sizeM: "0.90 m × 0.45 m", sizeFt: "2'11\" × 1'6\"", qty: 0, description: "In the drawing legend, not placed on any floor plan" },
  { code: "V1", name: "Ventilators", sizeM: "0.60 m × 0.45 m", sizeFt: "2'0\" × 1'6\"", qty: 5, description: "High-level ventilators for baths" },
  { code: "G", name: "Car gate", sizeM: "3.00 m × 2.10 m", sizeFt: "9'10\" × 6'11\"", qty: 1, description: "Steel sliding gate" },
];
