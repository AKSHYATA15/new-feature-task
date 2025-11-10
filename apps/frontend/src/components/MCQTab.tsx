import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Option = {
  id: string
  text: string
}

const mcqData = {
  question: "What type of Java applets are restricted from accessing or executing local system files?",
  options: [
    { id: "A", text: "Trusted applets" },
    { id: "B", text: "Untrusted applets" },
    { id: "C", text: "Signed applets" },
    { id: "D", text: "Local applets" },
  ],
  correctAnswer: "B"
}

export function MCQTab() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleOptionClick = (optionId: string) => {
    if (isSubmitted) return
    setSelectedOption(optionId)
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  const getOptionClass = (option: Option) => {
    if (!isSubmitted) {
      return selectedOption === option.id ? "bg-blue-100 border-blue-300" : "border-gray-200"
    }
    
    if (option.id === mcqData.correctAnswer) {
      return "bg-green-100 border-green-300 text-green-800"
    }
    if (selectedOption === option.id && option.id !== mcqData.correctAnswer) {
      return "bg-red-100 border-red-300 text-red-800"
    }
    return "border-gray-200"
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Let's check how much you prepared!
      </h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-4">
            1. {mcqData.question}
          </h3>
          <div className="space-y-3">
            {mcqData.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border",
                  "hover:bg-gray-50 transition-colors duration-150",
                  getOptionClass(option)
                )}
                disabled={isSubmitted}
              >
                <span className="font-medium text-gray-500 mr-2">{option.id}.</span>
                <span className="text-gray-800">{option.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button 
            variant="secondary" 
            onClick={handleSubmit}
            disabled={!selectedOption || isSubmitted}
          >
            Submit
          </Button>
          <Button 
            variant="default"
            disabled={!isSubmitted}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}