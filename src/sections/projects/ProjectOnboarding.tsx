import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Users,
  Calendar,
  Check,
  Plus,
  DollarSign,
  Building,
  Target,
  Milestone,
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

const steps: OnboardingStep[] = [
  { id: 'basics', title: 'Project Basics', description: 'Name, client, dates', icon: <Briefcase className="h-5 w-5" /> },
  { id: 'team', title: 'Team', description: 'Assign team members', icon: <Users className="h-5 w-5" /> },
  { id: 'phases', title: 'Phases', description: 'Set up project phases', icon: <Milestone className="h-5 w-5" /> },
  { id: 'review', title: 'Review', description: 'Finalize project', icon: <Check className="h-5 w-5" /> },
]

const teamMembers = [
  { id: 'user-001', name: 'Alex Rivera', role: 'admin', email: 'alex@yourco.com' },
  { id: 'user-002', name: 'Jamie Chen', role: 'consultant', email: 'jamie@yourco.com' },
  { id: 'user-003', name: 'Morgan Smith', role: 'consultant', email: 'morgan@yourco.com' },
]

const clients = [
  { id: 'client-001', name: 'Acme Corporation' },
  { id: 'client-003', name: 'Initech Solutions' },
  { id: 'client-004', name: 'Stark Manufacturing' },
]

export default function ProjectOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTeam, setSelectedTeam] = useState<Set<string>>(new Set(['user-001']))

  const progress = ((currentStep + 1) / steps.length) * 100

  const toggleTeamMember = (id: string) => {
    const newSelected = new Set(selectedTeam)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedTeam(newSelected)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
              New Project Setup
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Configure a new project
            </p>
          </div>
        </div>
        <Button variant="outline">Save & Exit</Button>
      </div>

      {/* Progress */}
      <Card className="border-stone-200 dark:border-stone-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-stone-500">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2 mb-6" />
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    index < currentStep ? 'bg-lime-500 text-white' :
                    index === currentStep ? 'bg-sky-500 text-white' :
                    'bg-stone-200 text-stone-500 dark:bg-stone-700'
                  }`}>
                    {index < currentStep ? <Check className="h-5 w-5" /> : step.icon}
                  </div>
                  <p className={`mt-2 text-sm font-medium ${
                    index <= currentStep ? 'text-stone-900 dark:text-stone-100' : 'text-stone-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-lime-500' : 'bg-stone-200 dark:bg-stone-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Basics */}
      {currentStep === 0 && (
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader>
            <CardTitle>Project Basics</CardTitle>
            <CardDescription>Enter the fundamental project information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Project Name *
                </label>
                <Input placeholder="EasyVista Implementation" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Client *
                </label>
                <div className="flex gap-2">
                  {clients.map(client => (
                    <Badge
                      key={client.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      <Building className="h-3 w-3 mr-1" />
                      {client.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Start Date
                </label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Target End Date
                </label>
                <Input type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Budget
                </label>
                <Input type="number" placeholder="150000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  <Target className="h-4 w-4 inline mr-1" />
                  Hourly Rate
                </label>
                <Input type="number" placeholder="150" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Description
              </label>
              <Textarea placeholder="Brief description of the project scope and objectives..." />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Team */}
      {currentStep === 1 && (
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader>
            <CardTitle>Assign Team</CardTitle>
            <CardDescription>Select team members to work on this project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map(member => (
              <div
                key={member.id}
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedTeam.has(member.id)
                    ? 'border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-900/20'
                    : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-900'
                }`}
                onClick={() => toggleTeamMember(member.id)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox checked={selectedTeam.has(member.id)} />
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-stone-900 dark:text-stone-100">{member.name}</p>
                    <p className="text-sm text-stone-500">{member.email}</p>
                  </div>
                </div>
                <Badge className={
                  member.role === 'admin' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' :
                  'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                }>
                  {member.role}
                </Badge>
              </div>
            ))}
            <p className="text-sm text-stone-500 mt-4">
              {selectedTeam.size} team member{selectedTeam.size !== 1 ? 's' : ''} selected
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Phases */}
      {currentStep === 2 && (
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Project Phases</CardTitle>
                <CardDescription>Define the phases of this project</CardDescription>
              </div>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Phase
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Discovery & Requirements', 'Design & Planning', 'Implementation', 'Testing & QA', 'Deployment & Training'].map((phase, index) => (
              <div key={phase} className="p-4 rounded-lg border border-stone-200 dark:border-stone-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-8 w-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 text-sm font-medium">
                    {index + 1}
                  </div>
                  <Input defaultValue={phase} className="flex-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-stone-500">Start Date</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-stone-500">End Date</label>
                    <Input type="date" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {currentStep === 3 && (
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader>
            <CardTitle>Review & Create</CardTitle>
            <CardDescription>Review the project details before creating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-stone-900 dark:text-stone-100">Project Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Name</span>
                    <span className="font-medium">EasyVista Implementation</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Client</span>
                    <span className="font-medium">Acme Corporation</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Duration</span>
                    <span className="font-medium">Jan 15 - Jun 30, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Budget</span>
                    <span className="font-medium">$150,000</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-stone-900 dark:text-stone-100">Team</h3>
                <div className="flex flex-wrap gap-2">
                  {teamMembers.filter(m => selectedTeam.has(m.id)).map(member => (
                    <Badge key={member.id} variant="outline">
                      {member.name}
                    </Badge>
                  ))}
                </div>
                <h3 className="font-medium text-stone-900 dark:text-stone-100 mt-4">Phases</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400">5 phases configured</p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800">
                <Check className="h-5 w-5 text-lime-600" />
                <div>
                  <p className="font-medium text-lime-800 dark:text-lime-200">Ready to create</p>
                  <p className="text-sm text-lime-700 dark:text-lime-300">All required information has been provided</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
        >
          {currentStep === steps.length - 1 ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Create Project
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
