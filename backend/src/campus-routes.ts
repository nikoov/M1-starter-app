// UBC Campus Running Routes
export const UBC_RUNNING_ROUTES = [
  {
    name: "Rose Garden Loop",
    description: "A scenic 2km loop around the beautiful Rose Garden with views of the mountains and ocean.",
    distance: 2.0,
    difficulty: "Easy" as const,
    landmarks: ["Rose Garden", "Nitobe Memorial Garden", "Asian Centre"],
    coordinates: {
      start: { lat: 49.2606, lng: -123.2460 },
      waypoints: [
        { lat: 49.2615, lng: -123.2450, name: "Nitobe Memorial Garden" },
        { lat: 49.2620, lng: -123.2440, name: "Asian Centre" },
        { lat: 49.2610, lng: -123.2430, name: "Rose Garden" },
      ],
      end: { lat: 49.2606, lng: -123.2460 },
    },
    estimatedTime: 15,
    weatherDependent: false,
  },
  {
    name: "Main Mall Circuit",
    description: "A 1.5km run through the heart of campus, passing iconic UBC buildings and landmarks.",
    distance: 1.5,
    difficulty: "Easy" as const,
    landmarks: ["Irving K. Barber Learning Centre", "Student Union Building", "Koerner Library"],
    coordinates: {
      start: { lat: 49.2686, lng: -123.2550 },
      waypoints: [
        { lat: 49.2680, lng: -123.2540, name: "Irving K. Barber Learning Centre" },
        { lat: 49.2675, lng: -123.2530, name: "Student Union Building" },
        { lat: 49.2670, lng: -123.2520, name: "Koerner Library" },
      ],
      end: { lat: 49.2686, lng: -123.2550 },
    },
    estimatedTime: 12,
    weatherDependent: false,
  },
  {
    name: "Pacific Spirit Park Trail",
    description: "A challenging 5km forest trail through Pacific Spirit Regional Park.",
    distance: 5.0,
    difficulty: "Hard" as const,
    landmarks: ["Forest Trail Entrance", "Creek Crossing", "Viewpoint"],
    coordinates: {
      start: { lat: 49.2700, lng: -123.2500 },
      waypoints: [
        { lat: 49.2720, lng: -123.2480, name: "Forest Trail Entrance" },
        { lat: 49.2740, lng: -123.2460, name: "Creek Crossing" },
        { lat: 49.2760, lng: -123.2440, name: "Viewpoint" },
      ],
      end: { lat: 49.2700, lng: -123.2500 },
    },
    estimatedTime: 35,
    weatherDependent: true,
  },
  {
    name: "Beach Route",
    description: "A 3km route to Wreck Beach with stunning ocean views and beach access.",
    distance: 3.0,
    difficulty: "Medium" as const,
    landmarks: ["Marine Drive", "Wreck Beach Stairs", "Beach Access"],
    coordinates: {
      start: { lat: 49.2650, lng: -123.2500 },
      waypoints: [
        { lat: 49.2640, lng: -123.2480, name: "Marine Drive" },
        { lat: 49.2630, lng: -123.2460, name: "Wreck Beach Stairs" },
        { lat: 49.2620, lng: -123.2440, name: "Beach Access" },
      ],
      end: { lat: 49.2650, lng: -123.2500 },
    },
    estimatedTime: 20,
    weatherDependent: true,
  },
  {
    name: "Stadium Circuit",
    description: "A quick 1km loop around Thunderbird Stadium, perfect for speed training.",
    distance: 1.0,
    difficulty: "Easy" as const,
    landmarks: ["Thunderbird Stadium", "War Memorial Gym", "Aquatic Centre"],
    coordinates: {
      start: { lat: 49.2630, lng: -123.2520 },
      waypoints: [
        { lat: 49.2625, lng: -123.2510, name: "Thunderbird Stadium" },
        { lat: 49.2620, lng: -123.2500, name: "War Memorial Gym" },
        { lat: 49.2615, lng: -123.2490, name: "Aquatic Centre" },
      ],
      end: { lat: 49.2630, lng: -123.2520 },
    },
    estimatedTime: 8,
    weatherDependent: false,
  },
];

export const CAMPUS_LANDMARKS = [
  { name: "Rose Garden", lat: 49.2606, lng: -123.2460, description: "Beautiful rose garden with mountain views" },
  { name: "Nitobe Memorial Garden", lat: 49.2615, lng: -123.2450, description: "Traditional Japanese garden" },
  { name: "Irving K. Barber Learning Centre", lat: 49.2680, lng: -123.2540, description: "Main library and learning centre" },
  { name: "Student Union Building", lat: 49.2675, lng: -123.2530, description: "Student hub and services" },
  { name: "Koerner Library", lat: 49.2670, lng: -123.2520, description: "Graduate research library" },
  { name: "Thunderbird Stadium", lat: 49.2625, lng: -123.2510, description: "Main athletics stadium" },
  { name: "War Memorial Gym", lat: 49.2620, lng: -123.2500, description: "Historic gymnasium" },
  { name: "Aquatic Centre", lat: 49.2615, lng: -123.2490, description: "Swimming and aquatic facilities" },
];
