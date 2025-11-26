import React, { useState } from 'react'
import { File, Youtube, Globe } from 'lucide-react'
import { UploadModal } from '@/components/UploadModal'
import { Sidebar } from '@/components/Sidebar'
import { RecentUrl } from '@/components/RecentUrl'

export type UploadType = "pdf" | "youtube" | "website" | null

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadType, setUploadType] = useState<UploadType>(null)

  const openModal = (type: UploadType) => {
    setUploadType(type)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center pt-16 px-8 pb-16 overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-12 border-b-white transform rotate-90"></div>
          </div>
          <h1 className="text-2xl font-semibold text-blue-600">Interview Prepration with AceInt</h1>
        </div>

        {/* Cards Row */}
        <div className="flex gap-4 mb-8">
          {/* PDF Card */}
          <CompactCard
            title="Document"
            subtitle="PDF Only"
            icon={<File className="w-6 h-6 text-gray-500" />}
            onClick={() => openModal("pdf")}
          />
          
          {/* YouTube Card */}
          <CompactCard
            title="Video"
            subtitle="Youtube Video Url"
            icon={<Youtube className="w-6 h-6 text-gray-500" />}
            onClick={() => openModal("youtube")}
          />

          {/* Website Card - Coming Soon */}
          <CompactCard
            title="Website"
            subtitle="Website URL"
            icon={<Globe className="w-6 h-6 text-gray-400" />}
            badge="Coming Soon"
            disabled
            onClick={() => {}}
          />
        </div>

        {/* Input Area */}
        <div className="w-full max-w-3xl bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <input
              type="text"
              placeholder="Ask me for interview tips"
              className="w-full text-gray-700 outline-none text-base"
            />
          </div>
          <div className="px-6 pb-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex gap-2">
              <button className="px-4 py-1.5 text-sm border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50">
                Tips
              </button>
              <button className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-full">
                Guide
              </button>
              <button className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-full">
                Questions
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Default</span>
              <button className="text-blue-500 hover:text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
          <RecentUrl />
      </div>

      {/* The Modal Dialog */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uploadType={uploadType}
      />
    </div>
  )
}

function CompactCard({ 
  title, 
  subtitle, 
  icon, 
  onClick, 
  badge,
  disabled 
}: { 
  title: string
  subtitle: string
  icon: React.ReactNode
  onClick: () => void
  badge?: string
  disabled?: boolean
}) {
  return (
    <div
      className={`bg-white px-6 py-5 rounded-lg border border-gray-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300 hover:shadow-sm'
      } transition-all relative min-w-[140px]`}
      onClick={disabled ? undefined : onClick}
    >
      {badge && (
        <span className="absolute -top-2 -right-2 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <div className="flex flex-col items-center text-center">
        {icon}
        <p className="mt-3 text-sm font-medium text-gray-700">{title}</p>
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  )
}