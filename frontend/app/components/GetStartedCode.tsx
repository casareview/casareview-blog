'use client'

import {useState} from 'react'

export default function GetStartedCode() {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(
      'npm create sanity@latest -- --template sanity-io/sanity-template-nextjs-clean',
    )
    setShowTooltip(true)
    setTimeout(() => setShowTooltip(false), 2000)
  }

  return (
    <div className="flex flex-col md:inline-flex md:flex-row rounded-xl md:rounded-full shadow-xl md:whitespace-nowrap text-center bg-gray-900 p-4 md:pr-2 md:pl-6 md:py-2 text-white text-sm lg:text-base mt-6 font-mono gap-4 items-center selection:bg-blue selection:text-white">
     

    </div>
  )
}
