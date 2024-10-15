import { getMyCourseService } from "@/services";
import { decrypt, encrypt, get_token } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Card2 from "../cards/card2";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import Card4 from "../cards/card4";
import SearchCourses from "../searchCourses/searchCourses";
import ErrorPage from "../errorPage";
import ErrorPageAfterLogin from "../errorPageAfterLogin";
import LoaderAfterLogin from "../loaderAfterLogin";

const MyCourse = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [showError, setShowError] = useState(false)
  const [getCourse, setGetCourse] = useState("");
  const [myCourseData, setMyCourseData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setShowError(false)
    fetchMyCourseService();
    setShowDetail(false);
  }, [getCourse]);

  const fetchMyCourseService = async () => {
    try{
      const token = get_token();
      const formData = {};
      const response_MyCourse_service = await getMyCourseService(
        encrypt(JSON.stringify(formData), token)
      );
      const response_MyCourse_data = decrypt(
        response_MyCourse_service?.data,
        token
      );
      // console.log('response_MyCourse_data', response_MyCourse_data)
      if (response_MyCourse_data?.status) {
        if(response_MyCourse_data?.data?.length < 0) {
          setShowError(true)
        }
        else setMyCourseData(response_MyCourse_data.data);
      } else if (response_MyCourse_data.message == msg) {
        setShowError(true)
        toast.error(response_MyCourse_data.message);
        localStorage.removeItem("jwt");
        localStorage.removeItem("user_id");
        // location.href("/")
        router.push("/");
      } else {
        setShowError(true)
        toast.error(response_MyCourse_data.message);
      }
    } catch (error) {
      console.log("error Found: ", error)
    }
  };

  const handleDetail = (value) => {
    console.log("detailesss", value);
    router.push(
      `/private/myProfile/detail/${
        "MyCourse" + ":" + value.id + "&" + value.combo_course_ids + 'parent:'
      }`
    );
  };

  const handleShowDetail = () => {
    // console.log('helo')
    setShowDetail(false);
  };

  // console.log('showDetail', showDetail)
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {/* <SearchCourses /> */}
      <section className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <Tabs
              defaultActiveKey="PAID COURSES"
              id="uncontrolled-tab-example"
              className="mb-3 CustomTab"
            >
              <Tab eventKey="PAID COURSES" title="PAID COURSES">
                <div className="container-fluid">
                  <div className="row">
                    {myCourseData?.length > 0 ?
                      myCourseData.map((item, index) => {
                        return (
                          item.mrp !== 0 && (
                            <div
                              className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4 p-0"
                              key={index}
                            >
                              <Card4
                                value={item}
                                titleName={""}
                                handleDetail={handleDetail}
                                titleId="PAID COURSES"
                                detail = {false}
                                setGetCourse={setGetCourse}
                              />
                            </div>
                          )
                        );
                      })
                      :
                      <>
                        {showError ?
                        <ErrorPageAfterLogin />
                        :
                        <LoaderAfterLogin />}
                      </>
                    }
                  </div>
                </div>
              </Tab>
              <Tab eventKey="FREE COURSES" title="FREE COURSES">
                <div className="container-fluid">
                  <div className="row">
                    {myCourseData?.length > 0 ? myCourseData.map((item, index) => {
                      return (
                        item.mrp == 0 && (
                          <div
                            className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4 p-0"
                            key={index}
                          >
                            <Card4
                              value={item}
                              titleName={""}
                              handleDetail={handleDetail}
                              titleId="FREE COURSES"
                              detail = {false}
                            />
                          </div>
                        )
                      );
                    })
                    :
                    <>
                      <>
                        {showError ?
                        <ErrorPageAfterLogin />
                        :
                        <LoaderAfterLogin />}
                      </>
                    </>
                  }
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </section>
    </>
  );
};

const msg =
  "You are already logged in with some other devices, So you are logged out from this device. 9";

export default MyCourse;
