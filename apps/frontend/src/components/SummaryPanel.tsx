import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { DocumentChatWindow } from "@/components/DocumentChatWindow"
import { MCQTab } from "@/components/MCQTab" 
import { FAQTab } from "@/components/FAQTab"
import {
  BookText,
  MessageSquare,
  HelpCircle,
  ClipboardCheck,
  Network,
  StickyNote
} from "lucide-react"
import { RoadmapTab } from "@/components/RoadmapTab"

export function SummaryPanel() {
  return (
    <div className="h-full w-full flex flex-col">
      <Tabs defaultValue="summary" className="w-full h-full flex flex-col">
        <TabsList className="mx-4 mt-4 bg-gray-200">
          <TabsTrigger value="summary">
            <BookText className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ'S
          </TabsTrigger>
          <TabsTrigger value="mcq">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            MCQ
          </TabsTrigger>
          <TabsTrigger value="roadmap">
            <Network className="h-4 w-4 mr-2" />
            Roadmap
          </TabsTrigger>
          <TabsTrigger value="notes">
            <StickyNote className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="summary"
          className="flex-1 overflow-y-auto p-6 text-sm"
        >
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              This document summarizes key differences between Java interfaces
              and abstract classes, crucial concepts for object-oriented
              programming and interview preparation.
            </p>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base">
                1. Java Interfaces
              </h3>
              <p className="mb-2">
                <strong>Definition:</strong> A blueprint for a class, defining
                abstract and static methods. Since Java 8, interfaces can
                also have default methods.
              </p>
              <p className="mb-2">
                <strong>Method Characteristics:</strong> By default, methods
                are <strong>public</strong> and <strong>abstract</strong>.
                Variables are <strong>public</strong>, <strong>static</strong>,
                and <strong>final</strong>.
              </p>
              <p>
                <strong>Implementation:</strong> A class implementing an interface
                must provide implementations for all abstract methods.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base">
                2. Abstract Classes
              </h3>
              <p className="mb-2">
                <strong>Definition:</strong> Can contain both abstract (methods
                without implementation) and concrete (implemented) methods.
              </p>
              <p>
                <strong>Inheritance:</strong> A class can extend only one
                abstract class.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="flex-1 overflow-hidden">
          <DocumentChatWindow />
        </TabsContent>

        <TabsContent value="faq" className="flex-1 overflow-y-auto p-6">
          <FAQTab />
        </TabsContent>

        <TabsContent value="mcq" className="flex-1 overflow-hidden">
          <MCQTab />
        </TabsContent>
        
        <TabsContent value="roadmap" className="flex-1 overflow-y-auto p-6">
          <RoadmapTab />
        </TabsContent>

        <TabsContent value="notes" className="flex-1 overflow-y-auto p-6">
          <p>Notes content will go here.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}