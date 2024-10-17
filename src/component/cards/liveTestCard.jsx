import React, { useEffect, useState } from 'react'
import Button1 from '../buttons/button1/button1';
import { FaShare } from "react-icons/fa";
import { format } from "date-fns";

const LiveTestCard = ({testData, value}) => {
  // const targetTimestamp = 1727270640;
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Clean up the timer on component unmount
  }, []);

  useEffect(() => {
    if(String(timeLeft.hours).padStart(2, '0') == '00' && String(timeLeft.minutes).padStart(2, '0') == '00' && String(timeLeft.seconds).padStart(2, '0') == '00') {
      setIsTimeUp(true)
    }
    else {
      setIsTimeUp(false)
    }
  }, [timeLeft])

  function calculateTimeLeft() {
    const currentTime = Math.floor(Date.now() / 1000); // Get current Unix time in seconds
    const difference = testData.start_date - currentTime;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((difference % (60 * 60)) / 60);
    const seconds = difference % 60;

    return { hours, minutes, seconds };
  }

// console.log('Countdown:',String(timeLeft.hours).padStart(2, '0'), ':' , String(timeLeft.minutes).padStart(2, '0'), ':', String(timeLeft.seconds).padStart(2, '0'))

  const formatDate = (value) => {
    const cr_date = new Date(value * 1000);
    if (cr_date) {
      // setDate(cr_date.toString().substring(0, cr_date.toString().indexOf('GMT')))
      return (format(cr_date, "d MMM yyyy | h:mm a"));
    }
  }

  const handleResultTest = (val, index) => {
    var firstAttempt = "0";
    if (val.state == ""){
      firstAttempt = "1";
    }
    // // else if (App.Server_Time.ToUnixTimeSeconds() > long.Parse(Current_Selected_Resource.end_date)){
    // //   firstAttempt = "0";
    // // }
    else if (Number(val.is_reattempt) > 0){
      firstAttempt = "0";
    }
    const formData = {
      jwt : localStorage.getItem('jwt'),
      user_id: localStorage.getItem('user_id'),
      course_id: val?.course_id,
      test_id: val?.id,
      lang: val?.lang_used ? val?.lang_used : 1,
      state: val?.state ? val?.state : 0,
      test_type: val?.test_type,
      first_attempt: firstAttempt
    }
  
    console.log("formData",formData)
    const encryptData = btoa(JSON.stringify(formData))
    console.log('encryptData',encryptData)
    // const encryptData = encrypt(JSON.stringify(formData));
    window.open(`https://educryptnetlify.videocrypt.in/webstaging/web/LiveTest/learn_result_window?data=${encryptData}`,  'popupWindow', `width=${windowSize.width},height=${windowSize.height},scrollbars=yes,resizable=no`)
  }

  const handleTakeTest = (val) => {
    let firstAttempt = "0";
    if (val.state == "")
      {
          firstAttempt = "1";
      }
      // else if (App.Server_Time.ToUnixTimeSeconds() > long.Parse(Current_Selected_Resource.end_date))
      // {
      //     firstAttempt = "0";
      // }
      else if (Number(val.is_reattempt) > 0)
      {
          firstAttempt = "0";
      }
    const formData = {
      jwt : localStorage.getItem('jwt'),
      user_id: localStorage.getItem('user_id'),
      course_id: val?.course_id,
      test_id: val?.id,
      lang: val?.lang_used ? val?.lang_used : 1,
      state: val?.state ? val?.state : 0,
      test_type: val?.test_type,
      first_attempt: firstAttempt
    }

    console.log("formData",formData)
    const encryptData = btoa(JSON.stringify(formData))
    console.log('encryptData',encryptData)

    window.open(`https://educryptnetlify.videocrypt.in/webstaging/web/LiveTest/attempt_now_window?data=${encryptData}`,  'popupWindow', `width=${windowSize.width},height=${windowSize.height},scrollbars=yes,resizable=no`)
  }

  const handleRankTest = (val) => {
    const formData = {
      jwt : localStorage.getItem('jwt'),
      user_id: localStorage.getItem('user_id'),
      course_id: val?.course_id,
      test_id: val?.id,
      lang: val?.lang_used ? val?.lang_used : 1,
      state: val?.state ? val?.state : 0,
      test_type: val?.test_type,
      first_attempt: 1
    }
    console.log("formData",formData)
    const encryptData = btoa(JSON.stringify(formData))
    console.log('encryptData',encryptData)

    window.open(`https://educryptnetlify.videocrypt.in/webstaging/web/LiveTest/result_window?data=${encryptData}`, 'popupWindow', `width=${windowSize.width},height=${windowSize.height},scrollbars=yes,resizable=no`)
  }

  return (
    <div className="d-flex justify-content-center col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4 p-0">
      <div className="card border-0 shadow b-radius course_card m-0">
        {value == 'LIVE' && <p className={`m-0 course-badge ${value}`}>Live</p>}
        {value == 'UPCOMING' && <p className={`m-0 course-badge ${value}`}>Upcoming</p>}
        <div className="w-100 imgBorder d-flex align-items-center justify-content-center">
            <img
              style={{ borderRadius: "10px" }}
              src={testData?.image ? testData.image : '/assets/images/noImage.jfif'}
              className="card-img-top"
              alt="..."
            />
        </div>
        <div className="card-body pt-3 px-0 pb-0">
            <h6 className='mb-0 slideTitle'>{testData.test_series_name}</h6>
            <h6 className="m-0">{testData.course_name}</h6>
        </div>
        <p className="my-2 d-flex align-items-center validity">
            <img
                className="calendarDate2 me-1"
                src="/assets/images/calenderLogo2.png"
                alt=""
            />
            start On:
            <span className="ms-2 valid_date">{formatDate(testData.start_date)}</span>
        </p>
        <p className="d-flex align-items-center validity">
            <img
                className="calendarDate2 me-1"
                src="/assets/images/clockLogo.png"
                alt=""
            />
            End On:
            <span className="ms-2 valid_date">{formatDate(testData.end_date)}</span>
        </p>
        <hr className="dotted-divider" />
        <div className="myCourseBtn d-flex flex-wrap flex-lg-nowrap gap-2">
            {value == 'LIVE' &&
              <Button1
                value="Attempt Now"
                handleClick={() => handleTakeTest(testData)}
                data= {0}
              />
            }
            {value == 'UPCOMING' &&
              <Button1
                value={isTimeUp ? `Start Test` : `Started In- ${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
                handleClick={() => handleTakeTest(testData)}
                data= {0}
              />
            }
            {value == 'COMPLETED' && 
              <Button1
              value={testData?.state == 1 ? `View Result` : `Leaderboard`}
              handleClick={() => testData?.state ? handleResultTest(testData): handleRankTest(testData)}
              data={0}
            />
            }
            <button className="btn_detailShare">
              <FaShare />
            </button>
            {/* <Button2 value="Extend Validity" handleClick={handleExplore} /> */}
          </div>
      </div>
    </div>
  )
}

export default LiveTestCard