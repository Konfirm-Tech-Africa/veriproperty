import React, { Suspense } from 'react'
import PropertyPage from './PropertyPage'

const page = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
      <PropertyPage />
    </Suspense>
  )
}

export default page