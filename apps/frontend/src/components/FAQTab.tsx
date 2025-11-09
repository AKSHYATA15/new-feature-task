import React, { useState } from 'react'
import { Lightbulb, Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const faqData = {
  question: "Hey, so what's the big deal about garbage collection in Java? When does it actually kick in?",
  hint: "Think about object lifecycles and memory (heap).",
  answer: "Garbage collection identifies and removes objects no longer in use, freeing up memory. It happens automatically!",
  explanation: "Java's garbage collection is like an automatic cleaner. It identifies objects that your program doesn't need anymore (like variables no longer referenced) and reclaims the memory they were using. This prevents memory leaks and keeps your application running smoothly. It runs in the background, so you typically don't need to worry about manually managing memory!"
}

export function FAQTab() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
    setShowExplanation(false) 
  }

  return (
    <div className="p-6 h-full overflow-y-auto flex items-center justify-center">
      <div 
        className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-sm p-8 cursor-pointer"
        onClick={handleCardClick}
      >
        {!isFlipped ? (
          <div className="flex flex-col min-h-[300px]">
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xl text-center text-gray-700 leading-relaxed">
                {faqData.question}
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <Button variant="ghost" className="text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>
                <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                Hint
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col min-h-[300px]">
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-xl text-center text-gray-800 font-medium leading-relaxed">
                {faqData.answer}
              </p>

              {showExplanation && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6 text-center text-gray-600 text-sm">
                  {faqData.explanation}
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
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Hide Explanation
                  </>
                ) : (
                  <>
                    <Info className="h-4 w-4 mr-2" />
                    Show Explanation
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}