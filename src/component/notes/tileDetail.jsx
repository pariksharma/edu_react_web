import React, { useEffect, useState } from 'react'
import Button1 from '../buttons/button1/button1'

const TileDetail = ({item, layer1Data, handleRead, handleWatch, handleTakeTest, handleResultTest, handleRankTest, handleUpcomingTest, i}) => {

    const [timeValue, setTimeValue] = useState('')

    let startTime = 1729233585
    // item.start_date
    let endTime = item.end_date

    const compareTime = (startTime, endTime) => {
        // const givenTimestamp = '2024-10-17T10:30:00Z';
        const givenStartTime = new Date(startTime * 1000);
        const givenEndTime = new Date(endTime * 1000);
      
          // Get current time
          const currentTime = new Date();
      
          // Compare times
          if (currentTime < givenStartTime) {
            setTimeValue("pending")
          } else if(currentTime > givenStartTime && currentTime < givenEndTime) {
            setTimeValue("attempt")
          }
           else if(currentTime > givenEndTime) {
            setTimeValue("result")
           }
      }

      useEffect(() => {
        // Immediately call compareTime
        compareTime(startTime   , endTime );
    
        // Set up an interval to call compareTime every 5 seconds (5000 ms)
        const intervalId = setInterval(() => {
            compareTime(startTime   , endTime )
        }, 5000);
    
        // Cleanup the interval when component unmounts
        return () => clearInterval(intervalId);
      }, [startTime , endTime ]);


  return (
    <>
    <div
        className=" pg-tabs-description mt-3"
    //   onClick={() => handleOpenVideo(item)}
    >
        <div className="tabs-deschovr d-flex align-items-center rounded">
        <div className="w-100 pg-sb-topic d-flex align-items-center justify-content-between">
            <div className="d-flex justify-content-between">
            <img
                src={item.thumbnail_url ? item.thumbnail_url : "/assets/images/noImage.jfif"}
                height={"60px"}
            />
            <div className="subjectDetails">
                <p className="m-0 sub_name">{item.title}</p>
                {item.role == "PDF" && (
                <p className="m-0 sub_topics">
                    {item.release_date}
                </p>
                )}
            </div>
            </div>
            <div className="pg-sb-topic pe-2">
            <div className="btnsalltbba text-center d-flex">
                {" "}
                {
                // (isLogin && 
                item.is_purchased == 0 ?
                // item.is_locked == "1" ? 
                // <>
                //   <img style={{ width: "32px" }} src="/assets/images/locked.png" alt="" />
                // </>
                // :
                item.is_locked == 0 ?
                <>
                {layer1Data.type == "pdf" && <Button1 value="Read" handleClick={handleRead} /> }
                {layer1Data.type == "video" && <Button1 value="Watch Now" handleClick={handleWatch(item, i)} />}
                {layer1Data.type == "test" && <Button1 value="Test" />}
                </>
                :
                <>
                    <img style={{ width: "32px" }} src="/assets/images/locked.png" alt="" />
                </>
                :
                <>
                {layer1Data?.type == "pdf" && <Button1 value="Read" handleClick={() => handleRead(item)} /> }
                {layer1Data?.type == "video" && <Button1 value="Watch Now" handleClick={() => handleWatch(item, i)} />}
                {layer1Data?.type == "test" && 
                (timeValue == "pending" &&
                <Button1 value="Upcoming" 
                    handleClick={() => handleUpcomingTest(item, i)} 
                />
                )}
                {layer1Data?.type == "test" && (timeValue == "attempt" &&
                <Button1 value="Attempt Now" 
                    handleClick={() => handleTakeTest(item, i)} 
                />
                )}
                {layer1Data?.type == "test" && (timeValue == "result" &&
                <Button1 value={item?.state == 1 ? "View Result" : "LeaderBoard"}
                    handleClick={() => item?.state == 1 ? handleResultTest(item, i) : handleRankTest(item, i)} 
                />
                )}
                </>
                }
            </div>
            </div>
        </div>
        </div>
    </div>
    </>
  )
}

export default TileDetail