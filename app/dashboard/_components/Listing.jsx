"use client"

import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { db } from '@/config/db'
import { AiGeneratedImage } from '@/config/schema'
import { desc, eq } from 'drizzle-orm'

import RoomDesignCard from './RoomDesignCard'
import AiOutputDialog from '../create-new/_components/AiOutputDialog'

function Listing() {
  const { user } = useUser()
  const [userRoomList, setUserRoomList] = useState([])

  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  useEffect(() => {
    if (user) {
      GetUserRoomList()
    }
  }, [user])

  const GetUserRoomList = async () => {
    const result = await db
      .select()
      .from(AiGeneratedImage)
      .where(
        eq(
          AiGeneratedImage.userEmail,
          user?.primaryEmailAddress?.emailAddress
        )
      )
      .orderBy(desc(AiGeneratedImage.id))

    console.log(result)
    setUserRoomList(result)
  }

  const onRoomClick = (room) => {
    setSelectedRoom(room)
    setOpenDialog(true)
  }

  return (
    <div>
      <div className="mt-10 flex justify-between items-center text-xl font-bold">
        <h2>Hello, {user?.fullName}</h2>

        <Link href="/dashboard/create-new">
          <button className="btn btn-primary">
            + Generate AI Interior
          </button>
        </Link>
      </div>

      {userRoomList?.length === 0 ? (
        <div className="flex justify-center items-center h-full text-2xl text-gray-500 mt-32">
          No Interior AI Designs Generated Yet
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mt-10">
          {userRoomList.map((room, index) => (
            <div
              key={index}
              onClick={() => onRoomClick(room)}
              className="cursor-pointer"
            >
              <RoomDesignCard room={room} />
            </div>
          ))}
        </div>
      )}

      <AiOutputDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        orgImage={selectedRoom?.orgImage}
        aiImage={selectedRoom?.aiImage}
      />
    </div>
  )
}

export default Listing