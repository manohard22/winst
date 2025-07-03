import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  GraduationCap, 
  CheckSquare, 
  User,
  Calendar
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Programs', href: '/programs', icon: BookOpen },
  { name: 'My Enrollments', href: '/enrollments', icon: GraduationCap },
  { name: 'Profile', href: '/profile', icon: User },
]

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
