import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, ShieldCheck, User as UserIcon, Building2 } from "lucide-react"

export function LoginForm() {
  const { login } = useAuth()
  const [phone, setPhone] = useState("")

  const handleMockLogin = (role: 'admin' | 'operator' | 'viewer') => {
    if (!phone) {
      alert("Please enter a phone number (mock)")
      return
    }
    login(phone, role)
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Elevator CMS Login</CardTitle>
          <CardDescription>
            Enter your phone number to access the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="09xx xxx xxx"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 pt-2">
            <Button 
              onClick={() => handleMockLogin('viewer')} 
              variant="outline" 
              className="justify-start h-12 hover:bg-slate-50"
            >
              <UserIcon className="mr-2 h-4 w-4 text-slate-500" />
              Login as Building Occupant (Viewer)
            </Button>
            <Button 
              onClick={() => handleMockLogin('operator')} 
              variant="outline"
              className="justify-start h-12 hover:bg-slate-50"
            >
              <Smartphone className="mr-2 h-4 w-4 text-blue-500" />
              Login as Staff (Operator)
            </Button>
            <Button 
              onClick={() => handleMockLogin('admin')} 
              variant="outline"
              className="justify-start h-12 hover:bg-slate-50"
            >
              <ShieldCheck className="mr-2 h-4 w-4 text-orange-500" />
              Login as System Administrator (Admin)
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-xs text-center text-muted-foreground mt-2">
            © 2026 Piscada Elevator Management System
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
