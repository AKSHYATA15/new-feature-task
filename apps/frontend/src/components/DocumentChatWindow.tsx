import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

export function DocumentChatWindow() {
  const [userInput, setUserInput] = useState("")

  const messages = [
    {
      id: 1,
      sender: 'bot',
      time: '09:47',
      text: 'An interface is a blueprint of a class with abstract and static methods. Since Java 8, interfaces can have default and static methods. All methods in an interface are public and abstract by default, and variables are public, static, and final. A class implementing an interface must provide implementations for all abstract methods.',
    },
    {
      id: 2,
      sender: 'bot',
      time: '11:53',
      text: 'The difference between an abstract class and an interface is that an abstract class can have both abstract and concrete methods, while interfaces traditionally only had abstract methods (until Java 8 introduced default and static methods). A class can extend only one abstract class but implement multiple interfaces. Interfaces can only extend other interfaces.',
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Message Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="flex">
            <div className="flex flex-col items-center mr-4 shrink-0">
              <span className="text-xs font-medium text-gray-500">{msg.time}</span>
            </div>
            <div className="bg-white p-4 rounded-r-lg rounded-bl-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-800">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Send a message..."
            className="flex-1"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}