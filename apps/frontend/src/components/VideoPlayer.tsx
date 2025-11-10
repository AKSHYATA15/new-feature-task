import { useRef, useImperativeHandle, forwardRef } from "react"

interface VideoPlayerProps {
  videoId: string
  videoTitle: string
}

export interface VideoPlayerRef {
  seekTo: (seconds: number) => void
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
  videoId,
  videoTitle,
}, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`

  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number) => {
      if (iframeRef.current) {
        const message = {
          event: 'command',
          func: 'seekTo',
          args: [seconds, true]
        }
        iframeRef.current.contentWindow?.postMessage(JSON.stringify(message), '*')
      }
    }
  }))

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full aspect-video">
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          className="rounded-lg shadow-lg absolute inset-0"
          src={embedUrl}
          title={videoTitle}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="px-2">
        <h2 className="text-xl font-bold text-neutral-800 mb-2">
          {videoTitle}
        </h2>
      </div>
    </div>
  )
})

VideoPlayer.displayName = 'VideoPlayer'

export default VideoPlayer