import React, { useState, useEffect, useRef } from "react";
import Header from "../../../component/header/header";
import Footer from "../../../component/footer/footer";
import { LiaYoutube } from "react-icons/lia";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaShare } from "react-icons/fa";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useRouter } from "next/router";
import { get_token, isValidData, encrypt, decrypt, userLoggedIn } from "@/utils/helpers";
import { IoStar } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import CourseDetail from "@/component/courseDetail/courseDetail";
import Card3 from "@/component/cards/card3";
import { freeTransactionService, getCourseDetail_Service, getCourseReviewService, getFPaymentService } from "@/services";
import Button1 from "@/component/buttons/button1/button1";
import Notes from "@/component/notes/notes";
import LoginModal from "@/component/modal/loginModal";
import { useSelector } from 'react-redux';
import ThankyouModal from "@/component/modal/thankyouModal";
import Loader from "@/component/loader";
import ComboCourse from "@/component/comboCourse/comboCourse";


// const tiles = ["Course Detail", "Course Curriculum", "PDF's", "Group Chat"];

const ViewOnlineCourseDetail = () => {
  const [modalShow, setModalShow] = useState(false);
  const [thankYouModalShow, setThankYouModalShow] = useState(false)
  const [showError, setShowError] = useState(false);
  const [tiles, setTiles] = useState([]);
  const [key, setKey] = useState(null);
  const [onlineCourseAry, setOnlineCourseAry] = useState("");
  const [relateCourseAry, setRelateCourseAry] = useState("");
  const [courseDetail, setCourseDetail] = useState("");
  const [pdfData, setPdfData] = useState("");
  const [videoData, setVideoData] = useState("");
  const [id, setId] = useState("");
  const [titleName, setTitleName] = useState("");
  // const [courseCombo, setCourseCombo] = useState("");
  const [reviewShow, setReviewShow] = useState('');

  const resetLayerRef = useRef();
  const router = useRouter();
  const { onlineCourseDetailID } = router.query;
  const token = get_token();
  const reviewData = useSelector((state) => state.allCategory?.review)
  const displayTabData = useSelector((state) => state.allCategory?.tabName)
  
  // console.log("onlineCourseDetailID============", onlineCourseDetailID);
  // const id = onlineCourseDetailID?.slice(onlineCourseDetailID.indexOf(':') +1, onlineCourseDetailID.length)
  // const titleName = onlineCourseDetailID?.slice(0, onlineCourseDetailID.indexOf(':'))
  let courseCombo = onlineCourseDetailID?.slice(onlineCourseDetailID?.indexOf("&") + 1, onlineCourseDetailID?.indexOf("parent:"))
  let parentId = onlineCourseDetailID?.slice(onlineCourseDetailID?.indexOf("parent:") + 7, onlineCourseDetailID?.length)

  console.log('parentId',parentId)

  useEffect(() => {
    setShowError(false);
    if (onlineCourseDetailID) {
      // window.scrollTo(0, 0);
      fetchCourseDetail(
        onlineCourseDetailID?.slice(
          onlineCourseDetailID.indexOf(":") + 1,
          onlineCourseDetailID.indexOf("&")
        )
      );
      setId(
        onlineCourseDetailID?.slice(
          onlineCourseDetailID.indexOf(":") + 1,
          onlineCourseDetailID.indexOf("&")
        )
      );
      setTitleName(
        onlineCourseDetailID?.slice(0, onlineCourseDetailID.indexOf(":"))
      );
      // setCourseCombo(
      //   onlineCourseDetailID?.slice(
      //     onlineCourseDetailID.indexOf("&") + 1,
      //     onlineCourseDetailID.length
      //   )
      // );
    }
  }, [onlineCourseDetailID, reviewData]);
  // console.log("id",onlineCourseDetailID?.slice(onlineCourseDetailID.indexOf(':') +1, onlineCourseDetailID.indexOf('&')))

  useEffect(() => {
    if(thankYouModalShow) {
      setTimeout(() => {
        setThankYouModalShow(false)
      }, 3000)
    }
  }, [thankYouModalShow])

  useEffect(() => {
    setShowError(false);
    if(displayTabData?.tab){
      setKey(displayTabData?.tab)
    }
    else {
      setKey(tiles.find(item => item.type == "overview")?.tile_name)
    }
  }, [tiles])

  const fetchCourseDetail = async (id) => {
    try{
      console.log('idddddd', courseCombo)
      const formData = {
        course_id: id,
        page: 1,
        parent_id: courseCombo ? "" : (parentId ? parentId : id),
      };
      console.log('formaData', formData)
      const response_getCourseDetail_service = await getCourseDetail_Service(
        encrypt(JSON.stringify(formData), token)
      );
      const response_getCourseDetail_data = decrypt(
        response_getCourseDetail_service.data,
        token
      );
      console.log("get_courseDetail", response_getCourseDetail_data);
      if (response_getCourseDetail_data.status) {
        setOnlineCourseAry(response_getCourseDetail_data?.data?.course_detail);
        setRelateCourseAry(
          response_getCourseDetail_data?.data.tiles.filter(
            (item) => (item.tile_name == "Course Overview" || item.tile_name == "Description" || item.tile_name == "Detail")
          )[0]?.meta?.related_courses
        );
        setPdfData(
          response_getCourseDetail_data?.data?.course_detail?.course_syallbus_pdf
        );
        setCourseDetail(response_getCourseDetail_data?.data?.tiles);
        setTiles(response_getCourseDetail_data?.data?.tiles);
        // console.log("detail", response_getCourseDetail_data?.data?.tiles);
        setKey(response_getCourseDetail_data?.data?.tiles?.find(item => item.type = "overview")?.tile_name)
      }
      else{
        setShowError(true)
      }
    } catch (error) {
      console.log("error found: ", error)
      // router.push('/')
    }
  };



  const handleAddToMyCourse = async () => {
    try{
      const isLoggedIn = userLoggedIn();
      if(isLoggedIn) {
        const formData = {
          coupon_applied:0,
          course_id: id,
          course_price: parseFloat('00.00').toFixed(2),
          pay_via:3,
          quantity:1,
          tax: parseFloat('00.00').toFixed(2),
          type:1,
        }
        const response_AddtoMyCourse_service = await freeTransactionService(encrypt(JSON.stringify(formData), token));
        const response_AddtoMyCourse_data = decrypt(response_AddtoMyCourse_service.data, token);
        if(response_AddtoMyCourse_data.status) {
          const formDataConfirm = {
            type: 2,
            course_id: id,
            pre_transaction_id: response_AddtoMyCourse_data.data.post_transaction_id,
            transaction_status: 1,
            post_transaction_id: response_AddtoMyCourse_data.data.txn_id,
          };
          console.log(formDataConfirm)
          const response_ConfirmPayment_service = await getFPaymentService(
            encrypt(JSON.stringify(formDataConfirm), token)
          );
          const response_ConfirmPayment_data = decrypt(
            response_ConfirmPayment_service.data,
            token
          );
      
          // console.log('response_AddtoMyCourse_data', response_AddtoMyCourse_data)
          if (response_ConfirmPayment_data.status) {
            toast.success("Added Successfully");
            if (titleName == "Bookstore" || titleName == "e-Book") {
              router.push("/private/myProfile/ourCourse");
            } else {
              router.push("/private/myProfile/MyCourse");
            }
          } else {
            toast.error(response_ConfirmPayment_data.message);
          }
        }
      }
      else{
        setModalShow(true)
      }
    } catch (error) {
      console.log("error found: ", error)
      // router.push('/')
    }
  }

  const handleTabChange = (k) => {
    // console.log("k 83", k);
    setKey(k);
    // console.log('k', k)
    if (resetLayerRef.current) {
      resetLayerRef.current.click();
    }
  };

  const handleBuy = () => {
    localStorage.setItem('previousTab', router.pathname);
    router.push(`/view-courses/course-order/${titleName + ":" + onlineCourseAry.id + "&" + courseCombo}`)
  }

  const OverView = tiles.find(item => item.type = "overview")
  console.log('key', key)

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <LoginModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
      />
      <ThankyouModal
        show={thankYouModalShow}
        onHide = {() => setThankYouModalShow(false)}
      />
      <Header search={"disable"} />
      {/* {console.log('onlineCourseAry', onlineCourseAry)} */}
      {onlineCourseAry ? <>
      <section className="detailTopContainer">
        <div className="mb-4 container-fluid p-0">
          <div className="row">
            <div className="col-md-12">
              <nav aria-label="breadcrumb ">
                <ol className="m-0 breadcrumb cursor">
                  <li
                    className="breadcrumb-item"
                    onClick={() => router.push("/")}
                  >
                    {`Home`}
                    <i className="bi bi-chevron-right"></i>
                  </li>
                  {(onlineCourseAry.mrp != 0 || titleName) && (
                    titleName && 
                    <li
                      className="breadcrumb-item"
                      onClick={() => router.back()}
                    >
                      {`${titleName}`}
                      <i className="bi bi-chevron-right"></i>
                    </li>
                  )}
                  <li className="breadcrumb-item active">
                    {`Details`}
                    <i className="bi bi-chevron-right"></i>
                  </li>
                </ol>
              </nav>
              <div className="courseTitle">
                <h4 className="m-0 mb-3">{onlineCourseAry?.title}</h4>
              </div>
              <div className="mb-3 d-flex flex-wrap flex-sm-nowrap courseDuration">
                {/* <p className="m-0 me-4">
                  <span>
                    <LiaYoutube className="video_icon" />
                  </span>{" "}
                  120 Videos
                </p>
                <p className="m-0 me-4">
                  <span>
                    <IoDocumentTextOutline className="video_icon" />
                  </span>{" "}
                  120 PDF's
                </p> */}
                {onlineCourseAry?.segment_information && 
                <p className="m-0 me-4">
                  {onlineCourseAry.segment_information}
                </p>}
                {onlineCourseAry.mrp != 0 &&
                  onlineCourseAry.validity != "0 Days" && (
                    <p>
                      <span>
                        <IoDocumentTextOutline className="video_icon" />
                      </span>{" "}
                      Validity: {`${onlineCourseAry.validity}`}
                    </p>
                  )}
              </div>
              <div className="d-flex mb-3 freeCourserate">
                <p className="m-0">
                  <span className="freeRating">
                    <IoStar /> {onlineCourseAry.avg_rating ? parseFloat(onlineCourseAry.avg_rating).toFixed(1) : '0.0'}
                  </span>
                </p>
                <p className="m-0 freeCourseReview">
                  {onlineCourseAry.user_rated} Reviews
                </p>
              </div>
              {onlineCourseAry.mrp != 0 && (
                <div className="gap-2 d-flex flex-wrap flex-sm-nowrap align-items-center button_price">
                  <div className="gap-2 share d-flex align-items-center">
                    <button className="button1_share">
                      <FaShare />
                    </button>
                    {onlineCourseAry.is_purchased == 0 &&
                    <p className="m-0 detailBbuyNow">
                      <Button1
                        value={"Buy Now"}
                        handleClick={handleBuy}
                      />
                    </p>
                    }
                  </div>
                  {onlineCourseAry.is_purchased == 0 &&
                  <div className="m-0">
                    <div className="m-0 gap-2 d-flex align-items-center">
                      <span className="costPrice">
                        <FaRupeeSign className="rupeeSign" />
                        {onlineCourseAry.is_gst == 0
                          ? Number(onlineCourseAry.mrp) +
                            Number(onlineCourseAry.tax)
                          : onlineCourseAry.mrp}
                      </span>
                      {(Number(onlineCourseAry.mrp) + Number(onlineCourseAry.tax)) != onlineCourseAry.course_sp &&
                        <span className="discountPrice">
                          <del>
                            <FaRupeeSign className="rupeeSign2" />
                            {onlineCourseAry.course_sp}
                          </del>
                        </span>
                      }
                    </div>
                    <p className="m-0 ms-1 ex_gst">
                      {onlineCourseAry.is_gst == 0
                        ? "Inclusive of GST"
                        : "Exclusive of GST"}{" "}
                    </p>
                  </div>
                  }
                </div>
              )}
              <div className="d-none d-md-none d-lg-block MainCourseCard">
                <Card3
                  value={onlineCourseAry}
                  titleName={titleName}
                  courseCombo={courseCombo}
                  handleAddToMyCourse = {handleAddToMyCourse}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container-fluid p-0">
        {/* <div className="imgContainer">
              <img src={freeCourseAry[0].image} alt="" />
            </div> */}
        {/* </div>
        </div> */}
        <div className="course_mainContainer tabs_design__">
          <nav className="m-0 p-0">
            <Tabs
              id="controlled-tab-example2"
              activeKey={key}
              onSelect={(k) => handleTabChange(k)}
              className=""
            >
              {/* <Tab
                  eventKey={'course Detail'}
                  title={'course Detail' }
                  key={'course Detail'}
                  // propsValue={isValidData(item) && item.tiles}
                >
              </Tab> */}

              {OverView && 
                <Tab
                eventKey={OverView.tile_name}
                title={OverView.tile_name}
                // key={index}
                // propsValue={isValidData(item) && item.tiles}
              >
                <CourseDetail
                  title={OverView.tile_name}
                  courseDetail={courseDetail}
                  propsValue={
                    isValidData(relateCourseAry) && relateCourseAry
                  }
                  relateCourseAry={relateCourseAry}
                  course = {onlineCourseAry}
                  titleName={titleName}
                />
              </Tab>
              }

              {tiles?.map(
                (item, index) =>
                  (item.type !== "content" &&
                  item.type !== "faq" &&
                  item.type !== "overview" &&
                  item.type !== "concept") && (
                    <Tab
                    eventKey={item.tile_name}
                    title={item.tile_name}
                    key={index}
                    // propsValue={isValidData(item) && item.tiles}
                    >
                    {console.log('item', item)}
                    {/* {item.tile_name == "Course Overview" && (
                      <CourseDetail
                        title={item.tile_name}
                        courseDetail={courseDetail}
                        propsValue={
                          isValidData(relateCourseAry) && relateCourseAry
                        }
                        relateCourseAry={relateCourseAry}
                        course = {onlineCourseAry}
                        titleName={titleName}
                      />
                    )} */}
                    {/* {item.tile_name == "Description" && (
                          <CourseDetail
                            title={item.tile_name}
                            courseDetail={courseDetail}
                            propsValue={
                              isValidData(relateCourseAry) && relateCourseAry
                            }
                            relateCourseAry={relateCourseAry}
                            course = {onlineCourseAry}
                            keyValue={key}
                          />
                        )} */}
                        {/* {item.tile_name == "Detail" && (
                          <CourseDetail
                            title={item.tile_name}
                            courseDetail={courseDetail}
                            propsValue={
                              isValidData(relateCourseAry) && relateCourseAry
                            }
                            relateCourseAry={relateCourseAry}
                            course = {onlineCourseAry}
                            keyValue={key}
                          />
                        )} */}
                    {item.type != "course_combo" && 
                    <Notes
                      resetRef={resetLayerRef}
                      courseDetail={item}
                      CourseID={id}
                      tabName={item.tile_name}
                      keyValue={key}
                      // propsValue={isValidData(pdfData) && pdfData}
                    />
                    }
                    {item.type == "course_combo" &&
                    <ComboCourse 
                      courseDetail={item}
                      CourseID={id}
                      tabName={item.tile_name}
                      keyValue={key} 
                      titleName={titleName}
                      onlineCourseAry = {onlineCourseAry}
                    />
                    }
                  </Tab>
                )
              )}
            </Tabs>
          </nav>
        </div>
      </div>
    </>
    :
    <>
    {showError ? 
      <div>
        <img src="/assets/images/detailErrorImg.svg" alt="" />
        <h4>No Data found!</h4>
      </div>
      :
      <Loader />
    }
    </>  
    }
      <Footer />
    </>
  );
};

export default ViewOnlineCourseDetail;

const course_detail =
  "In this course, Talvir Singh will cover the syllabus of Communication. All the topics will be discussed in detail which will be helpful for all aspirants preparing for the NTA UGC-NET exam. Learners at any stage will be benefited from the course. The course will be conducted in Hindi and the notes will be provided in Hindi. In this course, Talvir Singh will cover the syllabus of Communication. All the topics will be discussed in detail which will be helpful for all aspirants preparing for the NTA UGC-NET exam. Learners at any stage will be benefited from the course. The course will be conducted in Hindi and the notes will be provided in Hindi. In this course, Talvir Singh will cover the syllabus of Communication. All the topics will be discussed in detail which will be helpful for all aspirants preparing for the NTA UGC-NET exam. Learners at any stage will be benefited from the course. The course will be conducted in Hindi and the notes will be provided in Hindi.";
