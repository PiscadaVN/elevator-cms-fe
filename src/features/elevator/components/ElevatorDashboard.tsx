import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Elevator } from "@/types"
import { Activity, AlertTriangle, CheckCircle2, Settings, LogOut, Plus, User as UserIcon } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"

const mockElevators: Elevator[] = [
  { id: "E01", name: "Elevator 1", building: "Tower A", floorRange: "1-20", status: "available", lastUpdated: "10:32 AM" },
  { id: "E02", name: "Elevator 2", building: "Tower A", floorRange: "1-20", status: "maintenance", lastUpdated: "09:10 AM" },
  { id: "E03", name: "Elevator 3", building: "Tower B", floorRange: "1-30", status: "out_of_order", lastUpdated: "08:55 AM" },
  { id: "E04", name: "Elevator 4", building: "Tower B", floorRange: "1-30", status: "available", lastUpdated: "11:15 AM" },
]

export function ElevatorDashboard() {
  const { user, logout } = useAuth()

  const getStatusBadge = (status: Elevator["status"]) => {
    switch (status) {
      case "available":
        return <Badge variant="success">Available</Badge>
      case "maintenance":
        return <Badge variant="warning">Maintenance</Badge>
      case "out_of_order":
        return <Badge variant="destructive">Out of Order</Badge>
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Elevator CMS</h1>
          <p className="text-muted-foreground mt-2">Real-time monitoring and status management system.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-full border shadow-sm">
            <div className="p-1.5 bg-primary/5 rounded-full">
              <UserIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="text-sm">
              <span className="font-medium">{user?.name}</span>
              <Badge variant="outline" className="ml-2 uppercase text-[10px] py-0">{user?.role}</Badge>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Activity className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Connected systems</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Available</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">2</div>
            <p className="text-xs text-green-600/80">Units operational</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Maintenance</CardTitle>
            <Settings className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">1</div>
            <p className="text-xs text-yellow-600/80">Scheduled checks</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/5 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Out of Order</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">1</div>
            <p className="text-xs text-red-600/80">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Elevator Status Overview</CardTitle>
            <CardDescription>Comprehensive list of all units and their current operational state.</CardDescription>
          </div>
          {user?.role !== 'viewer' && (
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add Elevator
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Floors</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                {user?.role !== 'viewer' && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockElevators.map((elevator) => (
                <TableRow key={elevator.id}>
                  <TableCell className="font-bold">{elevator.id}</TableCell>
                  <TableCell>{elevator.building}</TableCell>
                  <TableCell>{elevator.floorRange}</TableCell>
                  <TableCell>{getStatusBadge(elevator.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{elevator.lastUpdated}</TableCell>
                  {user?.role !== 'viewer' && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
