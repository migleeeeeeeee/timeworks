/*
 * Mock data populating the page. Strings for the first tile, breadcrumbs,
 * tabs, sidebar header, etc. are lifted verbatim from the Figma source
 * (file gqYWCu1K6dJ9gESXtgNeCi, node 27521:263777). The other 11 tiles
 * follow the same shape with plausible variations to demonstrate the layout.
 */

import type { Assignee, Project, Task } from "../types"

const AVATAR = (seed: string): string =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}`

const PEOPLE: Assignee[] = [
  { id: "u1", name: "Aria Patel", avatarUrl: AVATAR("Aria") },
  { id: "u2", name: "Ben Carter", avatarUrl: AVATAR("Ben") },
  { id: "u3", name: "Casey Lin", avatarUrl: AVATAR("Casey") },
  { id: "u4", name: "Dani Vega", avatarUrl: AVATAR("Dani") },
  { id: "u5", name: "Eli Romero", avatarUrl: AVATAR("Eli") },
  { id: "u6", name: "Frey Olsen", avatarUrl: AVATAR("Frey") },
]

export const projects: Project[] = [
  { id: "p1", name: "EverTech", timeSpent: "01:22" },
  { id: "p2", name: "NorthPeak", timeSpent: "00:48" },
  { id: "p3", name: "Helios", timeSpent: "02:05" },
  { id: "p4", name: "BlueRiver", timeSpent: "00:13" },
  { id: "p5", name: "Magnolia", timeSpent: "00:00" },
]

const mk = (
  i: number,
  partial: Partial<Task> & Pick<Task, "title" | "projectId" | "status">,
): Task => ({
  id: `t${i}`,
  timeAllocated: "05:30:00",
  timeSpent: "03:32:00",
  subtasksDone: 8,
  subtasksTotal: 16,
  responsible: PEOPLE[i % PEOPLE.length]!,
  members: PEOPLE.slice(0, 3),
  priority: "medium",
  ...partial,
})

export const tasks: Task[] = [
  mk(1, { title: "Tasks Name", projectId: "p1", status: "in_progress" }),
  mk(2, { title: "Audit landing copy", projectId: "p1", status: "open" }),
  mk(3, { title: "Wire payment retry", projectId: "p2", status: "in_progress" }),
  mk(4, { title: "Migrate onboarding flow", projectId: "p3", status: "blocked" }),
  mk(5, { title: "Refactor billing service", projectId: "p2", status: "in_progress" }),
  mk(6, { title: "Q3 hiring plan", projectId: "p4", status: "done" }),
  mk(7, { title: "Customer interview synthesis", projectId: "p3", status: "in_progress" }),
  mk(8, { title: "Renew TLS certs", projectId: "p1", status: "open" }),
  mk(9, { title: "Design review: settings", projectId: "p5", status: "in_progress" }),
  mk(10, { title: "Backfill analytics events", projectId: "p2", status: "in_progress" }),
  mk(11, { title: "Mobile push payload audit", projectId: "p4", status: "open" }),
  mk(12, { title: "Annual access review", projectId: "p3", status: "in_progress" }),
]

export const initialTimer = {
  currentTaskId: tasks[0]!.id,
  isRunning: false,
  elapsedSeconds: 3 * 3600 + 32 * 60, // matches "03:32:00" from the Figma source
}
