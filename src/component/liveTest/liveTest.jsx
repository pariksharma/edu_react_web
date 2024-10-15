import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import LiveTestCard from "../cards/liveTestCard";
import { decrypt, encrypt, get_token } from "@/utils/helpers";
import { getLiveTestService } from "@/services";
import SearchCourses from "../searchCourses/searchCourses";
import ErrorPage from "../errorPage";
import { useRouter } from "next/router";
import ErrorPageAfterLogin from "../errorPageAfterLogin";
import LoaderAfterLogin from "../loaderAfterLogin";

const LiveTest = () => {

  const [key, setKey] = useState('LIVE');
  const [liveTests, setLiveTests] = useState([])
  const [showError, setShowError] = useState(false)
  const router = useRouter()
  const token = get_token();

  const handleTabChange = (k) => {
    setKey(k);
  };

  useEffect(() => {
    setShowError(false)
    setLiveTests([])
    if(key == "LIVE") {
      fetchLiveTest(0);
    }
    else if(key == "UPCOMING") {
      fetchLiveTest(1);
    }
    else {
      fetchLiveTest(2);
    }
  }, [key])


  const fetchLiveTest = async (value) => {
    try{
      const formData = {
        page: 1,
        type: value
      }
      const response_getLiveTest_service = await getLiveTestService(encrypt(JSON.stringify(formData), token));
      const response_getLiveTest_data = decrypt(response_getLiveTest_service.data, token);
      if(response_getLiveTest_data?.status) {
        if(response_getLiveTest_data?.data?.length == 0) {
          setShowError(true)
        }
        else setLiveTests(response_getLiveTest_data.data)
      }
      else if (response_getLiveTest_data.message == msg) {
        // toast.error(response_getLiveTest_data.message);
        localStorage.removeItem("jwt");
        localStorage.removeItem("user_id");
        // location.href("/")
        router.push("/");
        setLiveTests([])
        setShowError(true)
      } else {
        // toast.error(response_getLiveTest_data.message);
        setLiveTests([])
        setShowError(true)
      }
      console.log('response_getLiveCourse_data', response_getLiveTest_data);
    } catch (error) {
      console.log("error found: ", error)
      router.push('/')
    }
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {/* <SearchCourses /> */}
      <section className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <Tabs
              defaultActiveKey="LIVE"
              id="uncontrolled-tab-example"
              className="CustomTab mb-3"
              activeKey={key}
              onSelect={(k) => handleTabChange(k)}
            >
              <Tab eventKey="LIVE" title="LIVE">
                <div className="row">
                {liveTests?.length > 0 ? liveTests.map((item, index) => {
                  return <LiveTestCard testData = {item} value={key} key={index} />
                })
                :
                <>
                    {showError ? 
                      <ErrorPageAfterLogin />
                      :
                      <LoaderAfterLogin />
                    }
                  </>
              } 
              </div> 
              </Tab>
              <Tab eventKey="UPCOMING" title="UPCOMING">
                <div className="row">
                {liveTests?.length > 0 ? liveTests.map((item, index) => {
                    return <LiveTestCard testData = {item} value={key} key={index} />
                  })
                  :
                  <>
                    {showError ? 
                      <ErrorPageAfterLogin />
                      :
                      <LoaderAfterLogin />
                    }
                  </>
                }
                </div>
              </Tab>
              <Tab eventKey="COMPLETED" title="COMPLETED">
                <div className="row">
                {liveTests?.length > 0 ? liveTests.map((item, index) => {
                    return <LiveTestCard testData = {item} value={key} key={index} />
                  })
                  :
                  <>
                    {showError ? 
                      <ErrorPageAfterLogin />
                      :
                      <LoaderAfterLogin />
                    }
                  </>
                }
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </section>
    </>
  );
};

const msg = "You are already logged in with some other devices, So you are logged out from this device. 9"

export default LiveTest;
