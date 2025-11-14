import React, { useState} from 'react'
import { useMCQs } from '../hooks/useDocumentData' // 1. Import the hook
import { Loader2, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MCQTabProps {
  documentId: string;
}

type Option = {
  id: string;
  text: string;
}

export function MCQTab({ documentId }: MCQTabProps) {
  const { data: mcqs, isLoading, error } = useMCQs(documentId)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error || !mcqs || mcqs.length === 0) {
    return (
      <div className="p-6 text-red-500">
        <AlertTriangle className="h-6 w-6 mr-2 inline" />
        Error loading MCQs: {error?.message || "No MCQs found."}
      </div>
    )
  }

  const currentQuestion = mcqs[currentIndex]

  const handleOptionClick = (optionId: string) => {
    if (isSubmitted) return
    setSelectedOption(optionId)
  }

  const handleSubmit = () => {
    if (!selectedOption) return
    setIsSubmitted(true)
  }

  const goToNext = () => {
    setIsSubmitted(false)
    setSelectedOption(null)
    setCurrentIndex((prev) => (prev + 1) % mcqs.length)
  }

  const goToPrev = () => {
    setIsSubmitted(false)
    setSelectedOption(null)
    setCurrentIndex((prev) => (prev - 1 + mcqs.length) % mcqs.length)
  }

  const getOptionClass = (option: Option) => {
    if (!isSubmitted) {
      return selectedOption === option.id 
        ? "bg-blue-100 border-blue-300 ring-2 ring-blue-200" 
        : "border-gray-200 hover:bg-gray-50"
    }
    
    if (option.id === currentQuestion.correctOption) {
      return "bg-green-100 border-green-300 text-green-800 font-medium ring-2 ring-green-200"
    }
    if (selectedOption === option.id && option.id !== currentQuestion.correctOption) {
      return "bg-red-100 border-red-300 text-red-800 font-medium ring-2 ring-red-200"
    }
    return "border-gray-200"
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Let's check how much you prepared!
      </h2>
      
      {/* Quiz Content */}
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-4">
            {currentIndex + 1}. {currentQuestion.question}
          </h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border",
                  "transition-all duration-150",
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

        {/* Explanation Box */}
        {isSubmitted && (
          <div className={cn(
            "p-4 rounded-lg",
            selectedOption === currentQuestion.correctOption
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          )}>
            <h4 className="font-semibold text-lg">
              {selectedOption === currentQuestion.correctOption ? "Correct!" : "Incorrect"}
            </h4>
            <p className="text-sm text-gray-700 mt-2">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Actions & Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={goToPrev} disabled={currentIndex === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <span className="text-sm font-medium text-gray-500">
            {currentIndex + 1} / {mcqs.length}
          </span>

          {isSubmitted ? (
            <Button onClick={goToNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!selectedOption}>
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}