import Blogs from "@/component/blogs/blogs";
import Bookstore from "@/component/bookstore/bookstore";
import CurrentAffairList from "@/component/currentAffairList/currentAffairList";
import Feeds from "@/component/feeds/feeds";
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
import { useRouter } from "next/router";
import { decrypt, get_token, userLoggedIn } from "@/utils/helpers";

import React, { useEffect, useState } from "react";

const Index = ({ initialTab }) => {
  const router = useRouter();
  const [statusTab, setStatusTab] = useState(initialTab);

  useEffect(() => {
    // Update statusTab whenever the router.query.tab changes
    const { tab } = router.query;
    if (tab) {
      setStatusTab(tab);
    }
  }, [router.query.tab]); // Dependency array with router.query.tab

  useEffect(() => {
    const isLoggedIn = userLoggedIn()
    if(router.pathname.startsWith("/private") && !isLoggedIn){
      router.push('/')
    }
  }, [router])

  const renderContent = () => {
    switch (statusTab) {
      case "Feeds":
        return <Feeds />;
      case "ourCourse":
        return <OurCourses />;
      case "Live_Test":
        return <LiveTest />;
      case "Live_Classes":
        return <LiveClass />;
      case "Blog":
        return <Blogs />;
      case "Current_affairs":
        return <CurrentAffairList />;
      case "Testimonial":
        return <Testimonial />;
      case "Bookstore":
        return <Bookstore />;
      case "Notification":
        return <Notification />;
      case "MyCourse":
        return <MyCourse />;
      case "Purchase_History":
        return <PurchaseHistory />;
      case "Inquiry":
        return <Inquiry />;
      case "profile":
        return <Profile />;
      default:
        return <LoaderAfterLogin />;
    }
  };

  return (
    <>
      <Header />
      <div className="d-flex" style={{ marginTop: "55px" }}>
        <SideBar />
        <main className="main_content flex-grow-1">
          {renderContent()}
        </main>
      </div>
    </>
  );
};

// Use `getStaticPaths` to define available dynamic routes
export const getStaticPaths = async () => {
  const paths = [
    { params: { tab: "Feeds" } },
    { params: { tab: "ourCourse" } },
    { params: { tab: "Live_Test" } },
    { params: { tab: "Live_Classes" } },
    { params: { tab: "Blog" } },
    { params: { tab: "Current_affairs" } },
    { params: { tab: "Testimonial" } },
    { params: { tab: "Bookstore" } },
    { params: { tab: "Notification" } },
    { params: { tab: "MyCourse" } },
    { params: { tab: "Purchase_History" } },
    { params: { tab: "Inquiry" } },
    { params: { tab: "profile" } },
  ];

  return { paths, fallback: false };
};

// Use `getStaticProps` to provide data at build time
export const getStaticProps = async ({ params }) => {
  const { tab } = params;

  return {
    props: {
      initialTab: tab || null, // Provide initialTab as a prop
    },
  };
};

export default Index;
