import React from 'react'
import { FileText, Youtube, Clock, Play, List } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface RecentItem {
  id: string
  type: 'document' | 'youtube'
  title: string
  createdAt: string
  status: 'processing' | 'completed' | 'failed'
  previewUrl: string
}

const dummyRecents: RecentItem[] = [
  {
    id: "d38b8b51-499d-4f56-9cc1-c77e604c6821",
    type: "document",
    title: "JS Notes",
    createdAt: "26/11/2025, 11:41:16 am",
    status: "processing",
    previewUrl: "https://aceint-candidates.s3.ap-south-1.amazonaws.com/prep/5f06bc2b-2ee9-4cf3-80a7-f8434b3b6865/documents/1764137477535-d38b8b51-499d-4f56-9cc1-c77e604c6821.pdf"
  },
  {
    id: "a12b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
    type: "youtube",
    title: "Advanced React Patterns",
    createdAt: "25/11/2025, 04:30:00 pm",
    status: "completed",
    previewUrl: "https://youtu.be/bj1EsgZK0RI"
  },
  {
    id: "z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4",
    type: "document",
    title: "System Design Interview Guide",
    createdAt: "24/11/2025, 09:15:00 am",
    status: "completed",
    previewUrl: "https://aceint-candidates.s3.ap-south-1.amazonaws.com/documents/sample.pdf"
  },
  {
    id: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
    type: "youtube",
    title: "Understanding Mixtures in Chemistry",
    createdAt: "23/11/2025, 02:45:00 pm",
    status: "completed",
    previewUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
    type: "youtube",
    title: "Black Holes Explained From Birth to Death",
    createdAt: "22/11/2025, 10:20:00 am",
    status: "completed",
    previewUrl: "https://youtu.be/QqsLTNkzvaY"
  },
  {
    id: "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9",
    type: "document",
    title: "The Map of Chemistry",
    createdAt: "21/11/2025, 03:15:00 pm",
    status: "completed",
    previewUrl: "https://aceint-candidates.s3.ap-south-1.amazonaws.com/documents/chemistry.pdf"
  }
]

export function RecentUrl() {
  const navigate = useNavigate()
  const handleItemClick = (id: string) => {
    navigate(`/prepration/content/${id}`)
  }

  const getThumbnail = (item: RecentItem): string | undefined => {
    if (item.type === 'youtube' && item.previewUrl) {
      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
      const match = item.previewUrl.match(youtubeRegex)
      if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`
      }
    }
    return undefined
  }

  const sortedRecents = [...dummyRecents].sort((a, b) => {
    const dateA = new Date(a.createdAt.replace(/(\d{2})\/(\d{2})\/(\d{4}), (.+)/, '$2/$1/$3 $4'))
    const dateB = new Date(b.createdAt.replace(/(\d{2})\/(\d{2})\/(\d{4}), (.+)/, '$2/$1/$3 $4'))
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="w-full max-w-7xl mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Recents
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {sortedRecents.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
              {getThumbnail(item) ? (
                <img 
                  src={getThumbnail(item)} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {item.type === 'document' ? (
                    <FileText className="w-16 h-16 text-gray-400" />
                  ) : (
                    <Youtube className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              )}
              
              {/* Icon overlay */}
              <div className="absolute bottom-2 left-2">
                <div className={`p-1.5 rounded ${
                  item.type === 'document' ? 'bg-blue-500' : 'bg-red-500'
                }`}>
                  {item.type === 'document' ? (
                    <List className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <StatusBadge status={item.status} />
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500">
                {item.createdAt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <div className="flex justify-center mt-8">
        <button className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
          Show More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'processing') {
    return (
      <span className="px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
        Processing
      </span>
    )
  }
  if (status === 'completed') {
    return (
      <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
        Ready
      </span>
    )
  }
  return (
    <span className="px-2.5 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
      Failed
    </span>
  )
}