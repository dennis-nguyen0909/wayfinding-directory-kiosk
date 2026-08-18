import type { Building } from '@/lib/types'

/**
 * ★ THE CUSTOMIZATION SURFACE ★
 *
 * This is the only file a remix needs to touch to become a different real
 * building. Everything else (routing, rendering, turn-by-turn copy) derives
 * from the grid positions and connections declared here — no floor-plan
 * artwork, no percentage/pixel coordinates, no separate graph to hand-author.
 *
 * How to make this your building — see CLAUDE.md "Customization workflow"
 * for the full agent-facing walkthrough. Short version:
 *   1. Rename `name`/`tagline`, adjust `categories` if yours differ.
 *   2. For each floor: pick a grid size (cols x rows), list your rooms with
 *      a `gridPosition`, and lay a corridor spine between them.
 *   3. Mark exactly one corridor cell per floor as the elevator (shared
 *      `groupId` across floors) and one as the stairs, same way.
 *   4. Point `defaultEntryCorridorId` at your main entrance's corridor cell.
 * Routing, "you are here," and directions all update automatically.
 */
export const building: Building = {
  name: 'Meridian Tower',
  tagline: 'Directory & wayfinding',
  defaultEntryCorridorId: 'f1-c1',
  categories: [
    { id: 'dining', label: 'Dining' },
    { id: 'services', label: 'Services' },
    { id: 'business', label: 'Business' },
    { id: 'amenity', label: 'Amenities' },
    { id: 'restroom', label: 'Restrooms' },
    { id: 'meeting', label: 'Meeting Spaces' },
  ],
  floors: [
    {
      id: 'f1',
      label: 'Ground Floor',
      cols: 7,
      rows: 3,
      rooms: [
        {
          id: 'f1-fitness',
          name: 'Fitness Center',
          category: 'amenity',
          gridPosition: { col: 1, row: 1 },
          entranceSide: 's',
          keywords: ['gym', 'workout'],
          hours: '5:00 AM – 10:00 PM',
          description: 'Cardio, free weights, and a stretch studio for tenants.',
        },
        {
          id: 'f1-mailroom',
          name: 'Mail & Packages',
          category: 'services',
          gridPosition: { col: 2, row: 1 },
          entranceSide: 's',
          keywords: ['mail', 'packages', 'deliveries'],
          hours: '8:00 AM – 6:00 PM',
        },
        {
          id: 'f1-reception',
          name: 'Reception Desk',
          category: 'services',
          gridPosition: { col: 3, row: 1 },
          entranceSide: 's',
          keywords: ['front desk', 'concierge', 'visitor badges'],
          hours: '7:00 AM – 7:00 PM',
          phone: '(555) 010-2000',
        },
        {
          id: 'f1-cafe',
          name: 'The Daily Grind',
          category: 'dining',
          gridPosition: { col: 5, row: 1 },
          entranceSide: 's',
          keywords: ['coffee', 'cafe', 'breakfast', 'lunch'],
          hours: '6:30 AM – 5:00 PM',
          description: 'Coffee, pastries, and grab-and-go lunch.',
        },
        {
          id: 'f1-restrooms',
          name: 'Restrooms',
          category: 'restroom',
          gridPosition: { col: 7, row: 1 },
          entranceSide: 's',
        },
        {
          id: 'f1-security',
          name: 'Security Desk',
          category: 'services',
          gridPosition: { col: 2, row: 3 },
          entranceSide: 'n',
          keywords: ['security', 'lost and found'],
          hours: '24 hours',
        },
        {
          id: 'f1-summit',
          name: 'The Summit Conference Center',
          category: 'meeting',
          gridPosition: { col: 5, row: 3, colSpan: 2 },
          entranceSide: 'n',
          keywords: ['conference', 'event space', 'bookable'],
          description: 'Bookable event space for up to 120 guests.',
        },
      ],
      corridors: [
        { id: 'f1-c1', gridPosition: { col: 1, row: 2 }, label: 'Main Entrance' },
        { id: 'f1-c2', gridPosition: { col: 2, row: 2 } },
        { id: 'f1-c3', gridPosition: { col: 3, row: 2 } },
        { id: 'f1-c5', gridPosition: { col: 5, row: 2 } },
        { id: 'f1-c7', gridPosition: { col: 7, row: 2 } },
      ],
      transitions: [
        {
          id: 'f1-elevator',
          groupId: 'elevator-a',
          floorId: 'f1',
          gridPosition: { col: 4, row: 2 },
          kind: 'elevator',
          label: 'Elevator Lobby',
        },
        {
          id: 'f1-stairs',
          groupId: 'stairs-a',
          floorId: 'f1',
          gridPosition: { col: 6, row: 2 },
          kind: 'stairs',
          label: 'Stairwell A',
        },
      ],
    },
    {
      id: 'f2',
      label: '2nd Floor — Business Suites',
      cols: 7,
      rows: 3,
      rooms: [
        {
          id: 'f2-legal',
          name: 'Meridian Legal',
          category: 'business',
          gridPosition: { col: 1, row: 1 },
          entranceSide: 's',
          keywords: ['law firm', 'attorney'],
          hours: '9:00 AM – 6:00 PM',
        },
        {
          id: 'f2-northstar',
          name: 'Northstar Capital',
          category: 'business',
          gridPosition: { col: 2, row: 1 },
          entranceSide: 's',
          keywords: ['investment', 'finance'],
          hours: '9:00 AM – 5:00 PM',
        },
        {
          id: 'f2-restrooms',
          name: 'Restrooms',
          category: 'restroom',
          gridPosition: { col: 3, row: 1 },
          entranceSide: 's',
        },
        {
          id: 'f2-huddle-a',
          name: 'Huddle Room 2A',
          category: 'meeting',
          gridPosition: { col: 5, row: 1 },
          entranceSide: 's',
          keywords: ['meeting room', 'huddle'],
          description: 'Seats 6 — screen-share ready, book at reception.',
        },
        {
          id: 'f2-brightpath',
          name: 'Bright Path Co.',
          category: 'business',
          gridPosition: { col: 7, row: 1 },
          entranceSide: 's',
          keywords: ['consulting'],
          hours: '9:00 AM – 5:00 PM',
        },
        {
          id: 'f2-vantage',
          name: 'Vantage Analytics',
          category: 'business',
          gridPosition: { col: 2, row: 3 },
          entranceSide: 'n',
          keywords: ['data', 'analytics'],
          hours: '9:00 AM – 6:00 PM',
        },
        {
          id: 'f2-huddle-b',
          name: 'Huddle Room 2B',
          category: 'meeting',
          gridPosition: { col: 5, row: 3, colSpan: 2 },
          entranceSide: 'n',
          keywords: ['meeting room', 'huddle'],
          description: 'Seats 10 — book at reception.',
        },
      ],
      corridors: [
        { id: 'f2-c1', gridPosition: { col: 1, row: 2 } },
        { id: 'f2-c2', gridPosition: { col: 2, row: 2 } },
        { id: 'f2-c3', gridPosition: { col: 3, row: 2 } },
        { id: 'f2-c5', gridPosition: { col: 5, row: 2 } },
        { id: 'f2-c7', gridPosition: { col: 7, row: 2 } },
      ],
      transitions: [
        {
          id: 'f2-elevator',
          groupId: 'elevator-a',
          floorId: 'f2',
          gridPosition: { col: 4, row: 2 },
          kind: 'elevator',
          label: 'Elevator Lobby',
        },
        {
          id: 'f2-stairs',
          groupId: 'stairs-a',
          floorId: 'f2',
          gridPosition: { col: 6, row: 2 },
          kind: 'stairs',
          label: 'Stairwell A',
        },
      ],
    },
    {
      id: 'f3',
      label: '3rd Floor — Executive & Wellness',
      cols: 7,
      rows: 3,
      rooms: [
        {
          id: 'f3-horizon',
          name: 'Horizon Ventures',
          category: 'business',
          gridPosition: { col: 1, row: 1 },
          entranceSide: 's',
          keywords: ['venture capital'],
          hours: '9:00 AM – 5:00 PM',
        },
        {
          id: 'f3-boardroom',
          name: 'Executive Boardroom',
          category: 'meeting',
          gridPosition: { col: 2, row: 1 },
          entranceSide: 's',
          keywords: ['boardroom', 'meeting'],
          description: 'Seats 16 — executive floor booking only.',
        },
        {
          id: 'f3-restrooms',
          name: 'Restrooms',
          category: 'restroom',
          gridPosition: { col: 3, row: 1 },
          entranceSide: 's',
        },
        {
          id: 'f3-wellness',
          name: 'Wellness Studio',
          category: 'amenity',
          gridPosition: { col: 5, row: 1 },
          entranceSide: 's',
          keywords: ['yoga', 'meditation', 'wellness'],
          hours: '6:00 AM – 8:00 PM',
        },
        {
          id: 'f3-it-help',
          name: 'IT Help Desk',
          category: 'services',
          gridPosition: { col: 7, row: 1 },
          entranceSide: 's',
          keywords: ['it support', 'tech help'],
          hours: '8:00 AM – 6:00 PM',
        },
        {
          id: 'f3-sky-lounge',
          name: 'Sky Lounge',
          category: 'amenity',
          gridPosition: { col: 2, row: 3, colSpan: 2 },
          entranceSide: 'n',
          keywords: ['rooftop', 'terrace', 'lounge'],
          description: 'Rooftop terrace with skyline views, open to all tenants.',
        },
      ],
      corridors: [
        { id: 'f3-c1', gridPosition: { col: 1, row: 2 } },
        { id: 'f3-c2', gridPosition: { col: 2, row: 2 } },
        { id: 'f3-c3', gridPosition: { col: 3, row: 2 } },
        { id: 'f3-c5', gridPosition: { col: 5, row: 2 } },
        { id: 'f3-c7', gridPosition: { col: 7, row: 2 } },
      ],
      transitions: [
        {
          id: 'f3-elevator',
          groupId: 'elevator-a',
          floorId: 'f3',
          gridPosition: { col: 4, row: 2 },
          kind: 'elevator',
          label: 'Elevator Lobby',
        },
        {
          id: 'f3-stairs',
          groupId: 'stairs-a',
          floorId: 'f3',
          gridPosition: { col: 6, row: 2 },
          kind: 'stairs',
          label: 'Stairwell A',
        },
      ],
    },
  ],
}
