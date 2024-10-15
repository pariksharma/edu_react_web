import { useEffect, useState, useRef } from 'react';

const VideoJsPlayer = () => {
  const videoRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure the code only runs on the client side
    if (typeof window !== 'undefined') {
      setIsClient(true); // We are now on the client side
      if (videoRef.current) {
        const shaka = require('shaka-player/dist/shaka-player.compiled.js');
        const player = new shaka.Player(videoRef.current);
        player.addEventListener('error', onError);
        player.load('http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8')
          .then(() => console.log('Video has been loaded successfully'))
          .catch((error) => console.error('Error while loading the video', error));

        return () => {
          if (player) {
            player.destroy();
          }
        };
      }
    }
  }, []);

  const onError = (error) => {
    console.error('Shaka Player Error', error);
  };

  return (
    <div>
      {/* Render a placeholder during SSR */}
      {isClient ? (
        <video ref={videoRef} width="640" controls autoPlay style={{ maxWidth: '100%' }} />
      ) : (
        <div style={{ width: '640px', height: '360px', background: '#000' }}>
          <p style={{ color: '#fff', textAlign: 'center', paddingTop: '150px' }}>Loading Player...</p>
        </div>
      )}
    </div>
  );
};

export default VideoJsPlayer;
