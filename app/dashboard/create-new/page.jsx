"use client"

import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'

import ImageSelection from './_components/ImageSelection'
import RoomType from './_components/RoomType'
import DesignType from './_components/DesignType'
import AdditionalReq from './_components/AdditionalReq'
import CustomLoading from './_components/CustomLoading'
import AiOutputDialog from './_components/AiOutputDialog'

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/config/firebaseConfig'

import { UserDetailContext } from '@/app/_context/UserDetailContext'

function CreateNew() {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [aiOutputImage, setAiOutputImage] = useState()
  const [openOutputDialog, setOpenOutputDialog] = useState(false)
  const [orgImage, setOrgImage] = useState()

  const { user } = useUser()
  const { setUserDetail } = useContext(UserDetailContext)

  const onHandleInputChange = (value, fieldName) => {
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [fieldName]: value,
      }

      console.log('formData:', updatedData)
      return updatedData
    })
  }

  const saveRawImageToFirebase = async () => {
    const fileName = Date.now() + '_raw.png'
    const imageRef = ref(storage, 'interior-ai/' + fileName)

    await uploadBytes(imageRef, formData.image)

    console.log('File Uploaded...')

    const downloadUrl = await getDownloadURL(imageRef)

    console.log('Raw Image URL:', downloadUrl)

    setOrgImage(downloadUrl)

    return downloadUrl
  }

  const generateAIImage = async () => {
    if (!formData.image) {
      alert('이미지를 선택해주세요.')
      return
    }

    if (!formData.roomType) {
      alert('Room Type을 선택해주세요.')
      return
    }

    if (!formData.designType) {
      alert('Design Type을 선택해주세요.')
      return
    }

    setLoading(true)

    try {
      const rawImageUrl = await saveRawImageToFirebase()

      const result = await axios.post('/api/interior-ai', {
        imageUrl: rawImageUrl,
        roomType: formData.roomType,
        designType: formData.designType,
        additionalReq: formData.additionalReq,
        userEmail: user?.primaryEmailAddress?.emailAddress,
      })

      console.log('AI result:', result.data)

      setAiOutputImage(result.data.result)

      if (result.data.userDetail) {
        setUserDetail(result.data.userDetail)
      }

      setOpenOutputDialog(true)
    } catch (error) {
      console.log('Generate Error:', error)
      alert('이미지 생성 중 오류가 발생했습니다. 콘솔을 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2
        style={{
          color: 'purple',
          fontWeight: 'bold',
          fontSize: '2.5rem',
          textAlign: 'center',
        }}
      >
        Create AI Interior
      </h2>

      {loading ? (
        <CustomLoading />
      ) : (
        <div className="grid grid-cols-2 gap-8 p-6">
          <div>
            <ImageSelection
              selectedFile={(value) =>
                onHandleInputChange(value, 'image')
              }
            />
          </div>

          <div>
            <RoomType
              selectedRoomType={(value) =>
                onHandleInputChange(value, 'roomType')
              }
            />

            <DesignType
              selectedDesignType={(value) =>
                onHandleInputChange(value, 'designType')
              }
            />

            <AdditionalReq
              additionalReqInput={(value) =>
                onHandleInputChange(value, 'additionalReq')
              }
            />

            <button
              onClick={generateAIImage}
              className="btn btn-primary w-full mt-3"
            >
              Generate
            </button>

            <p className="text-xs text-gray-500 mt-1">
              Each generation costs one credit
            </p>
          </div>
        </div>
      )}

      <AiOutputDialog
        openDialog={openOutputDialog}
        setOpenDialog={setOpenOutputDialog}
        orgImage={orgImage}
        aiImage={aiOutputImage}
      />
    </div>
  )
}

export default CreateNew