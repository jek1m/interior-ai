"use client"

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import { UserDetailContext } from './_context/UserDetailContext'

function Provider({ children }) {
  const { user } = useUser()
  const [userDetail, setUserDetail] = useState(null)

  useEffect(() => {
    if (user) {
      VerifyUser()
    }
  }, [user])

  const VerifyUser = async () => {
    const dataResult = await axios.post('/api/verify-user', {
      userName: user?.fullName,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      userImage: user?.imageUrl,
    })

    setUserDetail(dataResult.data.result)
  }

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        }}
      >
        {children}
      </PayPalScriptProvider>
    </UserDetailContext.Provider>
  )
}

export default Provider