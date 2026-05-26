import { NextResponse } from 'next/server'
import Replicate from 'replicate'
import axios from 'axios'

import { storage } from '@/config/firebaseConfig'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'

import { db } from '@/config/db'
import { AiGeneratedImage, Users } from '@/config/schema'
import { eq } from 'drizzle-orm'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const ConvertImageToBase64 = async (imageUrl) => {
  const resp = await axios.get(imageUrl, {
    responseType: 'arraybuffer',
  })

  const base64ImageRaw = Buffer.from(resp.data).toString('base64')

  return `data:image/png;base64,${base64ImageRaw}`
}

export async function POST(request) {
  try {
    const {
      imageUrl,
      roomType,
      designType,
      additionalReq,
      userEmail,
    } = await request.json()

    const input = {
      image: imageUrl,
      prompt: `A ${roomType} with a ${designType} style interior. ${additionalReq || ''}`,
    }

    const output = await replicate.run(
      'adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38',
      { input }
    )

    const outputUrl =
      typeof output?.url === 'function'
        ? output.url().toString()
        : Array.isArray(output)
        ? output[0].toString()
        : output.toString()

    console.log('Replicate Output URL:', outputUrl)

    const base64Image = await ConvertImageToBase64(outputUrl)

    const fileName = Date.now() + '_ai.png'
    const storageRef = ref(storage, 'interior-ai/' + fileName)

    await uploadString(storageRef, base64Image, 'data_url')

    const downloadUrl = await getDownloadURL(storageRef)

    console.log('AI Image Firebase URL:', downloadUrl)

    const dbResult = await db
      .insert(AiGeneratedImage)
      .values({
        roomType: roomType,
        designType: designType,
        orgImage: imageUrl,
        aiImage: downloadUrl,
        userEmail: userEmail,
      })
      .returning({
        id: AiGeneratedImage.id,
      })

    console.log('DB Insert Result:', dbResult)

    let updatedUser = null

    if (userEmail) {
      const currentUser = await db
        .select()
        .from(Users)
        .where(eq(Users.email, userEmail))

      console.log('Current User:', currentUser)

      if (currentUser.length > 0) {
        const currentCredits = Number(currentUser[0].credits)
        const updatedCredits = currentCredits - 1

        const creditResult = await db
          .update(Users)
          .set({
            credits: updatedCredits,
          })
          .where(eq(Users.email, userEmail))
          .returning({
            id: Users.id,
            name: Users.name,
            email: Users.email,
            imageUrl: Users.imageUrl,
            credits: Users.credits,
          })

        console.log('Credit Update Result:', creditResult)

        if (creditResult.length > 0) {
          updatedUser = creditResult[0]
        }
      }
    }

    return NextResponse.json({
      result: downloadUrl,
      dbResult: dbResult,
      userDetail: updatedUser,
    })
  } catch (e) {
    console.log('Interior AI Error:', e)

    return NextResponse.json({
      error: e.message,
    })
  }
}