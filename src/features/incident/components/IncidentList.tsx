import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, Clock, CheckCircle2, XCircle, Plus, Edit, Trash2 } from "lucide-react"
import { useLanguage } from "@/i18n/LanguageContext"
import { useAuth } from "@/features/auth/hooks/useAuth"
import type { Incident, IncidentStatus, IncidentPriority, Elevator } from "@/types"

export function IncidentList() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [elevators, setElevators] = useState<Elevator[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null)
  
  const [formData, setFormData] = useState<Partial<Incident>>({
    elevatorId: "",
    description: "",
    priority: "medium",
    status: "new",
  })

  useEffect(() => {
    const storedIncidents = localStorage.getItem('elevator_incidents_db')
    if (storedIncidents) {
      setIncidents(JSON.parse(storedIncidents))
    } else {
      // Initial mock data for incidents
      const initialIncidents: Incident[] = [
        {
          id: "INC-101",
          elevatorId: "E01",
          description: "Elevator making unusual grinding noise during descent.",
          priority: "high",
          status: "in_progress",
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updatedAt: new Date().toISOString(),
          reporterId: "admin",
        },
        {
          id: "INC-102",
          elevatorId: "E03",
          description: "Internal lighting flickering on floor 15.",
          priority: "low",
          status: "new",
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          reporterId: "admin",
        }
      ]
      saveIncidents(initialIncidents)
    }
    const storedElevators = localStorage.getItem('elevator_data')
    if (storedElevators) {
      setElevators(JSON.parse(storedElevators))
    } else {
      // Fallback fallback mock data if Dashboard hasn't saved to localStorage yet
      const fallbackElevators = [
        { id: "E01", building: "Tower A" },
        { id: "E02", building: "Tower A" },
        { id: "E03", building: "Tower B" },
        { id: "E04", building: "Tower B" },
      ]
      setElevators(fallbackElevators as any)
    }
  }, [])

  const saveIncidents = (newIncidents: Incident[]) => {
    setIncidents(newIncidents)
    localStorage.setItem('elevator_incidents_db', JSON.stringify(newIncidents))
  }

  const handleAddIncident = () => {
    if (!formData.elevatorId || !formData.description) return
    
    const newIncident: Incident = {
      id: `INC${Date.now()}`,
      elevatorId: formData.elevatorId,
      description: formData.description,
      priority: formData.priority as IncidentPriority || "medium",
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reporterId: user?.id || "admin",
    }
    
    saveIncidents([newIncident, ...incidents])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleUpdateIncident = () => {
    if (!editingIncident) return
    
    const updated = incidents.map(inc => 
      inc.id === editingIncident.id 
        ? { 
            ...inc, 
            ...formData, 
            updatedAt: new Date().toISOString() 
          } as Incident 
        : inc
    )
    saveIncidents(updated)
    setEditingIncident(null)
    resetForm()
  }

  const handleDeleteIncident = (id: string) => {
    if (confirm(t('confirmDelete') || "Are you sure you want to delete this incident?")) {
      saveIncidents(incidents.filter(inc => inc.id !== id))
    }
  }

  const handleUpdateStatus = (id: string, status: IncidentStatus) => {
    const updated = incidents.map(inc => 
      inc.id === id ? { ...inc, status, updatedAt: new Date().toISOString() } : inc
    )
    saveIncidents(updated)
  }

  const resetForm = () => {
    setFormData({
      elevatorId: "",
      description: "",
      priority: "medium",
      status: "new",
    })
  }

  const openEditDialog = (incident: Incident) => {
    setEditingIncident(incident)
    setFormData({
      elevatorId: incident.elevatorId,
      description: incident.description,
      priority: incident.priority,
      status: incident.status,
    })
  }

  const getPriorityBadge = (priority: IncidentPriority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">{t('high')}</Badge>
      case "medium":
        return <Badge variant="warning">{t('medium')}</Badge>
      case "low":
        return <Badge variant="outline">{t('low')}</Badge>
    }
  }

  const getStatusIcon = (status: IncidentStatus) => {
    switch (status) {
      case "new":
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      case "in_progress":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "closed":
        return <XCircle className="w-4 h-4 text-slate-400" />
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{t('incidents')}</h1>
          <p className="text-muted-foreground mt-2">{t('requiresAttention')}</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> {t('reportIncident')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('reportIncident')}</DialogTitle>
              <DialogDescription>Create a new incident report.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>{t('elevator')}</Label>
                <Select value={formData.elevatorId} onValueChange={v => setFormData({...formData, elevatorId: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Elevator" />
                  </SelectTrigger>
                  <SelectContent>
                    {elevators.map(el => (
                      <SelectItem key={el.id} value={el.id}>{el.id} - {el.building}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('description')}</Label>
                <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the problem" />
              </div>
              <div className="space-y-2">
                <Label>{t('priority')}</Label>
                <Select value={formData.priority} onValueChange={v => setFormData({...formData, priority: v as IncidentPriority})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('low')}</SelectItem>
                    <SelectItem value="medium">{t('medium')}</SelectItem>
                    <SelectItem value="high">{t('high')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddIncident}>{t('confirmAdd')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{t('incidents')}</CardTitle>
          <CardDescription>Review and manage reported elevator issues.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Elevator</TableHead>
                <TableHead>{t('description')}</TableHead>
                <TableHead>{t('priority')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('createdAt')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No incidents reported yet.
                  </TableCell>
                </TableRow>
              ) : (
                incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono text-xs">{incident.id}</TableCell>
                    <TableCell className="font-bold">{incident.elevatorId}</TableCell>
                    <TableCell className="max-w-xs truncate">{incident.description}</TableCell>
                    <TableCell>{getPriorityBadge(incident.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(incident.status)}
                        <span className="capitalize text-sm">{t(incident.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(incident.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <div className="flex items-center justify-end gap-2">
                        <Select 
                          value={incident.status} 
                          onValueChange={(v) => handleUpdateStatus(incident.id, v as IncidentStatus)}
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">{t('new')}</SelectItem>
                            <SelectItem value="in_progress">{t('inProgress')}</SelectItem>
                            <SelectItem value="resolved">{t('resolved')}</SelectItem>
                            <SelectItem value="closed">{t('closed')}</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(incident)}>
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>

                        <Button variant="ghost" size="icon" onClick={() => handleDeleteIncident(incident.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingIncident} onOpenChange={(open) => !open && setEditingIncident(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('edit')}: {editingIncident?.id}</DialogTitle>
            <DialogDescription>Update incident details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>{t('description')}</Label>
              <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{t('priority')}</Label>
              <Select value={formData.priority} onValueChange={v => setFormData({...formData, priority: v as IncidentPriority})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t('low')}</SelectItem>
                  <SelectItem value="medium">{t('medium')}</SelectItem>
                  <SelectItem value="high">{t('high')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('status')}</Label>
              <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v as IncidentStatus})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{t('new')}</SelectItem>
                  <SelectItem value="in_progress">{t('inProgress')}</SelectItem>
                  <SelectItem value="resolved">{t('resolved')}</SelectItem>
                  <SelectItem value="closed">{t('closed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateIncident}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
