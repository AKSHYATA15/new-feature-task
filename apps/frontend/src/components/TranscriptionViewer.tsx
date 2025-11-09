import React from "react"

export type TranscriptionSegment = {
  id: string
  timestamp: string
  text: string
  startTime: number
}

// Dummy data from your reference file
const dummyTranscriptions: TranscriptionSegment[] = [
  {
    "id": "1",
    "timestamp": "00:00",
    "text": "Hi, this is Ashwini. Welcome back to another video. If you are preparing for an interview, whether you are a fresher or experienced, these questions will definitely help you.",
    "startTime": 0
  },
  {
    "id": "2",
    "timestamp": "00:26",
    "text": "I have not taken these questions from anywhere or by looking on the internet. These are from my own experience, from the interviews I have taken or given.",
    "startTime": 26
  },
  {
    "id": "3",
    "timestamp": "00:54",
    "text": "With such good feedback, we have come up with another Java Full Stack 2.0 course. If you want to learn Java and don’t know it, this course will give you complete in-depth knowledge...",
    "startTime": 54
  },
  {
    "id": "14",
    "timestamp": "09:47",
    "text": "An interface is a blueprint of a class with abstract and static methods. Since Java 8, interfaces can have default and static methods. All methods in an interface are public and abstract by default...",
    "startTime": 587
  },
  {
    "id": "15",
    "timestamp": "11:53",
    "text": "The difference between an abstract class and an interface is that an abstract class can have both abstract and concrete methods, while interfaces traditionally only had abstract methods...",
    "startTime": 713
  },
]

export type TranscriptionViewerProps = {
  onSeekTo?: (timestamp: number) => void
}

const TranscriptionViewer: React.FC<TranscriptionViewerProps> = ({
  onSeekTo,
}) => {
  return (
    <div className="relative w-full h-full">
      <div className="space-y-4 p-4 overflow-y-auto h-full">
        {dummyTranscriptions.map((entry) => (
          <div
            key={entry.id}
            onClick={() => onSeekTo?.(entry.startTime)}
            className="hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl p-4 cursor-pointer transition-all duration-200 border border-gray-200"
          >
            <div className="space-y-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium bg-gray-100 text-gray-700 rounded-full px-3 py-1 w-fit">
                  {entry.timestamp}
                </span>
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                  {entry.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TranscriptionViewer