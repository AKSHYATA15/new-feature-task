import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function SummaryPanel() {
  return (
    <div className="h-full w-full flex flex-col">
      <Tabs defaultValue="summary" className="w-full h-full flex flex-col">
        {/* These are the tab buttons */}
        <TabsList className="mx-4 mt-4 bg-gray-200">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="faq">FAQ's</TabsTrigger>
          <TabsTrigger value="mcq">MCQ</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>

        {/* This is the content for the "Summary" tab */}
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

        {/* This is the content for the "Chat" tab */}
        <TabsContent value="chat" className="flex-1 overflow-y-auto p-6">
          <p>Chat UI will go here.</p>
        </TabsContent>

        {/* This is the content for the "FAQ" tab */}
        <TabsContent value="faq" className="flex-1 overflow-y-auto p-6">
          <p>FAQ content will go here.</p>
        </TabsContent>

        {/* This is the content for the "MCQ" tab */}
        <TabsContent value="mcq" className="flex-1 overflow-y-auto p-6">
          <p>MCQ content will go here.</p>
        </TabsContent>
        
        {/* This is the content for the "Roadmap" tab */}
        <TabsContent value="roadmap" className="flex-1 overflow-y-auto p-6">
          <p>Roadmap content will go here.</p>
        </TabsContent>

      </Tabs>
    </div>
  )
}