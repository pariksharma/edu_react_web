import { getCourse_Catergory_Service } from '@/services';
import { all_content } from '@/store/sliceContainer/masterContentSlice';
import { decrypt, get_token } from '@/utils/helpers';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Nav } from "react-bootstrap";
import { useDispatch } from 'react-redux';



const SideBar = () => {

    const router = useRouter()
    const { tab } = router.query;

    const [statusTab, setStatusTab] = useState("");
  const [sideBarTabs, setSideBarTabs] = useState([]);


  const dispatch = useDispatch();
  // console.log(router.asPath)
  // console.log('statusTab', router.asPath.substring((router.asPath.lastIndexOf('detail/')) +7, router.asPath.lastIndexOf(':')))

  useEffect(() => {
    fetchContentData();
  }, []);

  useEffect(() => {
    if(tab) {
      setStatusTab(tab)
    }
    else {
      const nameTab = router.asPath.substring((router.asPath.lastIndexOf('detail/')) +7, router.asPath.indexOf(':'))
      console.log('nameTab', nameTab)
      if(nameTab == "Classroom%20Learning%20Program" || nameTab == "Online%20Courses" || nameTab == "Test%20Series" || nameTab == "e-BOOK"){
        setStatusTab("ourCourse")
      }
      else{
        setStatusTab(nameTab)
      }
      // console.log('nameTab', nameTab)
    }
  }, [tab, sideBarTabs])



    const token = get_token();
  const fetchContentData = async () => {
    try{
      const formData = new FormData();
      const response_content_service = await getCourse_Catergory_Service(
        formData
      );
      // console.log(
      //   "bannerResponse1",
      //   decrypt(response_content_service.data, token)
      // );
      const content_service_Data = decrypt(response_content_service.data, token);
      console.log('content_service_Data',content_service_Data)
      if (content_service_Data.status) {
        dispatch(all_content(content_service_Data.data));
        setSideBarTabs(content_service_Data.data.bottom_bar_web)
      }
    } catch (error) {
      console.log("error found: ", error)
      // router.push('/')
    }
  };


  return (
    <div className="d-flex" style={{ marginTop: "55px" }}>
          <Nav
            id="sidebar"
            className="pt-2 d-none d-md-block bg-light"
            activeKey="/home"
            onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
          >
            {sideBarTabs && sideBarTabs.map((value, index) => {
              if(value.title == "Feeds") {
                return  <Nav.Item
                  key={index}
                  onClick={() => router.push(`/private/myProfile/${value.title}`)} 
                  className={`m-0 ${statusTab && (statusTab == value.title ? " active" : "")}`}
                >
                  <Nav.Link className='m-0'>
                    <img src={value.icon} alt="" />
                    {value.title}
                  </Nav.Link>
                </Nav.Item>
              }
            })}
            <div className="sidebar-header">
              <h4 className="m-0">STUDY MATERIAL</h4>
            </div>
            <Nav.Item
              // onClick={() => setStatusTab("ourCourse")}
              onClick={() => router.push('/private/myProfile/ourCourse')} 
              className={`m-0 ${statusTab && (statusTab == "ourCourse" ? "active" : "")}`}
            >
              <Nav.Link className='m-0'>
                <img src="/assets/images/ourCourseLogo.png" alt="" />
                Our Courses
              </Nav.Link>
            </Nav.Item>
            {sideBarTabs && sideBarTabs.map((value, index) => {
              if(value.title !== "Feeds" && 
                value.title !== "Inquiry" && 
                value.title !== "Testimonial" && 
                value.title !== "Notice Board" &&
                value.title !== "Single Course" &&
                value.title !== "All courses"
              ) {
                return  <Nav.Item
                  key={index}
                  onClick={() => router.push(`/private/myProfile/${value.title}`)} 
                  className={`m-0 ${statusTab && (statusTab == value.title ? "active" : "")}`}
                >
                  <Nav.Link className='m-0'>
                    <img src={value.icon} alt="" />
                    {value.title}
                  </Nav.Link>
                </Nav.Item>
              }
            })}
            <Nav.Item
              // onClick={() => setStatusTab("Notification")}
              onClick={() => router.push('/private/myProfile/Notification')} 
              className={`m-0 ${statusTab && (statusTab == "Notification" ? "active" : "")}`}
            >
              <Nav.Link className='m-0'>
                <img src="/assets/images/notificationLogo.png" alt="" />
                Notification
              </Nav.Link>
            </Nav.Item>
            <div className="sidebar-header">
              <h4 className="m-0">MY STUFF</h4>
            </div>
            <Nav.Item
              // onClick={() => setStatusTab("MyCourse")}
              onClick={() => router.push('/private/myProfile/MyCourse')} 
              className={`m-0 ${statusTab && (statusTab == "MyCourse" ? "active" : "")}`}
            >
              <Nav.Link className='m-0'>
                <img src="/assets/images/myCourseLogo.png" alt="" />
                My Courses
              </Nav.Link>
            </Nav.Item>
            <Nav.Item
              onClick={() => router.push('/private/myProfile/Purchase History')} 
              className={`m-0 ${statusTab && (statusTab == "Purchase History" ? "active" : "")}`}
            >
              <Nav.Link className='m-0'>
                <img src="/assets/images/purchaseLogo.png" alt="" />
                Purchase History
              </Nav.Link>
            </Nav.Item>
            {sideBarTabs && sideBarTabs.map((value, index) => {
              if(value.title == "Inquiry") {
                return  <Nav.Item
                  key={index}
                  onClick={() => router.push(`/private/myProfile/${value.title}`)} 
                  className={`m-0 ${statusTab && (statusTab == value.title ? "active" : "")}`}
                >
                  <Nav.Link className='m-0'>
                    <img src={value.icon} alt="" />
                    {value.title}
                  </Nav.Link>
                </Nav.Item>
              }
            })}
            <Nav.Item 
              // onClick={() => setStatusTab("profile")}
              onClick={() => router.push('/private/myProfile/profile')} 
              className={`m-0 ${statusTab && (statusTab == "profile" ? "active" : "")}`}
            >
              <Nav.Link className='m-0'>
                <img src="/assets/images/myProfileLogo.png" alt="" />
                Profile
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
  )
}

export default SideBar