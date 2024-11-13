import React, { useEffect, useState, Suspense, lazy } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useSelector } from "react-redux";
// import SubTabsData from "../subTabsData/subTabsData";
import { useRouter } from "next/router";
// import SearchCourses from "../searchCourses/searchCourses";
import { getCourse_service } from "@/services";
import { decrypt, encrypt, get_token } from "@/utils/helpers";
import ErrorPageAfterLogin from "../errorPageAfterLogin";
import LoaderAfterLogin from "../loaderAfterLogin";
// import Banner from "../banner/banner";
import Head from 'next/head';

const Banner = lazy(() => import("../banner/banner"));
const SearchCourses = lazy(() => import("../searchCourses/searchCourses"));
const SubTabsData = lazy(() => import("../subTabsData/subTabsData"));

const OurCourses = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [showError, setShowError] = useState(false)
  const [getCourse, setGetCourse] = useState("");
  const [filterCoursesList, setFilterCoursesList] = useState([]);
  const [banner, setBanner] = useState([]);
  const [tabData, setTabData] = useState([]);
  const [getCourses, setGetCourses] = useState([])
  const [key, setKey] = useState("");
  const [catId, setCatId] = useState('');

  const router = useRouter();

  const contentData = useSelector((state) => state?.allCategory?.content);
  console.log('contentData', contentData)
  useEffect(() => {
    if (contentData?.banner_list_web?.length > 0) {
      setBanner(contentData.banner_list_web[0]?.banner_url);
    }
  }, [contentData]);

  useEffect(() => {
    if (contentData?.course_type_master) {
      // localStorage.setItem('tab_id', contentData?.course_type_master[0].name)
      setTabData(contentData?.course_type_master);
      // console.log('localStorage', localStorage.getItem('mainTab'))
      const getTabName = localStorage.getItem('mainTab');
      // console.log('getTabName',getTabName)
      if (getTabName) {
        console.log('getTabName1')
        setKey(getTabName)
        setCatId(contentData?.course_type_master?.filter(item => item.name == getTabName)[0]?.id)
        setTimeout(() => {
          localStorage.removeItem('mainTab')
        }, [2000])
      }
      else {
        console.log('getTabName2')
        setCatId(contentData?.course_type_master[0]?.id)
        setKey(contentData?.course_type_master[0]?.name);
      } 
    }
  }, [contentData])

  useEffect(() => {
    setShowError(false)
    if (key != '') {
      fetchCategoryData();
    }
  }, [key, catId])

  const handleTabChange = (k) => {
    // console.log(key)
    setKey(k);
    setCatId(tabData.filter(item => item.name == k)[0]?.id)
    if (key != k) {
      setFilterCoursesList([])
    }
  };

  const handleShowDetail = () => {
    setShowDetail(false);
  };

  const handleDetail = (value, titleName, keyValue) => {
    // console.log("detailesss", titleName);
    localStorage.setItem('mainTab', keyValue)
    if (titleName) {
      router.push(
        `/private/myProfile/detail/${titleName + ":" + value.id + "&" + value.combo_course_ids + 'parent:'
        }`
      );
    }
    else {
      router.push(
        `/private/myProfile/detail/${"ourCourse" + ":" + value.id + "&" + value.combo_course_ids + 'parent:'
        }`
      )
    }
  };

  const fetchCategoryData = async () => {
    try {
      const token = get_token();
      const formData = {
        course_type: catId && catId,
        page: 1,
        sub_cat: 1,
        main_cat: 0,
        // 'course_ids': id
      };
      // console.log('formDAta', formData)
      const response_getCourse_service = await getCourse_service(
        encrypt(JSON.stringify(formData), token)
      );
      const response_getCourse_data = decrypt(
        response_getCourse_service.data,
        token
      );
      // console.log("response_getCourse_data", response_getCourse_data);
      if (response_getCourse_data.status) {
        if (response_getCourse_data?.data?.length == 0) {
          setShowError(true)
        }
        else {
          setGetCourses(response_getCourse_data.data);
          setFilterCoursesList(response_getCourse_data.data)
          // console.log("detail", response_getCourse_data.data);
        }
      }
      else {
        setGetCourses([]);
        setFilterCoursesList([])
        setShowError(true)
      }
    } catch (error) {
      console.log("error found: ", error)
      router.push('/')
    }
  };

  const handleFilterCourses = (filterCourses, searchInputValue) => {
    if (filterCourses?.length > 0) {
      setFilterCoursesList(filterCourses)
    }
    else {
      if (searchInputValue == '') {
        setFilterCoursesList(getCourses);
      }
      else {
        setFilterCoursesList([])
        setShowError(true)
      }
    }
  }

  // console.log('filterCourse', key)

  return (
    <>
      <Head>
        <title>{'Our Courses'}</title>
        <meta name={'Our Courses'} content={'Our Courses'} />
      </Head>

      <section className="container-fluid">
        {/* {banner &&
        <div className="row">
          <div className="col-md-12 mb-5">
            <img className="profileBanImg" src={banner ? banner : ""} alt="" />
          </div>
        </div>
        } */}
        <Suspense fallback={<LoaderAfterLogin />}>
          <Banner IsMargin={true} />
          <SearchCourses catId={catId} handleFilterCourses={handleFilterCourses} />
        </Suspense>
      </section>
      {/* <Suspense fallback={<LoaderAfterLogin />}>
      </Suspense> */}
      <section className="container-fluid">
        {tabData?.length > 0 ?
          <div className="row">
            <div className="col-md-12">
              <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3 CustomTab"
                activeKey={key}
                onSelect={(k) => handleTabChange(k)}
              >
                {tabData.map((item, index) => {
                  if (item?.cat_type == 0) {
                    return (
                      <Tab
                        eventKey={item.name}
                        title={item.name}
                        key={index}
                      // data = {item}
                      >
                        <Suspense fallback={<LoaderAfterLogin />}>
                          <SubTabsData
                            data={item}
                            handleDetail={handleDetail}
                            keyValue={key}
                            getCourses={filterCoursesList}
                            showError={showError}
                          />
                        </Suspense>
                      </Tab>
                    );
                  }
                })}
              </Tabs>
            </div>
          </div>
          :
          null
        }
      </section>
    </>
  );
};

export default OurCourses;
