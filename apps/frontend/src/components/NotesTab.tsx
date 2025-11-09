import React from 'react'

export function NotesTab() {
  return (
    <div className="p-6 h-full">
      <textarea
        className="w-full h-full p-4 rounded-lg border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your notes here... Your notes will be saved automatically."
      />
    </div>
  )
}