import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { DocumentChatWindow } from "@/components/DocumentChatWindow"
import { MCQTab } from "@/components/MCQTab" 
import { FAQTab } from "@/components/FAQTab"
import { NotesTab } from "@/components/NotesTab"
import {
  BookText,
  MessageSquare,
  HelpCircle,
  ClipboardCheck,
  Network,
  StickyNote
} from "lucide-react"
import { RoadmapTab } from "@/components/RoadmapTab"
import { SummaryTab } from "@/components/SummaryTab"

interface SummaryPanelProps {
  documentId: string;
}

export function SummaryPanel({ documentId }: SummaryPanelProps) {
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
          <SummaryTab documentId={documentId} />
        </TabsContent>

        <TabsContent value="chat" className="flex-1 overflow-hidden">
          <DocumentChatWindow />
        </TabsContent>

        <TabsContent value="faq" className="flex-1 overflow-y-auto p-6">
          <FAQTab documentId={documentId} />
        </TabsContent>

        <TabsContent value="mcq" className="flex-1 overflow-hidden">
          <MCQTab documentId={documentId} />
        </TabsContent>
        
        <TabsContent value="roadmap" className="flex-1 overflow-y-auto p-6">
          <RoadmapTab documentId={documentId} />
        </TabsContent>

        <TabsContent value="notes" className="flex-1 overflow-y-auto p-6">
          <NotesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}