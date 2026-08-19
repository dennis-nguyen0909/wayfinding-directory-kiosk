import {
  directionBetweenPositions,
  type FloorSegment,
  getNodeGridPosition,
  type Heading,
  type WayGraph,
} from './grid-graph'

export interface DirectionStep {
  text: string
  /** Optional — lets the UI pick an icon without re-parsing `text`. */
  kind?: 'start' | 'turn-left' | 'turn-right' | 'straight' | 'elevator' | 'stairs' | 'ramp' | 'arrive'
}

const HEADING_ORDER: Heading[] = ['n', 'e', 's', 'w']

function headingBetween(graph: WayGraph, fromId: string, toId: string): Heading {
  const a = getNodeGridPosition(graph, fromId)
  const b = getNodeGridPosition(graph, toId)
  if (!a || !b) return 'n'
  return directionBetweenPositions(a, b)
}

function turnPhrase(from: Heading, to: Heading): string {
  if (from === to) return 'Continue'
  const fromIdx = HEADING_ORDER.indexOf(from)
  const toIdx = HEADING_ORDER.indexOf(to)
  const diff = (toIdx - fromIdx + 4) % 4
  if (diff === 1) return 'Turn right'
  if (diff === 3) return 'Turn left'
  return 'Turn around'
}

function labelFor(graph: WayGraph, id: string): string {
  const way = graph.wayNodes.get(id)
  if (way?.label) return way.label
  const room = graph.rooms.get(id)
  if (room) return room.name
  return 'the hallway'
}

/** Turns one floor segment's node sequence into coarse, landmark-based copy. */
export function segmentToSteps(graph: WayGraph, segment: FloorSegment, isFirstSegment: boolean): DirectionStep[] {
  const steps: DirectionStep[] = []
  const { nodeIds } = segment
  if (nodeIds.length < 2) return steps

  let heading: Heading | null = null
  let legStartIndex = 0

  const flushLeg = (endIndex: number) => {
    if (heading === null) return
    const passedLabels: string[] = []
    for (let i = legStartIndex + 1; i < endIndex; i++) {
      const way = graph.wayNodes.get(nodeIds[i])
      if (way?.label) passedLabels.push(way.label)
    }
    const passedText = passedLabels.length > 0 ? ` past ${passedLabels.join(', ')}` : ''
    const isVeryFirstLeg = legStartIndex === 0 && isFirstSegment
    const verb = isVeryFirstLeg ? 'Head' : 'Continue'
    steps.push({
      text: `${verb} ${headingWord(heading)}${passedText}`,
      kind: isVeryFirstLeg ? 'start' : 'straight',
    })
  }

  for (let i = 1; i < nodeIds.length; i++) {
    const nextHeading = headingBetween(graph, nodeIds[i - 1], nodeIds[i])
    if (heading === null) {
      heading = nextHeading
      legStartIndex = i - 1
    } else if (nextHeading !== heading) {
      flushLeg(i - 1)
      const phrase = turnPhrase(heading, nextHeading)
      const kind: DirectionStep['kind'] = phrase === 'Turn right' ? 'turn-right' : phrase === 'Turn left' ? 'turn-left' : 'straight'
      steps.push({ text: `${phrase} toward ${labelFor(graph, nodeIds[i])}`, kind })
      heading = nextHeading
      legStartIndex = i - 1
    }
  }
  flushLeg(nodeIds.length - 1)

  return steps
}

function headingWord(h: Heading): string {
  switch (h) {
    case 'n':
      return 'straight ahead'
    case 's':
      return 'back the way you came'
    case 'e':
      return 'to the right'
    case 'w':
      return 'to the left'
  }
}

/** Builds the full turn-by-turn instruction list across all floor segments. */
export function buildDirections(
  graph: WayGraph,
  segments: FloorSegment[],
  destinationRoomName: string
): DirectionStep[] {
  const steps: DirectionStep[] = []

  segments.forEach((segment, i) => {
    steps.push(...segmentToSteps(graph, segment, i === 0))
    if (segment.exitTransition) {
      const verb =
        segment.exitTransition.kind === 'elevator'
          ? 'Take the elevator'
          : segment.exitTransition.kind === 'stairs'
            ? 'Take the stairs'
            : 'Take the ramp'
      steps.push({ text: `${verb} to ${segment.exitTransition.toFloorLabel}`, kind: segment.exitTransition.kind })
    }
  })

  steps.push({ text: `Arrive at ${destinationRoomName}`, kind: 'arrive' })
  return steps
}
