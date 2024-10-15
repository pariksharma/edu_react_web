import Blogs from "@/component/blogs/blogs";
import Bookstore from "@/component/bookstore/bookstore";
import CurrentAffairList from "@/component/currentAffairList/currentAffairList";
import ErrorPage from "@/component/errorPage";
import Feeds from "@/component/feeds/feeds";
import Footer from "@/component/footer/footer";
import Header from "@/component/header/header";
import Inquiry from "@/component/inquiry/inquiry";
import LiveClass from "@/component/liveClass/liveClass";
import LiveTest from "@/component/liveTest/liveTest";
import LoaderAfterLogin from "@/component/loaderAfterLogin";
import MyCourse from "@/component/myCourse/myCourse";
import Notification from "@/component/notification/notification";
import OurCourses from "@/component/ourCourses/ourCourses";
import Profile from "@/component/profile/profile";
import PurchaseHistory from "@/component/purchaseHistory/purchaseHistory";
import SideBar from "@/component/sideBar/sideBar";
import Testimonial from "@/component/testimonial/testimonial";
import { getCourse_Catergory_Service } from "@/services";
import { all_content } from "@/store/sliceContainer/masterContentSlice";
import { decrypt, get_token, userLoggedIn } from "@/utils/helpers";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";

const Index = (props) => {
  const router = useRouter();
  const { tab } = router.query;
  // console.log("router", router.pathname.startsWith("/private"));
  // console.log('tab', tab)

  const [statusTab, setStatusTab] = useState("");

  useEffect(() => {
    const isLoggedIn = userLoggedIn()
    if(router.pathname.startsWith("/private") && !isLoggedIn){
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    setStatusTab(tab)
  }, [tab])

  const renderContent = () => {
    switch (statusTab) {
      case "Feeds":
        return <Feeds />;
      case "ourCourse":
        return <OurCourses />;
      case "Live Test":
        return <LiveTest />;
      case "Live Classes":
        return <LiveClass />;
      case "Blog":
        return <Blogs />;
      case "Current affairs":
        return <CurrentAffairList />;
      case "Testimonial":
        return <Testimonial />;
      case "Bookstore":
        return <Bookstore />;
      case "Notification":
        return <Notification />;
      case "MyCourse":
        return <MyCourse />;
      case "Purchase History":
        return <PurchaseHistory />;
      case "Inquiry":
        return <Inquiry />;
      case "profile":
        return <Profile />;
      default:
        // return <div className=" pt-0 flex-grow-1">
        //   <img src="/assets/images/detailErrorImg.svg" alt="" />
        //   <h4>No Data found!</h4>
        //   <p>Unable to locate data, seeking alternative methods for retrieval.</p>
        // </div>;  // Fallback to error page if no match
        return <LoaderAfterLogin/>
    }
  };

  return (
    <>
      <Header />
      <div className="d-flex" style={{ marginTop: "55px" }}>
        <SideBar />
        <main className="main_content flex-grow-1">
          {/* {statusTab == "Feeds" && <Feeds />}
          {statusTab == "ourCourse" && <OurCourses />}
          {statusTab == "Live Test" && <LiveTest />}
          {statusTab == "Live Classes" && <LiveClass />}
          {statusTab == "Blog" && <Blogs />}
          {statusTab == "Current affairs" && <CurrentAffairList />}
          {statusTab == "Testimonial" && <Testimonial />}
          {statusTab == "Bookstore" && <Bookstore />}
          {statusTab == "Notification" && <Notification />}
          {statusTab == "MyCourse" && <MyCourse />}
          {statusTab == "Purchase History" && <PurchaseHistory />}
          {statusTab == "Inquiry" && <Inquiry />}
          {statusTab == "profile" && <Profile />} */}
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default Index;
