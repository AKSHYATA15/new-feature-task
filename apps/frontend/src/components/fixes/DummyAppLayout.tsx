import {
    ResizablePanel,
    ResizablePanelGroup,
    ResizableHandle,
} from "@/components/ui/resizable"
import { Sidebar } from "@/components/Sidebar"
import NewPdfViewer from "@/components/fixes/NewPdfViewer.tsx";


export function DummyAppLayout() {

    return (
        <div className="h-screen w-full flex overflow-hidden bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <ResizablePanelGroup direction="horizontal" className="h-full w-full">

                    { (
                        <ResizablePanel className="min-h-0 bg-white" minSize={30} defaultSize={45}>
                            <div className="h-full overflow-y-auto">
                                <NewPdfViewer />
                            </div>
                        </ResizablePanel>
                    )}

                    <ResizableHandle withHandle />

                    <ResizablePanel className="min-h-0" minSize={30} defaultSize={55}>
                        {/*<SummaryPanel documentId={documentId} />*/}
                        <div>
                            Summary Panel
                        </div>
                    </ResizablePanel>

                </ResizablePanelGroup>
            </div>
        </div>
    )
}



