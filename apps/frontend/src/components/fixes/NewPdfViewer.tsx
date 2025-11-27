import { useState, useEffect, useMemo, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
    ArrowLeft,
    ArrowRight,
    ListChecks as ListChecksIcon,
    SquareStack as SquareStackIcon, SparklesIcon, Brain,
} from "lucide-react";
import { PiMagnifyingGlassMinusLight, PiMagnifyingGlassPlusLight} from "react-icons/pi";

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;



const NewPdfViewer = () => {

    const fileData = "https://aceint-candidates.s3.ap-south-1.amazonaws.com/prep/5f06bc2b-2ee9-4cf3-80a7-f8434b3b6865/documents/1764137477535-d38b8b51-499d-4f56-9cc1-c77e604c6821.pdf"

    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedText, setSelectedText] = useState<string>("");
    const [scale, setScale] = useState<number>(0.85);
    const [showSelectionPopover, setShowSelectionPopover] = useState<boolean>(false);
    const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const pageRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        if (numPages) {
            pageRefs.current = Array(numPages)
            .fill(null)
            .map((_, i) => pageRefs.current[i] || null);
        }
    }, [numPages]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            const text = selection.toString().trim();
            if (text) {
                setSelectedText(text);
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const popupWidth = 280;
                const viewportWidth = window.innerWidth;
                let x = rect.left + rect.width / 2 - popupWidth / 2;
                if (x < 10) x = 10;
                if (x + popupWidth > viewportWidth - 10) x = viewportWidth - popupWidth - 10;
                setSelectionPosition({ x, y: rect.top + window.scrollY - 50 });
                setShowSelectionPopover(true);
            }
        } else {
            setShowSelectionPopover(false);
            setSelectedText("");
        }
    };

    const handleSelectionAction = async (action: 'chat' | 'explain' | 'mcq' | 'faq' | 'summary' | 'mindmap') => {
        if (action === 'chat') {
            try {
                await navigator.clipboard.writeText(selectedText);
            } catch (err) {
                console.log(err)

            }
        }
        setShowSelectionPopover(false);
        setTimeout(() => {
            setSelectedText("");
            window.getSelection()?.removeAllRanges();
        }, 200);
    };

    const scrollToPage = (pageNum: number) => {
        const pageEl = pageRefs.current[pageNum - 1];
        if (pageEl) {
            pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
            setCurrentPage(pageNum);
        }
    };

    const previousPage = () => {
        if (currentPage > 1) scrollToPage(currentPage - 1);
    };

    const nextPage = () => {
        if (numPages && currentPage < numPages) scrollToPage(currentPage + 1);
    };

    const zoomIn = () => setScale((prev) => prev + 0.1);
    const zoomOut = () => setScale((prev) => (prev > 0.5 ? prev - 0.1 : prev));

    const documentOptions = useMemo(() => ({ disableStream: true }), []);





    return (
        <div className="flex flex-col  ">
            <Card className=" overflow-hidden  border-none  bg-transparent ml-2 shadow-lg">
                <CardContent className="p-4 h-screen bg-red-500 flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b border-dashed pb-4">
                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={previousPage} disabled={currentPage <= 1}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={nextPage}
                                disabled={currentPage >= (numPages || 1)}
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={zoomOut}><PiMagnifyingGlassMinusLight /></Button>
                            <span className="flex items-center text-sm">{Math.round(scale * 100)}%</span>
                            <Button variant="outline" size="sm" onClick={zoomIn}><PiMagnifyingGlassPlusLight /></Button>
                        </div>
                    </div>

                    <div
                        className="overflow-auto w-full flex flex-col items-center"
                        onMouseUp={handleTextSelection}
                        onDoubleClick={handleTextSelection}
                        style={{ maxHeight: "calc(100vh)" }}
                    >
                        <Document
                            file={fileData}
                            onLoadSuccess={onDocumentLoadSuccess}
                            options={documentOptions}
                            className="cursor-text relative mx-auto scrollbar-hidden"
                        >
                            {Array.from(new Array(numPages), (_, index) => (
                                <div
                                    key={`page_wrapper_${index + 1}`}
                                    ref={(el) => { if (el) pageRefs.current[index] = el; }}
                                    className="mb-4"
                                >
                                    <Page
                                        pageNumber={index + 1}
                                        scale={scale}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={false}
                                    />
                                </div>
                            ))}
                        </Document>

                        {showSelectionPopover && selectedText && (
                            <div
                                className="absolute z-50 rounded-xl px-1 flex gap-1 py-1 shadow-xl border
                                bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
                                style={{
                                    left: selectionPosition.x,
                                    top: selectionPosition.y,
                                    transform: "translate(-50%, -10%)",
                                }}
                            >
                                {/*<Button size="sm" variant="ghost" onClick={() => handleSelectionAction('chat')}>*/}
                                {/*    <MessageCircleMore className="w-4 h-4" />*/}
                                {/*    <span>Chat</span>*/}
                                {/*</Button>*/}
                                {/*<Button size="sm" variant="ghost" onClick={() => handleSelectionAction('explain')}>*/}
                                {/*    <BookOpenIcon className="w-4 h-4" />*/}
                                {/*    <span>Explain</span>*/}
                                {/*</Button>*/}
                                <Button size="sm" variant="ghost" onClick={() => handleSelectionAction('summary')}>
                                    <SparklesIcon className="w-4 h-4" />
                                    <span>Summary</span>
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleSelectionAction('mcq')}>
                                    <ListChecksIcon className="w-4 h-4" />
                                    <span>MCQ</span>
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleSelectionAction('faq')}>
                                    <SquareStackIcon className="w-4 h-4" />
                                    <span>FAQ</span>
                                </Button>
                                <Button size="sm" className={``} variant="ghost" onClick={() => handleSelectionAction('mindmap')}>
                                    <Brain className="w-4 h-4" />
                                    <span>Mindmap</span>
                                </Button>

                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default NewPdfViewer;
