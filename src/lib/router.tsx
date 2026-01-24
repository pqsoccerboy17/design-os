import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProductPage } from '@/components/ProductPage'
import { DataModelPage } from '@/components/DataModelPage'
import { DesignPage } from '@/components/DesignPage'
import { SectionsPage } from '@/components/SectionsPage'
import { SectionPage } from '@/components/SectionPage'
import { ScreenDesignPage, ScreenDesignFullscreen } from '@/components/ScreenDesignPage'
import { ShellDesignPage, ShellDesignFullscreen } from '@/components/ShellDesignPage'
import { ExportPage } from '@/components/ExportPage'
import { ProductRoutes } from '@/routes/ProductRoutes'

// Section screens
import ClientsList from '@/sections/clients/ClientsList'
import ClientDetail from '@/sections/clients/ClientDetail'
import ClientOnboarding from '@/sections/clients/ClientOnboarding'
import OpportunityDetail from '@/sections/clients/OpportunityDetail'
import ProjectsList from '@/sections/projects/ProjectsList'
import ProjectDetail from '@/sections/projects/ProjectDetail'
import ProjectOnboarding from '@/sections/projects/ProjectOnboarding'
import ProjectTimeline from '@/sections/projects/ProjectTimeline'
import TasksBoard from '@/sections/tasks/TasksBoard'
import TasksList from '@/sections/tasks/TasksList'
import TaskDetail from '@/sections/tasks/TaskDetail'
import InternalDashboard from '@/sections/dashboards/InternalDashboard'
import ClientPortal from '@/sections/dashboards/ClientPortal'
import InvoicesList from '@/sections/invoicing/InvoicesList'
import InvoiceDetail from '@/sections/invoicing/InvoiceDetail'
import InvoiceGenerate from '@/sections/invoicing/InvoiceGenerate'
import TimeEntryWeekView from '@/sections/invoicing/TimeEntryWeekView'
import TimeEntryList from '@/sections/invoicing/TimeEntryList'
import Settings from '@/sections/admin/Settings'
import UserManagement from '@/sections/admin/UserManagement'
import AuditLog from '@/sections/admin/AuditLog'
import DataManagement from '@/sections/admin/DataManagement'
import ClientAssignments from '@/sections/admin/ClientAssignments'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProductPage />,
  },
  {
    path: '/data-model',
    element: <DataModelPage />,
  },
  {
    path: '/design',
    element: <DesignPage />,
  },
  {
    path: '/sections',
    element: <SectionsPage />,
  },
  {
    path: '/sections/:sectionId',
    element: <SectionPage />,
  },
  {
    path: '/sections/:sectionId/screen-designs/:screenDesignName',
    element: <ScreenDesignPage />,
  },
  {
    path: '/sections/:sectionId/screen-designs/:screenDesignName/fullscreen',
    element: <ScreenDesignFullscreen />,
  },
  {
    path: '/shell/design',
    element: <ShellDesignPage />,
  },
  {
    path: '/shell/design/fullscreen',
    element: <ShellDesignFullscreen />,
  },
  {
    path: '/export',
    element: <ExportPage />,
  },
  {
    path: '/product',
    element: <ProductRoutes />,
    children: [
      { index: true, element: <Navigate to="/product/clients" replace /> },
      // Clients section
      { path: 'clients', element: <ClientsList /> },
      { path: 'clients/:id', element: <ClientDetail /> },
      { path: 'clients/:id/onboarding', element: <ClientOnboarding /> },
      { path: 'clients/:id/portal', element: <ClientPortal /> },
      { path: 'opportunities/:id', element: <OpportunityDetail /> },
      // Projects section
      { path: 'projects', element: <ProjectsList /> },
      { path: 'projects/new', element: <ProjectOnboarding /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
      { path: 'projects/:id/timeline', element: <ProjectTimeline /> },
      // Tasks section
      { path: 'tasks', element: <TasksBoard /> },
      { path: 'tasks/list', element: <TasksList /> },
      { path: 'tasks/:id', element: <TaskDetail /> },
      // Dashboards section
      { path: 'dashboards', element: <InternalDashboard /> },
      { path: 'dashboards/client', element: <ClientPortal /> },
      // Invoicing section
      { path: 'invoicing', element: <InvoicesList /> },
      { path: 'invoicing/time', element: <TimeEntryWeekView /> },
      { path: 'invoicing/time/list', element: <TimeEntryList /> },
      { path: 'invoicing/generate', element: <InvoiceGenerate /> },
      { path: 'invoicing/:id', element: <InvoiceDetail /> },
      // Admin section
      { path: 'admin', element: <Settings /> },
      { path: 'admin/users', element: <UserManagement /> },
      { path: 'admin/audit', element: <AuditLog /> },
      { path: 'admin/data', element: <DataManagement /> },
      { path: 'admin/assignments', element: <ClientAssignments /> },
    ],
  },
])
