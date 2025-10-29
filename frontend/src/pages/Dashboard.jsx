import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Package, 
  ShoppingCart, 
  User, 
  Plus,
  BarChart3,
  Settings
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import FarmerDashboard from '../components/dashboard/FarmerDashboard'
import ConsumerDashboard from '../components/dashboard/ConsumerDashboard'
import ProductManagement from '../components/dashboard/ProductManagement'
import OrderManagement from '../components/dashboard/OrderManagement'
import Profile from '../components/dashboard/Profile'

const Dashboard = () => {
  const { user } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: Home, current: location.pathname === '/dashboard' },
    ...(user?.role === 'farmer' ? [
      { name: 'Products', href: '/dashboard/products', icon: Package, current: location.pathname === '/dashboard/products' },
      { name: 'Add Product', href: '/dashboard/products/new', icon: Plus, current: location.pathname === '/dashboard/products/new' },
    ] : []),
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart, current: location.pathname === '/dashboard/orders' },
    { name: 'Profile', href: '/dashboard/profile', icon: User, current: location.pathname === '/dashboard/profile' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🌱</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">Dashboard</span>
            </div>
            
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        item.current
                          ? 'bg-green-100 text-green-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <Icon
                        className={`${
                          item.current ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 flex-shrink-0 h-6 w-6`}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      user?.role === 'farmer' ? <FarmerDashboard /> : <ConsumerDashboard />
                    } 
                  />
                  {user?.role === 'farmer' && (
                    <>
                      <Route path="/products" element={<ProductManagement />} />
                      <Route path="/products/new" element={<ProductManagement isNew />} />
                      <Route path="/products/:id/edit" element={<ProductManagement isEdit />} />
                    </>
                  )}
                  <Route path="/orders" element={<OrderManagement />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard