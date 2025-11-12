import React from 'react'
import {
  Briefcase,
  Edit,
  FileText,
  MessageSquare,
  Plus,
  Moon,
  ThumbsUp,
  AlertTriangle,
  Crown
} from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-60 shrink-0 bg-white text-gray-700 flex flex-col border-r border-gray-200">
      <div className="p-4 font-bold text-blue-600 text-lg border-b border-gray-200 flex items-center">
        <span className="text-2xl mr-2"></span> {/* You can replace this with a logo image if needed */}
        AceInt
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <a href="#" className="flex items-center p-2 rounded text-gray-700 hover:bg-gray-100 font-medium">
          <Briefcase className="h-5 w-5 mr-3" />
          Interview Practice
        </a>
        <a href="#" className="flex items-center p-2 rounded bg-blue-50 text-blue-600 font-semibold">
          <Edit className="h-5 w-5 mr-3" />
          Interview Prepration
        </a>
        <a href="#" className="flex items-center p-2 rounded text-gray-700 hover:bg-gray-100 font-medium">
          <FileText className="h-5 w-5 mr-3" />
          Enhance Resume
        </a>
        
        <div className="pt-4 mt-4 space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-500 uppercase">New Chat</span>
            <button className="text-gray-400 hover:text-gray-600">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <a href="#" className="flex items-center p-2 rounded text-sm text-gray-500 truncate hover:bg-gray-100">
            <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">Okay, "SDP" could stand for...</span>
          </a>
          <a href="#" className="flex items-center p-2 rounded text-sm text-gray-500 truncate hover:bg-gray-100">
            <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
            New Chat
          </a>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className="flex items-center p-2 rounded text-sm text-gray-600 hover:bg-gray-100 w-full">
          <Moon className="h-4 w-4 mr-2" />
          Dark Mode
        </button>
        <a href="#" className="flex items-center p-2 rounded text-sm text-gray-600 hover:bg-gray-100">
          <ThumbsUp className="h-4 w-4 mr-2" />
          Feedback
        </a>
        <a href="#" className="flex items-center p-2 rounded text-sm text-gray-600 hover:bg-gray-100">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report an Issue
        </a>
        <a href="#" className="flex items-center p-2 rounded text-sm text-gray-600 hover:bg-gray-100">
          <Crown className="h-4 w-4 mr-2" />
          Pricing
        </a>
      </div>
    </div>
  )
}