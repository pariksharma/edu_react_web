import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useSelector } from "react-redux";
import SubTabsData from "../subTabsData/subTabsData";
import { useRouter } from "next/router";
import SearchCourses from "../searchCourses/searchCourses";
import { getCourse_service } from "@/services";
import { decrypt, encrypt, get_token } from "@/utils/helpers";
import ErrorPageAfterLogin from "../errorPageAfterLogin";
import LoaderAfterLogin from "../loaderAfterLogin";

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
  useEffect(() => {
    if (contentData?.banner_list_web?.length > 0) {
      setBanner(contentData.banner_list_web[0]?.banner_url);
    }
    if (contentData?.course_type_master) {
      // localStorage.setItem('tab_id', contentData?.course_type_master[0].name)
      setTabData(contentData?.course_type_master);
      setCatId(contentData?.course_type_master[0].id)
      console.log('localStorage', localStorage.getItem('mainTab'))
      if(localStorage.getItem('mainTab')){
        setKey(localStorage.getItem('mainTab'))
        setTimeout(() => {
          localStorage.setItem('mainTab', "")
        }, [2000])  
      }
      else{
        setKey(contentData?.course_type_master[0].name);
      }
    }
  }, [contentData]);
  // console.log('banner', tabData)

  useEffect(() => {
    setShowError(false)
    if(key != '') {
      fetchCategoryData();
    }
  }, [key])

  const handleTabChange = (k) => {
    // console.log(key)
    setKey(k);
    setCatId(tabData.filter(item => item.name == k)[0]?.id)
    setFilterCoursesList([])
    // localStorage.setItem(k)
  };

  const handleShowDetail = () => {
    setShowDetail(false);
  };

  const handleDetail = (value, titleName, keyValue) => {
    // console.log("detailesss", titleName);
    localStorage.setItem('mainTab', keyValue)
    if(titleName) {
      router.push(
        `/private/myProfile/detail/${
         titleName+":" + value.id + "&" + value.combo_course_ids+'parent:'
        }`
      );
    }
    else {
      router.push(
        `/private/myProfile/detail/${
         "ourCourse"+":" + value.id + "&" + value.combo_course_ids +'parent:'
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
      
      const response_getCourse_service = await getCourse_service(
        encrypt(JSON.stringify(formData), token)
      );
      const response_getCourse_data = decrypt(
        response_getCourse_service.data,
        token
      );
      console.log("response_getCourse_data", response_getCourse_data);
      if (response_getCourse_data.status) {
        if(response_getCourse_data?.data?.length == 0) {
          setShowError(true)
        }
        else{
          setGetCourses(response_getCourse_data.data);
          setFilterCoursesList(response_getCourse_data.data)
          // console.log("detail", response_getCourse_data.data);
        }
      }
      else{
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
    if(filterCourses?.length > 0) {
      setFilterCoursesList(filterCourses)
    }
    else {
      if(searchInputValue == ''){
        setFilterCoursesList(getCourses);
      }
      else{
        setFilterCoursesList([])
        setShowError(true)
      }
    }
  }

  // console.log('filterCourse', key)

  return (
    <>
      <SearchCourses catId = {catId} handleFilterCourses = {handleFilterCourses} />
      <section className="container-fluid">
        {banner &&
        <div className="row">
          <div className="col-md-12 mb-5">
            <img className="profileBanImg" src={banner ? banner : ""} alt="" />
          </div>
        </div>
        }
      </section>
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
                      <SubTabsData
                        data={item}
                        handleDetail={handleDetail}
                        keyValue={key}
                        getCourses = {filterCoursesList}
                        showError = {showError}
                      />
                    </Tab>
                  );
                }
              })}
            </Tabs>
          </div>
        </div>
        :
        showError ? 
          <ErrorPageAfterLogin />
          :
          <LoaderAfterLogin />
        }
      </section>
    </>
  );
};

export default OurCourses;
