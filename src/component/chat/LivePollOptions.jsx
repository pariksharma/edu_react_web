import React, { useEffect, useState } from 'react'
import { format } from "date-fns";
// import { TiInputChecked } from "react-icons/ti";
import { get, onValue, ref } from 'firebase/database';

const LivePollOptions = ({poll, renderCountdown, index, handleSubmitAnswer, database, chat_node, getFireBaseKey}) => {

    const [selectedOptions, setSelectedOptions] = useState({})
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [selectAnswer, setSelectAnswer] = useState(false)
    const [myAnswer, setMyAnswer] = useState('')
    const [answerSelect, setAnswerSelect] = useState(false)

    useEffect(() => {
      const fetchAlreadySubmit = async () => {
        const result = await alreadySubmit();
        setAlreadySubmitted(result); // Update the state with the result
      };
  
      fetchAlreadySubmit();
    }, [poll]);

    const formatTime = (date) => {
        // console.log('data', date);
          const cr_date = new Date(date);
          if (cr_date) {
            return format(cr_date, "h:mm a");
          }
        };

        const handleOptionChange = (pollId, option) => {
            // console.log('pollId, option', pollId, option)
            let selectedAnswer = "";
            if(option == "option_1") {
                selectedAnswer = '1'
                setAnswerSelect(true)
            }
            else if(option == "option_2") {
                selectedAnswer = '2'
                setAnswerSelect(true)
            }
            else if(option == "option_3") {
                selectedAnswer = '3'
                setAnswerSelect(true)
            }
            else if(option == "option_4") {
                selectedAnswer = '4'
                setAnswerSelect(true)
            }
            setSelectAnswer(true)
            handleSubmitAnswer(poll, selectedAnswer)

            setSelectedOptions((prev) => ({
              ...prev,
              [pollId]: option, // Update the selected option for the specific poll
            }));
          };

          const alreadySubmit = async () => {
            try {
              const appId = localStorage.getItem("appId"); 
              const userId = localStorage.getItem("user_id"); 
              const userName = localStorage.getItem("userName");
              const firebaseId = getFireBaseKey(poll.id)
              // console.log('firebaseId', firebaseId)
              const alreadySubmitRef = ref(
                database,
                `${appId}/chat_master/${chat_node}/Poll/${firebaseId}/users/${userId}`
              );
              const snapshot = await get(alreadySubmitRef); // 
              const alreadySubmitValue = snapshot.val();
                // console.log('alreadySubmitValue', alreadySubmitValue)
              setMyAnswer(alreadySubmitValue)
              return !!alreadySubmitValue;
            } catch (error) {
              console.log('error found', error)
            }
          }


  return (
    <div className="card mb-2" style={{width: "100%"}} key={index}>
      <div className="d-flex justify-content-between align-items-center card-header bg-white">
        <div className="m-0">
          <h5 className="m-0 l_title">{poll?.question}</h5>
          <p className="m-0 j_title">{poll?.date && formatTime(poll?.date)}</p>
        </div>
        <div className="hl_timer">
          <p className="m-0 d-flex l_timer">
            <i className="bi bi-clock-history me-1"></i>{" "}
            <span className="history_timer m-0">{renderCountdown(poll?.valid_till)}</span>
          </p>
        </div>
        <button className="leader-btn" style={{display:"none"}}>
          Leaderboard
        </button>
      </div>
      <div className='card-body'>
        {['option_1', 'option_2', 'option_3', 'option_4'].map((optionKey, idx) => {
            const optionValue = poll[optionKey];
            if (!optionValue) return null; // Skip empty options

            const attemptKey = `attempt_${idx + 1}`;
            const attemptValue = poll[attemptKey] ? parseInt(poll[attemptKey], 10) : 0;

            // Calculate the total attempts from all attempt keys
            const totalAttempts = ['attempt_1', 'attempt_2', 'attempt_3', 'attempt_4']
            .reduce((acc, key) => acc + (parseInt(poll[key], 10) || 0), 0);

            // Calculate percentage for the current attempt
            const percentage = totalAttempts > 0 ? ((attemptValue / totalAttempts) * 100).toFixed(2) : 0;
            // {console.log('alreadySubmitted', alreadySubmitted, poll.id)}
            return (
              <div className={`radio-1`} key={idx}>
                {myAnswer?.answer != idx + 1 ? (
                  selectedOptions[poll?.id] != optionKey ? (
                    <input
                      id={`radio-${poll?.id}-${idx + 1}`}
                      className="radio-custom"
                      name={`radio-group-${poll?.id}`}
                      type="radio"
                      disabled = {!!selectedOptions[poll?.id]}
                      value={optionKey}
                      checked={selectedOptions[poll?.id] === optionKey} // Mark as checked if selected
                      onChange={() =>
                        renderCountdown(poll?.valid_till) != "Expired" &&
                        !alreadySubmitted &&
                        handleOptionChange(poll?.id, optionKey)
                      } // Handle selection
                    />
                  ) : (
                    // <TiInputChecked />
                    <svg
                      style={{ marginRight: "10px" }}
                      width="17"
                      height="15"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_6830_5483)">
                        <path
                          d="M-2.74316e-05 7.96885C0.0435264 7.65775 0.076188 7.33421 0.132186 7.01845C0.457711 5.1316 1.42078 3.41356 2.86053 2.1513C4.10572 1.01956 5.66837 0.297412 7.33725 0.0824933C9.40226 -0.21666 11.5045 0.26715 13.231 1.43888C13.308 1.49067 13.3741 1.55711 13.4254 1.63442C13.4767 1.71173 13.5123 1.7984 13.5302 1.88947C13.548 1.98054 13.5477 2.07423 13.5294 2.16519C13.511 2.25616 13.4749 2.34262 13.4231 2.41963C13.3713 2.49664 13.3049 2.56269 13.2276 2.61403C13.1503 2.66536 13.0636 2.70095 12.9725 2.71879C12.8815 2.73663 12.7878 2.73636 12.6968 2.71799C12.6058 2.69962 12.5194 2.66351 12.4424 2.61173C11.6618 2.08342 10.7807 1.72175 9.85403 1.54933C7.63745 1.15579 5.64485 1.66132 3.91825 3.10482C2.61108 4.17722 1.7522 5.69969 1.51035 7.3731C1.3364 8.38066 1.38895 9.41431 1.66419 10.399C1.93943 11.3838 2.43044 12.2949 3.10162 13.0662C4.17729 14.3774 5.70399 15.2395 7.38234 15.4834C8.5546 15.6698 9.75491 15.5585 10.8729 15.1598C11.9909 14.7611 12.9908 14.0878 13.7807 13.2018C14.5705 12.3158 15.125 11.2454 15.3932 10.0891C15.6613 8.93285 15.6346 7.72771 15.3154 6.58446C15.1894 6.13648 15.3932 5.74293 15.796 5.64027C15.8857 5.61566 15.9794 5.60913 16.0716 5.62105C16.1639 5.63297 16.2528 5.66311 16.3333 5.70972C16.4138 5.75633 16.4842 5.81847 16.5404 5.89254C16.5966 5.9666 16.6376 6.05111 16.6609 6.14115C17.0229 7.38868 17.0924 8.7029 16.8639 9.98165C16.6354 11.2604 16.1151 12.4692 15.3434 13.5142C14.6847 14.4251 13.8495 15.1941 12.8875 15.7756C11.9254 16.3571 10.8563 16.7391 9.74359 16.8989C9.50405 16.9363 9.26295 16.9627 9.0234 16.9938H7.961C7.75257 16.9689 7.54569 16.9456 7.3388 16.9161C5.55849 16.6666 3.90243 15.8612 2.60691 14.6148C1.31139 13.3685 0.442578 11.7448 0.12442 9.97544C0.0684219 9.66435 0.0357414 9.34235 -0.0078125 9.02503L-2.74316e-05 7.96885Z"
                          fill="#FF7426"
                        />
                        <path
                          d="M8.50193 8.94655C8.57193 8.861 8.60926 8.80657 8.65748 8.7599C11.0156 6.40073 13.3737 4.04104 15.7319 1.68084C15.8245 1.57039 15.948 1.49009 16.0866 1.45019C16.2251 1.41029 16.3724 1.41261 16.5096 1.45685C16.618 1.49157 16.7164 1.55216 16.7961 1.63337C16.8759 1.71459 16.9347 1.814 16.9675 1.92302C17.0002 2.03204 17.006 2.14739 16.9842 2.25913C16.9624 2.37086 16.9138 2.47562 16.8425 2.56436C16.8005 2.6157 16.7523 2.66236 16.7056 2.70902L9.08369 10.3309C8.6777 10.7369 8.30594 10.7354 7.89529 10.3309L5.19651 7.63217C5.12404 7.56916 5.06514 7.49206 5.02341 7.40557C4.98169 7.31907 4.95801 7.22499 4.9538 7.12905C4.9496 7.03311 4.96496 6.93732 4.99896 6.84751C5.03295 6.7577 5.08487 6.67575 5.15154 6.60664C5.21822 6.53753 5.29827 6.48271 5.38681 6.44552C5.47534 6.40834 5.57053 6.38956 5.66656 6.39033C5.76258 6.3911 5.85744 6.4114 5.94538 6.45001C6.03331 6.48861 6.11245 6.5447 6.17802 6.61487C6.84999 7.28062 7.51938 7.94897 8.18616 8.6199C8.29038 8.70701 8.38061 8.81278 8.50193 8.94655Z"
                          fill="#FF7426"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_6830_5483">
                          <rect width="17.0016" height="17" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  )
                ) : (
                  // <TiInputChecked />
                  <svg
                    style={{ marginRight: "10px" }}
                    width="17"
                    height="15"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_6830_5483)">
                      <path
                        d="M-2.74316e-05 7.96885C0.0435264 7.65775 0.076188 7.33421 0.132186 7.01845C0.457711 5.1316 1.42078 3.41356 2.86053 2.1513C4.10572 1.01956 5.66837 0.297412 7.33725 0.0824933C9.40226 -0.21666 11.5045 0.26715 13.231 1.43888C13.308 1.49067 13.3741 1.55711 13.4254 1.63442C13.4767 1.71173 13.5123 1.7984 13.5302 1.88947C13.548 1.98054 13.5477 2.07423 13.5294 2.16519C13.511 2.25616 13.4749 2.34262 13.4231 2.41963C13.3713 2.49664 13.3049 2.56269 13.2276 2.61403C13.1503 2.66536 13.0636 2.70095 12.9725 2.71879C12.8815 2.73663 12.7878 2.73636 12.6968 2.71799C12.6058 2.69962 12.5194 2.66351 12.4424 2.61173C11.6618 2.08342 10.7807 1.72175 9.85403 1.54933C7.63745 1.15579 5.64485 1.66132 3.91825 3.10482C2.61108 4.17722 1.7522 5.69969 1.51035 7.3731C1.3364 8.38066 1.38895 9.41431 1.66419 10.399C1.93943 11.3838 2.43044 12.2949 3.10162 13.0662C4.17729 14.3774 5.70399 15.2395 7.38234 15.4834C8.5546 15.6698 9.75491 15.5585 10.8729 15.1598C11.9909 14.7611 12.9908 14.0878 13.7807 13.2018C14.5705 12.3158 15.125 11.2454 15.3932 10.0891C15.6613 8.93285 15.6346 7.72771 15.3154 6.58446C15.1894 6.13648 15.3932 5.74293 15.796 5.64027C15.8857 5.61566 15.9794 5.60913 16.0716 5.62105C16.1639 5.63297 16.2528 5.66311 16.3333 5.70972C16.4138 5.75633 16.4842 5.81847 16.5404 5.89254C16.5966 5.9666 16.6376 6.05111 16.6609 6.14115C17.0229 7.38868 17.0924 8.7029 16.8639 9.98165C16.6354 11.2604 16.1151 12.4692 15.3434 13.5142C14.6847 14.4251 13.8495 15.1941 12.8875 15.7756C11.9254 16.3571 10.8563 16.7391 9.74359 16.8989C9.50405 16.9363 9.26295 16.9627 9.0234 16.9938H7.961C7.75257 16.9689 7.54569 16.9456 7.3388 16.9161C5.55849 16.6666 3.90243 15.8612 2.60691 14.6148C1.31139 13.3685 0.442578 11.7448 0.12442 9.97544C0.0684219 9.66435 0.0357414 9.34235 -0.0078125 9.02503L-2.74316e-05 7.96885Z"
                        fill="#FF7426"
                      />
                      <path
                        d="M8.50193 8.94655C8.57193 8.861 8.60926 8.80657 8.65748 8.7599C11.0156 6.40073 13.3737 4.04104 15.7319 1.68084C15.8245 1.57039 15.948 1.49009 16.0866 1.45019C16.2251 1.41029 16.3724 1.41261 16.5096 1.45685C16.618 1.49157 16.7164 1.55216 16.7961 1.63337C16.8759 1.71459 16.9347 1.814 16.9675 1.92302C17.0002 2.03204 17.006 2.14739 16.9842 2.25913C16.9624 2.37086 16.9138 2.47562 16.8425 2.56436C16.8005 2.6157 16.7523 2.66236 16.7056 2.70902L9.08369 10.3309C8.6777 10.7369 8.30594 10.7354 7.89529 10.3309L5.19651 7.63217C5.12404 7.56916 5.06514 7.49206 5.02341 7.40557C4.98169 7.31907 4.95801 7.22499 4.9538 7.12905C4.9496 7.03311 4.96496 6.93732 4.99896 6.84751C5.03295 6.7577 5.08487 6.67575 5.15154 6.60664C5.21822 6.53753 5.29827 6.48271 5.38681 6.44552C5.47534 6.40834 5.57053 6.38956 5.66656 6.39033C5.76258 6.3911 5.85744 6.4114 5.94538 6.45001C6.03331 6.48861 6.11245 6.5447 6.17802 6.61487C6.84999 7.28062 7.51938 7.94897 8.18616 8.6199C8.29038 8.70701 8.38061 8.81278 8.50193 8.94655Z"
                        fill="#FF7426"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_6830_5483">
                        <rect width="17.0016" height="17" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                )} 
                
                <label
                  htmlFor={`radio-${poll?.id}-${idx + 1}`}
                  className="radio-custom-label"
                >
                  {optionValue}
                </label>
                <div className="progress">
                  <div
                    className={
                      (alreadySubmitted || selectAnswer) &&
                      parseInt(poll?.answer) == idx + 1
                        ? `progress-bar-1`
                        : ``
                    }
                    style={{
                      width: `${
                        (alreadySubmitted || selectAnswer) && percentage
                      }%`,
                    }}
                  ></div>
                </div>
                <div
                  style={{ float: "right" }}
                  className={`progress-percent-1`}
                >
                  {(alreadySubmitted || selectAnswer) && `${percentage}%`}
                </div>
              </div>
            );
        })}
      </div>
    </div>
  )
}

export default LivePollOptions