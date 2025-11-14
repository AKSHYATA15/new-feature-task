import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable" 
import { SummaryPanel } from "@/components/SummaryPanel"
import VideoPlayer, { type VideoPlayerRef } from "@/components/VideoPlayer"
import { useRef } from "react"
import TranscriptionViewer from "@/components/TranscriptionViewer"
import { Sidebar } from "@/components/Sidebar"
import { useDocumentInfo } from "@/hooks/useDocumentData" 
import { Loader2 } from 'lucide-react'
import { PdfViewer } from "./PdfViewer" 

interface AppLayoutProps {
  documentId: string;
}

export function AppLayout({ documentId }: AppLayoutProps) {
  const videoPlayerRef = useRef<VideoPlayerRef>(null)

  const { data: document, isLoading } = useDocumentInfo(documentId)

  const handleSeekTo = (seconds: number) => {
    videoPlayerRef.current?.seekTo(seconds)
  }

  if (isLoading || !document) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  const url = document.sourceUrl || ""
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)
  const videoId = (match && match[2].length === 11) ? match[2] : null

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          
          {document.sourceType === 'youtube' ? (
            <ResizablePanel className="min-h-0 bg-white" minSize={30} defaultSize={45}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="h-full overflow-y-auto p-6">
                    <VideoPlayer
                      ref={videoPlayerRef}
                      videoId={videoId!}
                      videoTitle={document.title || "Video"}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={30}>
                  <TranscriptionViewer 
                    documentId={documentId}
                    sourceType={document.sourceType}
                    onSeekTo={handleSeekTo} 
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          ) : (
            <ResizablePanel className="min-h-0 bg-white" minSize={30} defaultSize={45}>
              <div className="h-full overflow-y-auto">
                <PdfViewer documentId={documentId} />
              </div>
            </ResizablePanel>
          )}
          
          <ResizableHandle withHandle />
          
          <ResizablePanel className="min-h-0" minSize={30} defaultSize={55}>
            <SummaryPanel documentId={documentId} />
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </div>
  )
}