import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable" 
import { SummaryPanel } from "@/components/SummaryPanel"

function App() {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gray-100">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        
        {/* Left Panel */}
        <ResizablePanel
          className="min-h-0 bg-white" 
          minSize={30}
          defaultSize={45}
        >
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Left Panel (Viewer)</span>
          </div>
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