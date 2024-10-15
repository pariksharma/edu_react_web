import React from "react";
import Button1 from "../buttons/button1/button1";
import Button2 from "../buttons/button2/button2";
import { IoStar } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { useRouter } from "next/router";

const content_image = "/assets/images/slideImg.png";
const content_title = "Selection Hi Jawab Hai Something Special For VCAINS";

const Card1 = ({ value, titleName, handleDetail, keyValue }) => {
  // console.log('ti', titleName)
  const router = useRouter();

  const handleExplore = () => {
    localStorage.setItem('mainTab', keyValue)
    console.log('helll')
    router.push(
      `/view-courses/details/${
        titleName + ":" + value.id + "&" + value.combo_course_ids + 'parent:'
      }`
    );
  };

  const handleBuy = () => {
    localStorage.setItem('previousTab', router.pathname);
    router.push(
      `/view-courses/course-order/${
        titleName + ":" + value.id + "&" + value.combo_course_ids
      }`
    );
  };

  // console.log('value', value)

  const handleAddToCart = () => {
    console.log("add to cart");
  };
  return (
    <div className="d-flex justify-content-center col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4 p-0">
      <div className="card border-0 shadow b-radius course_card m-0">
        {value.mrp == 0 && <p className="m-0 course-badge">FREE</p>}
        {(titleName == "Bookstore" || titleName == "e-BOOK" ? (
            <div className="w-100 imgBorder d-flex align-items-center justify-content-center">
            <img
              style={{ borderRadius: "10px" }}
              src={value.cover_image ? value.cover_image : '/assets/images/noImage.jfif'}
              className="card-img-top bookStoreImg"
              alt="..."
            />
            </div>
          ) : (
            <img
              style={{ borderRadius: "10px" }}
              src={value.cover_image ? value.cover_image : '/assets/images/noImage.jfif'}
              className="card-img-top"
              alt="..."
            />
          ))}
        <div className="card-body pt-3 px-0 pb-0">
          <h6 className="mb-0 slideTitle">{value.title}</h6>
          <div className="courserate">
            <div className="d-flex align-items-center">
                <span className="rating">
                  <IoStar /> {value.avg_rating ? parseFloat(value.avg_rating).toFixed(1) : "0.0"}
                </span>
                  <p className="m-0 review">
                    {value.user_rated ? value.user_rated : 0} reviews
                  </p>
            </div>
          </div>
          {(titleName != "Bookstore") && 
            titleName != "e-BOOK" &&
          <p className="my-2 d-flex align-items-center validity">
            <img
              className="calendarDate2 me-1"
              src="/assets/images/calendarDate2.svg"
              alt=""
            />
            Validity:
            <span className="ms-2 valid_date">{`${value.validity}`}</span>
          </p>
          }
              <hr className="dotted-divider" />

          {value.mrp != 0 ? (
            <div className="coursePrice gap-1 d-flex flex-wrap align-items-center pb-1 m-0">
              {/* <div className="coursePrice d-flex align-items-center pb-2 m-0"> */}
                <p className="m-0 d-flex align-items-center Cost_Price">
                  <FaRupeeSign className="rupeeSign" />
                  {value.course_sp}
                </p>
                {value.course_sp !== value.mrp && (
                  <>
                    <p className="m-0 Card-OffPrice">
                      <del>
                      <FaRupeeSign className="rupeeSign2" />
                      {value.mrp}
                      </del>
                    </p>
                    <p className="m-0 offPricePercentage">
                      {`(${value.discount}% Off)`}
                    </p>
                  </>
                )}
              </div>
          )
          :
          <div className="coursePrice gap-1 d-flex flex-wrap align-items-center pb-1 m-0">
              <p className="m-0 d-flex align-items-center Cost_Price">
                Free
              </p>
            </div>
          }
          {titleName == "Bookstore" ? 
            <div className="courseBtn gap-2 d-flex">
            <Button2 value="Explore" handleClick={() => 
              router.pathname.startsWith('/private') ? handleDetail(value, titleName, keyValue) : handleExplore()} />
              <Button1 value="Buy Now" handleClick={handleBuy} />
          </div>
          :
          (value.mrp == 0 || value.is_purchased == 1) ? (
              <div className="courseBtn gap-2 d-flex">
                <Button1 value="Explore" handleClick={() => 
                  router.pathname.startsWith('/private') ? handleDetail(value, titleName, keyValue) : handleExplore()} />
                  {/* <Button1 value="Buy Now" handleClick={handleBuy} /> */}
              </div>
            ) : (
              <div className="position-relative">
                  <div className="gap-2 d-flex flex-wrap flex-md-wrap flex-lg-nowrap justify-content-between onlineCourseButtons">
                  {titleName == "e-BOOK" || titleName == "Bookstore" ? (
                    <Button2 value="Explore" handleClick={() => 
                      router.pathname.startsWith('/private') ? handleDetail(value, titleName, keyValue) : handleExplore()} />
                  ) : (
                    <Button2 value="Explore" handleClick={() => 
                      router.pathname.startsWith('/private') ? handleDetail(value, titleName, keyValue) : handleExplore()} />
                  )}
                  <Button1 value="Buy Now" handleClick={handleBuy} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Card1;
