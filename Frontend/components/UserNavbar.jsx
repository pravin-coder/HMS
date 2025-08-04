import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon, CalendarDaysIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'

const userLinks = [
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  { name: 'My Bookings', href: '/my-bookings', icon: CalendarDaysIcon },
  { name: 'My Reviews', href: '/my-reviews', icon: CalendarDaysIcon },
  { name: 'Logout', href: '#', icon: ArrowRightOnRectangleIcon, isLogout: true },
]

export default function UserNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [username, setUsername] = useState('User')
  const navigate = useNavigate()

  useEffect(() => {
    const storedName = localStorage.getItem('username')
    if (storedName) {
      setUsername(storedName)
    }
  }, [])

  const handleLogout = () => {
    console.log('Token', localStorage.getItem('token'))
    console.log('Role', localStorage.getItem('role'))
    console.log('UserId', localStorage.getItem('userId'))
    console.log('UserName', localStorage.getItem('username'))
    console.log('Name', localStorage.getItem('name'))
    console.log('Email', localStorage.getItem('email'))
    // Clear local storage
    localStorage.clear();
    console.log('User logged out')
    console.log('Token', localStorage.getItem('token'))
    console.log('Role', localStorage.getItem('role'))
    console.log('UserId', localStorage.getItem('userId'))
    console.log('Name', localStorage.getItem('name'))
    console.log('Email', localStorage.getItem('email'))
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">CozyHaven</span>
            <img
              className="h-8 w-auto"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              alt="Logo"
            />
          </a>
          <h2 className='font-semibold text-gray-1000'> CozyHaven </h2>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <PopoverGroup className="hidden lg:flex lg:gap-x-12 text-gray-900">
          <a href="/user/dashboard" className="text-sm font-semibold text-gray-900">Home</a>
          <a href="/SearchHotelResults" className="text-sm font-semibold text-gray-900">All Hotels</a>
          <a href="/my-bookings" className="text-sm font-semibold text-gray-900">My Bookings</a>
        </PopoverGroup>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-gray-900">
              {username}
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </PopoverButton>
            <PopoverPanel className="absolute right-0 z-50 mt-3 w-48 rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5">
              <div className="p-2">
                {userLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      if (item.isLogout) {
                        e.preventDefault()
                        handleLogout()
                      }
                    }}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <item.icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
        </div>
      </nav>
    </header>
  )
}
