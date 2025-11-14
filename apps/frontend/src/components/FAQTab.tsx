import React, { useState } from 'react'
import { useFAQs } from '../hooks/useDocumentData' 
import { Loader2, AlertTriangle, Lightbulb, Info, X, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FAQTabProps {
  documentId: string;
}

export function FAQTab({ documentId }: FAQTabProps) {
  const { data: faqs, isLoading, error } = useFAQs(documentId)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error || !faqs || faqs.length === 0) {
    return (
      <div className="p-6 text-red-500">
        <AlertTriangle className="h-6 w-6 mr-2 inline" />
        Error loading FAQs: {error?.message || "No FAQs found."}
      </div>
    )
  }

  const goToNext = () => {
    setIsFlipped(false)
    setShowExplanation(false)
    setCurrentIndex((prev) => (prev + 1) % faqs.length)
  }

  const goToPrev = () => {
    setIsFlipped(false)
    setShowExplanation(false)
    setCurrentIndex((prev) => (prev - 1 + faqs.length) % faqs.length)
  }

  const currentCard = faqs[currentIndex]

  return (
    <div className="p-6 h-full overflow-y-auto flex flex-col items-center justify-center">
      {/* The Flashcard */}
      <div 
        className={cn(
          "w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-sm p-8 cursor-pointer",
          "transition-transform duration-500 transform-3d",
          isFlipped && "transform-[rotateY(180deg)]"
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Card Front (Question) */}
        <div className="flex flex-col min-h-[300px] backface-hidden">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl text-center text-gray-700 leading-relaxed">
              {currentCard.question}
            </p>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
            <Button variant="ghost" className="text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>
              <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
              Hint
            </Button>
            <span className="text-sm text-gray-400">Click to flip</span>
          </div>
        </div>

        {/* Card Back (Answer) */}
        <div className="flex flex-col min-h-[300px] backface-hidden transform-[rotateY(180deg)] absolute top-0 left-0 w-full h-full p-8">
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-xl text-center text-gray-800 font-medium leading-relaxed">
              {currentCard.answer}
            </p>

            {showExplanation && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6 text-center text-gray-600 text-sm">
                {currentCard.explanation}
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-100 pt-4 flex justify-end">
            <Button
              variant="ghost"
              className="text-sm text-gray-600"
              onClick={(e) => {
                e.stopPropagation() 
                setShowExplanation(!showExplanation)
              }}
            >
              {showExplanation ? (
                <><X className="h-4 w-4 mr-2" /> Hide Explanation</>
              ) : (
                <><Info className="h-4 w-4 mr-2" /> Show Explanation</>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between w-full max-w-2xl mt-6">
        <Button variant="outline" onClick={goToPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm font-medium text-gray-500">
          {currentIndex + 1} / {faqs.length}
        </span>
        <Button variant="outline" onClick={goToNext}>
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}