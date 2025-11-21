import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  UsersIcon, 
  PackageIcon, 
  ShoppingCartIcon, 
  ActivityIcon,
  DatabaseIcon,
  AlertTriangleIcon,
  SettingsIcon
} from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium">Total Users</h3>
              </div>
              <p className="text-2xl font-bold">loading...</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <PackageIcon className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium">Products</h3>
              </div>
              <p className="text-2xl font-bold">loading...</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium">Orders Today</h3>
              </div>
              <p className="text-2xl font-bold">loading...</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <ActivityIcon className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium">System Status</h3>
              </div>
              <p className="text-sm font-medium text-green-500">All Systems Operational</p>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <div className="p-6">
                <h3 className="text-xl font-semibold">System Resources</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Database Status</span>
                    <DatabaseIcon className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">API Health</span>
                    <ActivityIcon className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Error Rate</span>
                    <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="col-span-3">
              <div className="p-6">
                <h3 className="text-xl font-semibold">Quick Actions</h3>
                <div className="mt-4 space-y-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2">
                    <UsersIcon className="h-4 w-4" />
                    Manage Users
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2">
                    <PackageIcon className="h-4 w-4" />
                    Product Catalog
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4" />
                    System Settings
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">System Analytics</h3>
            {/* Add analytics components here */}
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">System Reports</h3>
            {/* Add reports components here */}
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">System Notifications</h3>
            {/* Add notifications components here */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}