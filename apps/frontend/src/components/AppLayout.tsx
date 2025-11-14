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

interface AppLayoutProps {
  documentId: string;
}

export function AppLayout({ documentId }: AppLayoutProps) {
  const videoPlayerRef = useRef<VideoPlayerRef>(null)

  const handleSeekTo = (seconds: number) => {
    videoPlayerRef.current?.seekTo(seconds)
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        
        {/* Left Panel */}
        <ResizablePanel
          className="min-h-0 bg-white"
          minSize={30}
          defaultSize={45}
        >
          <ResizablePanelGroup direction="vertical">

            {/* Top (Video) */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full overflow-y-auto p-6">
                <VideoPlayer
                  ref={videoPlayerRef}
                  videoId="O5xeyoRL95U"
                  videoTitle="10 Java Interview Questions & Answers"
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Bottom (Transcript) */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <TranscriptionViewer onSeekTo={handleSeekTo} />
            </ResizablePanel>

          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel */}
        <ResizablePanel className="min-h-0" minSize={30} defaultSize={55}>
          <SummaryPanel documentId={documentId} />
        </ResizablePanel>

      </ResizablePanelGroup>
      </div>
    </div>
  )
}