"use client"

import React, { useContext } from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { UserDetailContext } from '@/app/_context/UserDetailContext'

function Header() {
  const { userDetail } = useContext(UserDetailContext)

  return (
    <div className="navbar bg-base-100 px-5">
      <div className="flex-1">
        <Link href="/">
          <button className="btn btn-ghost text-xl">
            Interior AI
          </button>
        </Link>
      </div>

      <div className="flex-none gap-2">
        <Link href="/dashboard/buy-credits">
          <button className="btn btn-primary">
            Buy More Credits
          </button>
        </Link>

        <button className="btn">
          {userDetail?.credits ?? 0} Credits left
        </button>

        <UserButton />
      </div>
    </div>
  )
}

export default Header