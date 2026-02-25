export type ElevatorStatus = "available" | "maintenance" | "out_of_order"

export interface Elevator {
  id: string
  name: string
  building: string
  floorRange: string
  status: ElevatorStatus
  lastUpdated: string
  maintenanceDate: string
  assignedUserId: string | null
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  password?: string
  role: "admin" | "operator" | "viewer"
  status: "active" | "disabled"
}
