import ReactPlayer from 'react-player';

export default function VideoPlayer() {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-2xl">
      <ReactPlayer
        url="/video.mov"
        width="100%"
        height="auto"
        controls={true}
        playing={false}
        light={false}
        loop={false}
        className="aspect-video"
      />
    </div>
  );
} 