import React, { useState, useEffect } from 'react';
import VideoPlayerDRM from '@/component/player';
import { useRouter } from 'next/router';

const PlayId = () => {
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });
    const router = useRouter();
    console.log("router?.query",router?.query)
    useEffect(() => {
        // Ensure this code runs only on the client side
        if (typeof window !== 'undefined') {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });

            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };

            window.addEventListener('resize', handleResize);

            // Clean up the event listener on component unmount
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    const renderPlayer = () => {
        switch (parseInt(router?.query?.video_type)) {
            case 7:
            case 8:
                return (
                    <VideoPlayerDRM
                        vdc_id={router?.query?.vdc_id}
                        NonDRMVideourl={router?.query?.file_url}
                        item={null}
                        title={router?.query?.title}
                        videoMetaData={null}
                    />
                );
            default:
                switch (parseInt(router?.query?.video_type)) {
                    case 1:
                    case 4:
                        return (
                            <iframe
                                id="youtubePlayer"
                                width={windowSize.width}
                                height={windowSize.height-10}
                                src={`https://www.youtube.com/embed/${router?.query?.file_url}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        );
                    default:
                        return <p>No supported video format found.</p>
                }
        }
    };

    return (
        <>
            {renderPlayer()}
        </>
    );
};

export default PlayId;
