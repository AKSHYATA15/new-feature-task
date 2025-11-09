import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable" 
import { SummaryPanel } from "@/components/SummaryPanel"
import VideoPlayer from "@/components/VideoPlayer"
import { useRef } from "react"
import TranscriptionViewer from "@/components/TranscriptionViewer"

function App() {
  const videoPlayerRef = useRef(null)

  const handleSeekTo = (seconds: number) => {
    console.log(`Seeking to ${seconds}s`)
  }
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gray-100">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        
        {/* Left Panel */}
        {/* Left Panel */}
        <ResizablePanel
          className="min-h-0 bg-white"
          minSize={30}
          defaultSize={45}
        >
          {/* We create a NEW vertical group for the video and transcript */}
          <ResizablePanelGroup direction="vertical">

            {/* Top (Video) */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="flex h-full items-center justify-center p-6">
                <VideoPlayer
                  ref={videoPlayerRef}
                  videoId="M20S_eGf-wQ"
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
          <SummaryPanel />
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  )
}

export default App