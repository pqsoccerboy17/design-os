import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Users,
  FileText,
  Check,
  Plus,
  Upload,
  Phone,
  Globe,
  MapPin,
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'completed' | 'current' | 'upcoming'
}

const steps: OnboardingStep[] = [
  { id: 'company', title: 'Company Details', description: 'Basic company information', icon: <Building className="h-5 w-5" />, status: 'current' },
  { id: 'contacts', title: 'Key Contacts', description: 'Add stakeholders', icon: <Users className="h-5 w-5" />, status: 'upcoming' },
  { id: 'documents', title: 'Documents', description: 'Upload contracts & NDAs', icon: <FileText className="h-5 w-5" />, status: 'upcoming' },
  { id: 'review', title: 'Review & Launch', description: 'Final review', icon: <Check className="h-5 w-5" />, status: 'upcoming' },
]

export default function ClientOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)

  const progress = ((currentStep + 1) / steps.length) * 100

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
              New Client Onboarding
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Set up a new client account
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
                  <p className="text-xs text-stone-500">{step.description}</p>
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

      {/* Step Content */}
      {currentStep === 0 && (
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>Enter the basic information about this client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Company Name *
                </label>
                <Input placeholder="Acme Corporation" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Industry
                </label>
                <Input placeholder="Technology" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  <Globe className="h-4 w-4 inline mr-1" />
                  Website
                </label>
                <Input placeholder="https://acme.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone
                </label>
                <Input placeholder="+1 (555) 000-0000" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                <MapPin className="h-4 w-4 inline mr-1" />
                Address
              </label>
              <Textarea placeholder="123 Main Street, Suite 100, San Francisco, CA 94102" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Notes
              </label>
              <Textarea placeholder="Additional information about this client..." />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 1 && (
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Key Contacts</CardTitle>
                <CardDescription>Add stakeholders and contacts for this client</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Example contacts */}
              <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-700">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Name *</label>
                    <Input placeholder="John Smith" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Title</label>
                    <Input placeholder="VP of Engineering" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Email *</label>
                    <Input placeholder="john@acme.com" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300 block mb-2">
                    MEDDPICC Roles
                  </label>
                  <div className="flex gap-2">
                    {['Champion', 'Economic Buyer', 'Technical Evaluator', 'Coach'].map(role => (
                      <Badge key={role} variant="outline" className="cursor-pointer hover:bg-stone-100">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Upload contracts, NDAs, and other important documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 mx-auto text-stone-400 mb-3" />
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-stone-500">PDF, DOC, DOCX up to 10MB</p>
              <Button variant="outline" className="mt-4">
                Browse Files
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Document Checklist
              </label>
              <div className="space-y-3">
                {['Master Service Agreement (MSA)', 'Non-Disclosure Agreement (NDA)', 'Statement of Work (SOW)', 'Insurance Certificate'].map(doc => (
                  <div key={doc} className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-900">
                    <Checkbox />
                    <span className="text-sm text-stone-700 dark:text-stone-300">{doc}</span>
                    <Badge variant="outline" className="ml-auto">Optional</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader>
            <CardTitle>Review & Launch</CardTitle>
            <CardDescription>Review the client details before finalizing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-stone-900 dark:text-stone-100">Company Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Company Name</span>
                    <span className="font-medium">Acme Corporation</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Industry</span>
                    <span className="font-medium">Technology</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Website</span>
                    <span className="font-medium">acme.com</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-stone-900 dark:text-stone-100">Contacts</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-stone-600 dark:text-stone-400">2 contacts added</p>
                </div>
                <h3 className="font-medium text-stone-900 dark:text-stone-100 mt-4">Documents</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-stone-600 dark:text-stone-400">1 document uploaded</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800">
                <Check className="h-5 w-5 text-lime-600" />
                <div>
                  <p className="font-medium text-lime-800 dark:text-lime-200">Ready to launch</p>
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
              Create Client
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
