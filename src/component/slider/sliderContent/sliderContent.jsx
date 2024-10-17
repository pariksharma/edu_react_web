import React from "react";
import Button1 from "../../buttons/button1/button1";
import { useRouter } from "next/router";
import { IoStar } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import Button2 from "@/component/buttons/button2/button2";

const SliderContent = ({ freeCourse, titleName }) => {
  const router = useRouter();
  // console.log('title111', titleName)
  // console.log('router', router.pathname.startsWith('/private/myProfile'))

  const handleExplore = () => {
    if(router.pathname.startsWith('/private/myProfile')){
      router.push(
        `/private/myProfile/detail/${
          titleName + ":" + freeCourse.id + "&" + freeCourse.combo_course_ids+'parent:'
        }`
      );
    }
    else {
      router.push(
        `/view-courses/details/${
          titleName + ":" + freeCourse.id + "&" + freeCourse.combo_course_ids+'parent:'
        }`
      );
    }
  };

  const handleBuy = () => {
    localStorage.setItem('previousTab', router.pathname);
    router.push(`/view-courses/course-order/${titleName +":" + freeCourse.id +"&" }`)
  }

  return (
    <div className="card border-0 shadow b-radius mb-3 freeCard">
      {
        <img
          style={{ borderRadius: "10px" }}
          src={
            titleName === "Related Course"
              ? freeCourse.desc_header_image
              : freeCourse.cover_image
              ? freeCourse.cover_image
              : "https://picsum.photos/536/354"
          }
          className="card-img-top"
          alt="..."
        />
      }

      {/* <div className="m-0 free-badge">FREE</div> */}
      <div className="card-body pt-2 px-0 pb-0">
        <h6 className="slideTitle">{freeCourse.title}</h6>
        {/* <div className="m-0 clearfix">
                    <div className="countTitle"><i className="fab fa-youtube"></i> 120 videos</div>
                    <div className="countTitle ms-3"><i className="far fa-file-alt"></i> 40 PDF's</div>
                </div> */}
        <div className="courserate">
          <div className="d-flex align-items-center">
            <span className="rating">
              <IoStar />{" "}
              {freeCourse.avg_rating ? parseFloat(freeCourse.avg_rating).toFixed(1) : "0.0"}
            </span>
            <p className="m-0 review">
              {freeCourse.user_rated ? freeCourse.user_rated : 0} Reviews
            </p>
          </div>
          {freeCourse.mrp == 0 && <p className="m-0 freeStripe">Free</p>}
        </div>
        {freeCourse.mrp != 0 && (
          <p className="my-2 d-flex align-items-center validity">
            <img
              className="calendarDate2 me-1"
              src="/assets/images/calendarDate2.svg"
              alt=""
            />
            Validity:
            <span className="ms-2 valid_date">{`${freeCourse.validity}`}</span>
          </p>
        )}
        <hr className="dotted-divider" />
        {freeCourse.mrp != 0 && (
          <div className="coursePrice gap-1 d-flex flex-wrap align-items-center pb-1 m-0">
            {/* <div className="coursePrice d-flex align-items-center pb-2 m-0"> */}
            <p className="m-0 d-flex align-items-center Cost_Price">
              <FaRupeeSign className="rupeeSign" />
              {freeCourse.course_sp}
            </p>
            {freeCourse.course_sp !== freeCourse.mrp && (
              <>
                <p className="m-0 Card-OffPrice">
                  <del>
                    <FaRupeeSign className="rupeeSign2" />
                    {freeCourse.mrp}
                  </del>
                </p>
                {freeCourse.discount && 
                <p className="m-0 offPricePercentage">
                  {`(${freeCourse.discount}% Off)`}
                </p>
                }
              </>
            )}
          </div>
        )}
        {/* <button className="btn exploreBtn">Explore now</button> */}
        {freeCourse.mrp != 0 ?
            <div className="gap-2 d-flex flex-wrap flex-md-wrap flex-lg-nowrap justify-content-between onlineCourseButtons">
                <Button2 value="Explore" handleClick={handleExplore} />
                <Button1 value="Buy Now" handleClick={handleBuy} />
            </div>
        :
        <div className="courseBtn">
            <Button1 value="Explore" handleClick={handleExplore} />
        </div>
        }
        
      </div>
    </div>
  );
};

export default SliderContent;