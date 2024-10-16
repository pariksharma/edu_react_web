import React, { useState, useEffect } from 'react';
import { FaLocationArrow } from "react-icons/fa";
import { useRouter } from 'next/navigation'
import Button2 from '@/component/buttons/button2/button2';
import { userLoggedIn } from '@/utils/helpers';


const SliderTrend = ({value, titleName}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showBtn, setShowBtn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter()
  // console.log('props11111', value)

  useEffect(() => {
    setIsClient(true);
    const login = userLoggedIn();
    if(login) {
      setIsLoggedIn(true)
    }
    else{
      setIsLoggedIn(false)
    }
  });

  const handleBuy = () => {
    localStorage.setItem('previousTab', router.pathname);
    router.push(`/view-courses/course-order/${titleName+':'+value.id + "&" + value.combo_course_ids}`)
  }

  const handleExplore = () => {
    router.push(`/view-courses/details/${titleName+':'+value.id + "&" + value.combo_course_ids+'parent:'}`)
  }



  return (
    <div className="d-flex justify-content-center">
      <div 
        className="card trendCard border-0 b-radius mb-3 p-0 tredingSliderSection" 
      >
        {/* <div className="m-0 trendStripe">Best Seller</div> */}
        {/* {isClient && showBtn && ( */}
          {/* <div className='explorebtn'>
            <Button2 value={"Buy"} handleClick={handleBuy} />
          </div> */}
        {value.cover_image && (
          <img 
            style={{borderRadius: "10px"}} 
            src={value.cover_image} 
            className="card-img-top" 
            alt="..." 
          />
        )}
        {/* {console.log('value', value)} */}
        <div className="trendBtnCont">
          <div className="mt-1 gap-2 d-flex align-items-center">
            {/* {value.is_purchased == 0  ?
              (value.mrp == 0  ? 
                <button className="btn buyBtn" onClick={() => handleExplore()}>Explore</button>
              :
                <>
                <button className={`btn ${value.is_purchased != 0 ?  'buyBtn' : 'exploreBtn'}`} onClick={() => handleExplore()}>Explore</button>
                {value.is_purchased == 0 && <button className="btn buyBtn" onClick={() => handleBuy()}>Buy Now</button>}
              </>
              )
            :
            <>
              <button className="btn exploreBtn" onClick={() => handleExplore()}>Explore</button>
              <button className="btn buyBtn" onClick={() => handleBuy()}>Buy Now</button>
            </> 
          } */}
          {value.mrp == 0 ? 
            <button className="btn buyBtn" onClick={() => handleExplore()}>Explore</button>
            :
            (isLoggedIn ? <>
                <button className={`btn ${value.is_purchased == 0 ? 'exploreBtn' : 'buyBtn'} `} onClick={() => handleExplore()}>Explore</button>
                {value.is_purchased == 0 && <button className="btn buyBtn" onClick={() => handleBuy()}>Buy Now</button>}
              </>
              :
              <>
                <button className="btn exploreBtn" onClick={() => handleExplore()}>Explore</button>
                <button className="btn buyBtn" onClick={() => handleBuy()}>Buy Now</button>
              </>
            )
          }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderTrend;
