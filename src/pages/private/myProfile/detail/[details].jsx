import { getCourseDetail_Service } from "@/services";
import { decrypt, encrypt, get_token, isValidData } from "@/utils/helpers";
import React, { useEffect, useRef, useState } from "react";
import { LiaYoutube } from "react-icons/lia";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaShare } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button1 from "@/component/buttons/button1/button1";
import Card3 from "@/component/cards/card3";
import CourseDetail from "@/component/courseDetail/courseDetail";
import Notes from "@/component/notes/notes";
import Card4 from "@/component/cards/card4";
import { useRouter } from "next/router";
import Header from "@/component/header/header";
import SideBar from "@/component/sideBar/sideBar";
import { useSelector } from "react-redux";
import ComboCourse from "@/component/comboCourse/comboCourse";
import Loader from "@/component/loader";
import LoaderAfterLogin from "@/component/loaderAfterLogin";
import ErrorPageAfterLogin from "@/component/errorPageAfterLogin";

const Details = ({ value }) => {
  const [key, setKey] = useState(null);
  const [onlineCourseAry, setOnlineCourseAry] = useState('');
  const [showError, setShowError] = useState(false);
  const [relateCourseAry, setRelateCourseAry] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [courseDetail, setCourseDetail] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [id, setId] = useState("");
  const [titleName, setTitleName] = useState("");
  // const [courseCombo, setCourseCombo] = useState("");

  const resetLayerRef = useRef();
  const displayTabData = useSelector((state) => state.allCategory?.tabName)

  const router = useRouter();
  const { details } = router.query;
  const reviewData = useSelector((state) => state.allCategory?.review)
  const versionData = useSelector((state) => state.allCategory?.versionData);

  let courseCombo = details?.slice(details?.indexOf("&") + 1, details?.indexOf("parent:"))
  let parentId = details?.slice(details?.indexOf("parent:") + 7, details?.length)

  useEffect(() => {
    if (details) {
      // window.scrollTo(0, 0);
      fetchCourseDetail(
        details?.slice(details.indexOf(":") + 1, details.indexOf("&"))
      );
      setId(details?.slice(details.indexOf(":") + 1, details.indexOf("&")));
      setTitleName(details?.slice(0, details.indexOf(":")));
      // setCourseCombo(details?.slice(details.indexOf("&") + 1, details.length));
    }
  }, [details, reviewData]);

  useEffect(() => {
    setShowError(false);
    if(displayTabData?.tab){
      setKey(displayTabData?.tab)
    }
    else {
      setKey(tiles.find(item => item.type == "overview")?.tile_name)
    }
  }, [tiles])

  // console.log('courseCombo', courseCombo)

  const fetchCourseDetail = async (id) => {
    try{
      const token = get_token();
      const formData = {
        course_id: id,
        page: 1,
        parent_id: courseCombo ? "" : (parentId ? parentId : id),
      };
      console.log('formData', formData)
      const response_getCourseDetail_service = await getCourseDetail_Service(
        encrypt(JSON.stringify(formData), token)
      );
      const response_getCourseDetail_data = decrypt(
        response_getCourseDetail_service.data,
        token
      );
      console.log("response_getCourseDetail_data", response_getCourseDetail_data);
      if (response_getCourseDetail_data.status) {
        if(!response_getCourseDetail_data?.data?.course_detail){
          setShowError(true)
        }
        else{
          setOnlineCourseAry(response_getCourseDetail_data?.data?.course_detail);
          setRelateCourseAry(
            response_getCourseDetail_data?.data.tiles.filter(
              (item) => (item.type == "overview")
            )[0]?.meta?.related_courses
          );
          setPdfData(
            response_getCourseDetail_data?.data?.course_detail?.course_syallbus_pdf
          );
          setCourseDetail(response_getCourseDetail_data?.data?.tiles);
          setTiles(response_getCourseDetail_data?.data?.tiles);
          setKey(response_getCourseDetail_data?.data?.tiles?.find(item => item.type = "overview")?.tile_name)
          // console.log("detail", response_getCourseDetail_data?.data?.tiles);
        }
      }
      else {
        setShowError(true)
      }
    } catch (error) {
      setShowError(true)
      console.log("error found: ", error)
    }
  };

  const handleTabChange = (k) => {
    // console.log("k 83", k);
    setKey(k);
    // console.log('k', k)
    if (resetLayerRef.current) {
      resetLayerRef.current.click();
    }
  };
  console.log('tiles', tiles)

  const OverView = tiles.find(item => item.type == "overview")
  return (
    <>
      <Header />
      <div className="d-flex" style={{ marginTop: "55px" }}>
        <SideBar />
        {/* {console.log('onlineCourseAry', onlineCourseAry)} */}
        <main className="main_content pt-0 flex-grow-1">
        {onlineCourseAry ? <>
          <section className="profileDetailTopContainer">
            <div className="mb-4 container-fluid p-0">
              <div className="row">
                <div className="col-md-12">
                  <nav aria-label="breadcrumb ">
                    <ol className="m-0 breadcrumb cursor">
                      <li
                        className="breadcrumb-item"
                        onClick={() => router.back()}
                      >
                        {titleName ? (titleName == "MyCourse" ? 'My Courses' : titleName) : 
                          `My Courses`}
                        <i className="bi bi-chevron-right"></i>
                      </li>
                      {/* {onlineCourseAry.mrp != 0 || titleName && (
                                <li
                                className="breadcrumb-item"
                                onClick={() => router.back()}
                                >
                                {`${titleName}`}
                                <i className="bi bi-chevron-right"></i>
                                </li>
                            )} */}
                      <li className="breadcrumb-item active">
                        {`Details`}
                        <i className="bi bi-chevron-right"></i>
                      </li>
                    </ol>
                  </nav>
                  <div className="courseTitle">
                    <h4 className="m-0 mb-3">{onlineCourseAry?.title}</h4>
                  </div>
                  <div className="mb-3 gap-1 d-flex flex-wrap flex-sm-nowrap courseDuration">
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
                    <div className="gap-2 flex-wrap flex-sm-nowrap d-flex align-items-center button_price">
                      <div className="gap-2 share d-flex align-items-center">
                        {versionData?.share_content == 1 &&
                        <button className="button1_share">
                          <FaShare />
                        </button>
                        }
                        {/* {console.log(onlineCourseAry)} */}
                        {onlineCourseAry.is_purchased == 0 && (
                          <p className="m-0 detailBbuyNow">
                            <Button1
                              value={"Buy Now"}
                              handleClick={() =>
                                router.push(
                                  `/view-courses/course-order/${
                                    titleName +
                                    ":" +
                                    onlineCourseAry.id +
                                    "&" +
                                    courseCombo
                                  }`
                                )
                              }
                            />
                          </p>
                        )}
                      </div>
                      {onlineCourseAry.is_purchased == 0 && (
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
                      )}
                    </div>
                  )}
                  <div className="d-none d-md-none d-lg-block MainCourseCard">
                    <Card4
                      value={onlineCourseAry}
                      titleName={titleName ? titleName : "detail"}
                      courseCombo={courseCombo}
                      handleDetail={() => console.log("detail")}
                      detail = {true}
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
            <div className="profileCourse_mainContainer tabs_design__">
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
                  titleName = {titleName}
                />
                </Tab>
                }
                  {/* {console.log("key 214", key)} */}
                  {tiles?.map(
                    (item, index) =>
                      // console.log('item', item)
                      item.type !== "content" &&
                      item.type !== "faq" &&
                      item.type !== "overview" &&
                      item.type !== "concept" && (
                        <Tab
                          eventKey={item.tile_name}
                          title={item.tile_name}
                          key={index}
                          // propsValue={isValidData(item) && item.tiles}
                        >
                          {/* {item.tile_name == "Course Overview" && (
                            <CourseDetail
                              title={item.tile_name}
                              courseDetail={courseDetail}
                              propsValue={
                                isValidData(relateCourseAry) && relateCourseAry
                              }
                              relateCourseAry={relateCourseAry}
                              course = {onlineCourseAry}
                              titleName = {titleName}
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
                          {/* {item.tile_name === "Notes" && ( */}
                          {item.type !== "course_combo" && (item.type == "test" || item.type == "pdf" || item.type == "video") &&
                            <Notes
                              resetRef={resetLayerRef}
                              courseDetail={item}
                              CourseID={id}
                              tabName={item.tile_name}
                              keyValue={key}
                              onlineCourseAry = {onlineCourseAry}
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
          showError ? 
            <>
              <div className="main_content pt-0 flex-grow-1">
                <div className="container-fluid p-0">
                  <div className="row">
                    <ErrorPageAfterLogin />
                  </div>
                </div>
              </div>
            </>
            :
            <>
              {/* <div className="spinner-border" role="status" /> */}
              <LoaderAfterLogin />
            </>
          }
          </main>
      </div>
    </>
  );
};

export default Details;
