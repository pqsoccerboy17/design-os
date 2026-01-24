import { lazy, Suspense } from 'react'
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
import {
  ListPageSkeleton,
  DetailPageSkeleton,
  DashboardSkeleton,
} from '@/components/ui/skeleton-patterns'

// Lazy-loaded section screens
const ClientsList = lazy(() => import('@/sections/clients/ClientsList'))
const ClientDetail = lazy(() => import('@/sections/clients/ClientDetail'))
const ClientOnboarding = lazy(() => import('@/sections/clients/ClientOnboarding'))
const OpportunityDetail = lazy(() => import('@/sections/clients/OpportunityDetail'))
const ProjectsList = lazy(() => import('@/sections/projects/ProjectsList'))
const ProjectDetail = lazy(() => import('@/sections/projects/ProjectDetail'))
const ProjectOnboarding = lazy(() => import('@/sections/projects/ProjectOnboarding'))
const ProjectTimeline = lazy(() => import('@/sections/projects/ProjectTimeline'))
const TasksBoard = lazy(() => import('@/sections/tasks/TasksBoard'))
const TasksList = lazy(() => import('@/sections/tasks/TasksList'))
const TaskDetail = lazy(() => import('@/sections/tasks/TaskDetail'))
const InternalDashboard = lazy(() => import('@/sections/dashboards/InternalDashboard'))
const ClientPortal = lazy(() => import('@/sections/dashboards/ClientPortal'))
const InvoicesList = lazy(() => import('@/sections/invoicing/InvoicesList'))
const InvoiceDetail = lazy(() => import('@/sections/invoicing/InvoiceDetail'))
const InvoiceGenerate = lazy(() => import('@/sections/invoicing/InvoiceGenerate'))
const TimeEntryWeekView = lazy(() => import('@/sections/invoicing/TimeEntryWeekView'))
const TimeEntryList = lazy(() => import('@/sections/invoicing/TimeEntryList'))
const Settings = lazy(() => import('@/sections/admin/Settings'))
const UserManagement = lazy(() => import('@/sections/admin/UserManagement'))
const AuditLog = lazy(() => import('@/sections/admin/AuditLog'))
const DataManagement = lazy(() => import('@/sections/admin/DataManagement'))
const ClientAssignments = lazy(() => import('@/sections/admin/ClientAssignments'))

// Suspense wrappers for different page types
function ListSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<ListPageSkeleton />}>{children}</Suspense>
}

function DetailSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<DetailPageSkeleton />}>{children}</Suspense>
}

function DashboardSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>
}

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
      { path: 'clients', element: <ListSuspense><ClientsList /></ListSuspense> },
      { path: 'clients/:id', element: <DetailSuspense><ClientDetail /></DetailSuspense> },
      { path: 'clients/:id/onboarding', element: <DetailSuspense><ClientOnboarding /></DetailSuspense> },
      { path: 'clients/:id/portal', element: <DashboardSuspense><ClientPortal /></DashboardSuspense> },
      { path: 'opportunities/:id', element: <DetailSuspense><OpportunityDetail /></DetailSuspense> },
      // Projects section
      { path: 'projects', element: <ListSuspense><ProjectsList /></ListSuspense> },
      { path: 'projects/new', element: <DetailSuspense><ProjectOnboarding /></DetailSuspense> },
      { path: 'projects/:id', element: <DetailSuspense><ProjectDetail /></DetailSuspense> },
      { path: 'projects/:id/timeline', element: <DetailSuspense><ProjectTimeline /></DetailSuspense> },
      // Tasks section
      { path: 'tasks', element: <ListSuspense><TasksBoard /></ListSuspense> },
      { path: 'tasks/list', element: <ListSuspense><TasksList /></ListSuspense> },
      { path: 'tasks/:id', element: <DetailSuspense><TaskDetail /></DetailSuspense> },
      // Dashboards section
      { path: 'dashboards', element: <DashboardSuspense><InternalDashboard /></DashboardSuspense> },
      { path: 'dashboards/client', element: <DashboardSuspense><ClientPortal /></DashboardSuspense> },
      // Invoicing section
      { path: 'invoicing', element: <ListSuspense><InvoicesList /></ListSuspense> },
      { path: 'invoicing/time', element: <ListSuspense><TimeEntryWeekView /></ListSuspense> },
      { path: 'invoicing/time/list', element: <ListSuspense><TimeEntryList /></ListSuspense> },
      { path: 'invoicing/generate', element: <DetailSuspense><InvoiceGenerate /></DetailSuspense> },
      { path: 'invoicing/:id', element: <DetailSuspense><InvoiceDetail /></DetailSuspense> },
      // Admin section
      { path: 'admin', element: <DetailSuspense><Settings /></DetailSuspense> },
      { path: 'admin/users', element: <ListSuspense><UserManagement /></ListSuspense> },
      { path: 'admin/audit', element: <ListSuspense><AuditLog /></ListSuspense> },
      { path: 'admin/data', element: <DetailSuspense><DataManagement /></DetailSuspense> },
      { path: 'admin/assignments', element: <ListSuspense><ClientAssignments /></ListSuspense> },
    ],
  },
])
