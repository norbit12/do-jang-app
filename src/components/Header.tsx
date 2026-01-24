'use client'
import Image from "next/image"
import Link from "next/link"
import Button from "./ui/Button"
import { useEffect, useState } from "react"
import AuthModal from "./AuthModal"
import { supabase } from "@/lib/supabaseClient"
import { FaUser } from "react-icons/fa"
import { FiLogOut } from "react-icons/fi"
import { useRef } from "react"

export default function Header() {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user.email ?? null)
        setMenuOpen(false)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuOpen])

  return (
    <>
      <div className="flex sticky top-0 z-50 px-4 md:px-0 h-20 bg-white">
        <div className="md:max-w-md w-full md:mx-auto flex items-center relative">
          <Link href="/" className="flex items-center w-fit">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="w-8 select-none"
            />
            <h1 className="font-bold text-2xl ml-2 header-logo text-black">
              DoJang
            </h1>
          </Link>

          {userEmail ? (
            <div className="ml-auto relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-slate-400 bg-slate-200 h-8 w-8 aspect-square flex items-center justify-center outline-none focus-visible:ring-2 ring-slate-200 duration-200 rounded-full"
                aria-label="User menu"
              >
                <FaUser className="text-base" />
              </button>

              <div
                className={`absolute right-0 top-full mt-1 w-42 overflow-hidden bg-white border border-slate-200 rounded-md shadow-lg z-10 transform transition duration-200 ease-out
                ${
                  menuOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }
                `}
              >
                <div className="px-4 py-2 text-sm text-slate-700 border-b border-slate-100">
                  <p>{userEmail}</p>
                </div>
                <button
                  onClick={handleLogout}
                  tabIndex={menuOpen ? 0 : -1}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 focus-visible:bg-red-50 duration-200 bg-white text-red-600 select-none flex items-center outline-none"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Button
              variant="secondary"
              className="ml-auto"
              onClick={() => setOpen(true)}
            >
              Login
            </Button>
          )}
        </div>
      </div>

      <AuthModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}