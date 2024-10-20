import React, { useEffect, useState } from "react";
import Button1 from "../buttons/button1/button1";
import { getMasterDataService } from "@/services";
import { IoIosArrowForward } from "react-icons/io";
import { decrypt, encrypt, get_token } from "@/utils/helpers";
import LoginModal from "../modal/loginModal";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { all_tabName, reset_tab } from "@/store/sliceContainer/masterContentSlice";
import ErrorPageAfterLogin from "../errorPageAfterLogin";
import LoaderAfterLogin from "../loaderAfterLogin";
import toast, { Toaster } from "react-hot-toast";

const Notes = ({ propsValue, tabName, resetRef, courseDetail, CourseID, keyValue }) => {
  // console.log("keyValue",courseDetail)
  const [modalShow, setModalShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const [layer1Data, setLayer1Data] = useState();
  const [showLayer, setShowLayer] = useState("layer1");
  const [layer2List, setLayer2List] = useState();
  const [layer1Index, setLayer1Index] = useState();
  const [layer2Index, setLayer2Index] = useState();
  const [layer3Data, setLayer3Data] = useState();
  const [id, setId] = useState();
  const [breadcrumbData, setBreadcrumbData] = useState('');
  const [breadcrumbData2, setBreadcrumbData2] = useState('');

  const router = useRouter()
  const dispatch = useDispatch()
  let displayTabData = useSelector((state) => state.allCategory?.tabName)


  useEffect(() => {
    // console.log("courseDetail 21",courseDetail)
    if (courseDetail) {
      setLayer1Data(courseDetail);
    }
  }, [courseDetail]);


  // console.log('tabsssss', displayTabData)

  const handleShowData = async () => {
    // if(courseDetail?.revert_api == "1#2#0#0" || courseDetail?.revert_api == "0#2#0#0"){
    //   await getLayer3Data(displayTabData?.index) 
    // }
    // // await setLayer1()
    // // console.log('uuuuuuuu', showLayer)
    dispatch(reset_tab())
  }

  useEffect(() => {
    if(displayTabData.layer) {
      handleShowData()
    }
    else{
      console.log("layer11111")
      if(layer1Data?.revert_api == "1#0#0#0" || layer1Data?.revert_api == "0#0#0#0"){
        setShowLayer("layer1");
        return () => setShowLayer("layer1");
      }
      else if(layer1Data?.revert_api == "1#1#0#0" || layer1Data?.revert_api == "0#1#0#0") {
        console.log("heyy yyy")
        getLayer2Data(0);
      }
      else if(layer1Data?.revert_api == "1#2#0#0" || layer1Data?.revert_api == "0#2#0#0") {
        console.log("here")
        setShowLayer("layer1")
      }
      else if(layer1Data?.revert_api == "1#3#0#0" || layer1Data?.revert_api == "0#3#0#0") {
        // console.log("hell")
        getLayer3Data(0)
      }

      return()=>{
        // console.log("testttt", layer1Data?.revert_api)
      }
    }
  }, [courseDetail, keyValue]);

  const getLayer2Data = (index, title) => {
    // window.scroll(0,0)
    setBreadcrumbData(title)
    setLayer1Index(index);
    setShowLayer("layer2");
    setLayer2List(layer1Data.meta?.list[index]);
    // console.log(layer1Data.meta?.list[index]);
  };

  // console.log('layer2list', layer2List)

  const getLayer3Data = async (index, title) => {
    // window.scroll(0,200)
    setBreadcrumbData2(title)
    setShowLayer("layer3");
    setLayer2Index(index);

    const subj_id = () => {
      console.log(courseDetail)
      if(layer1Data?.revert_api == "1#1#0#0" || layer1Data?.revert_api == "1#3#0#0" || layer1Data?.revert_api == "0#1#0#0" || layer1Data?.revert_api == "0#3#0#0") {
        return 0;
      }
      else {
        if(layer1Data?.revert_api == "0#0#0#0" || layer1Data?.revert_api == "1#0#0#0"){
          return layer1Data.meta?.list[0]?.id
        }
        else {
          return layer1Data?.meta?.list[index]?.id
        }
      }
    }

    const topi_id = () => {
      if(layer1Data?.revert_api == "1#2#0#0" || layer1Data?.revert_api == "1#3#0#0" || layer1Data?.revert_api == "0#2#0#0" || layer1Data?.revert_api == "0#3#0#0") {
        return 0;
      }
      else {
        return layer2List?.list[index].id;
      }
    }
    const data = {
      tile_id: layer1Data?.id && layer1Data.id,
      type: layer1Data?.type && layer1Data.type,
      revert_api: layer1Data?.revert_api && layer1Data.revert_api,
      topic_id: topi_id(),
      subject_id: subj_id(),
      layer: 3,
      page: 1,
    };
    // console.log('data', data)
    const result = await getDetail(data);   /// Api Call
    // const result = "";
    // console.log('result', result);
    setLayer3Data(result);
  };

  const getDetail = async (data) => {
    try{
      // console.log(data)
      const token = get_token();
      const formData = {
        course_id: CourseID,
        tile_id: data.tile_id,
        type: data.type,
        revert_api: data.revert_api,
        topic_id: data.topic_id,
        subject_id: data.subject_id,
        layer: data.layer,
        page: data.page,
        parent_id: ''
        
      }
      // console.log('formData', formData)
      const response_getMasterData_service = await getMasterDataService(encrypt(JSON.stringify(formData), token))
      const response_getMasterData_Data = decrypt(response_getMasterData_service.data, token);
      console.log('response_getMasterData_Data', response_getMasterData_Data.data)
      if(response_getMasterData_Data.status) {
        return response_getMasterData_Data.data
      }
    } catch (error) {
      console.log("error found: ", error)
      toast.error("Server Error")
      // router.push('/')
    }
  };

  const handleRead = (value) => {
    // console.log("Read Now", value);
    const isLoggedIn = localStorage.getItem("jwt");
    if(!isLoggedIn) {
      setModalShow(true);
    }
    else {
      // router.push(`/private/myProfile/view-pdf/${encodeURIComponent(value.file_url)}`)
      // window.open(value)
      if (typeof window !== "undefined") {
        window.open(value.file_url, "_blank");
      }
    }
  };

  const handleWatch = (data, index) => {
    const isLoggedIn = localStorage.getItem("jwt");
    if(!isLoggedIn) {
      setModalShow(true);
    }
    else {
      // router.push(`/private/myProfile/view-pdf/${encodeURIComponent(value.file_url)}`)
      dispatch(all_tabName(
        {
          index,
          tab: keyValue,
          layer: showLayer
        }
      ))
      router.push({
        pathname: `/private/myProfile/play/${data.id}`,
        query: data,
      });
      // router.push(`/private/myProfile/play/${data.file_url}&type=${data.file_type}`)
      // console.log('watch')
    }
  }

  const setLayer1 = () => {
    console.log('layer1Data87687868', courseDetail)
    if(courseDetail?.revert_api == "1#0#0#0" || courseDetail?.revert_api == "0#0#0#0" || courseDetail?.revert_api == "1#0#0#1"){
      setShowLayer("layer1")
    }
    else if(courseDetail?.revert_api == "1#1#0#0" || courseDetail?.revert_api == "0#1#0#0") {
      setShowLayer("layer2")
    }
    else if(courseDetail?.revert_api == "1#2#0#0" || courseDetail?.revert_api == "0#2#0#0"){
      console.log('hel')
      setShowLayer("layer2");
    }
  }

  const setLayer2 = () => {
    console.log('layer1Data', courseDetail)
    if(courseDetail?.revert_api == "1#0#0#0" || courseDetail?.revert_api == "0#0#0#0" || courseDetail?.revert_api == "1#0#0#1"){
      setShowLayer("layer2")
    }
    else if(courseDetail?.revert_api == "1#1#0#0" || courseDetail?.revert_api == "0#1#0#0"){
      setShowLayer("layer2")
    }
    else if(courseDetail?.revert_api == "1#2#0#0" || courseDetail?.revert_api == "0#2#0#0"){
      setShowLayer("layer1")
    }
  }
  const handleLayer1Click = (i, item) => {
    if(layer1Data?.revert_api == "1#2#0#0" || layer1Data?.revert_api == "0#2#0#0"){
      getLayer3Data(i, item.title) 
    }
    else getLayer2Data(i, item.title)
  }

  const handleLayer2Click = (i, item) => {
    getLayer3Data(i, item.title)
  }
console.log('layer2List', layer2List)
  return (<>
    <LoginModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
      />
      <Toaster position="top-right" reverseOrder={false} toastOptions={{duration: 1500}}/>
    <div className="container-fluid p-4 pt-0" >
      <section className="p-3 page-section-6">
        <div className=" custom-breadcrumb" >
          {/* <span
            ref={resetRef}
            className={showLayer == "layer1" ? "breadcrumb" : "breadcrumb"}
            onClick={() => {
              setShowLayer("layer1");
            }}
          >
            {showLayer == "layer1" ||
            showLayer == "layer2" ||
            showLayer == "layer3"
              ? // ? ` > ${layer2List.title}`
                `Subjects >`
              : ""}
          </span> */}
          <span
            ref={resetRef}
            className={
              showLayer == "layer2" ? "active-breadcrumb" : "breadcrumb"
            }
            onClick={setLayer1}
          >
            {/* {(layer2List != undefined && showLayer == "layer2") || */}
            {(showLayer == "layer2" || showLayer == "layer3") && breadcrumbData
              ? // ? ` > ${layer2List.title}`
              <>
                {breadcrumbData} <i className="bi bi-chevron-right"></i>
              </>
              : ""}
          </span>
          <span
            className={
              showLayer == "layer3" ? "active-breadcrumb" : "breadcrumb"
            }
            onClick={setLayer2}
          >
            {showLayer == "layer3" && breadcrumbData2
              ? // ? ` > ${layer2List.list[layer2Index].title}`
              <>
                {breadcrumbData2} <i className="bi bi-chevron-right"></i>
              </>
              : ""}
          </span>
        </div>
        <div className="py-2 contentHeight">
        {showLayer == "layer3" ? (
            layer3Data?.list?.length> 0 ? (
              layer3Data?.list?.map((item, i) => {
          // PDF_Ary ? (
          //   PDF_Ary.map((item, i) => {
              return (
                <div
                  className=" pg-tabs-description mt-3"
                  key={i}
                //   onClick={() => handleOpenVideo(item)}
                >
                  <div className="tabs-deschovr d-flex align-items-center rounded">
                    <div className="w-100 pg-sb-topic d-flex align-items-center justify-content-between">
                      <div className="d-flex justify-content-between">
                        <img
                          src={item.thumbnail_url ? item.thumbnail_url : "/assets/images/noImage.jfif"}
                          height={"60px"}
                        />
                        {/* <i className="fa fa-file-text" aria-hidden="true"></i> */}
                        <div className="subjectDetails">
                          <p className="m-0 sub_name">{item.title}</p>
                          {item.role == "PDF" && (
                            <p className="m-0 sub_topics">
                              {item.release_date}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="pg-sb-topic pe-2">
                        {/* {console.log('dat', layer1Data.type)} */}
                        <div className="btnsalltbba text-center d-flex">
                          {" "}
                          {
                          // (isLogin && 
                          item.is_purchased == 0 ?
                          // item.is_locked == "1" ? 
                          // <>
                          //   <img style={{ width: "32px" }} src="/assets/images/locked.png" alt="" />
                          // </>
                          // :
                            item.is_locked == 0 ?
                            <>
                            {layer1Data.type == "pdf" && <Button1 value="Read" handleClick={handleRead} /> }
                            {layer1Data.type == "video" && <Button1 value="Watch Now" handleClick={handleWatch(item, i)} />}
                            {layer1Data.type == "test" && <Button1 value="Test" />}
                            </>
                            :
                            <>
                              <img style={{ width: "32px" }} src="/assets/images/locked.png" alt="" />
                            </>
                          :
                          <>
                          {/* {console.log('item', item)} */}
                          {layer1Data?.type == "pdf" && <Button1 value="Read" handleClick={() => handleRead(item)} /> }
                          {layer1Data?.type == "video" && <Button1 value="Watch Now" handleClick={() => handleWatch(item, i)} />}
                          {layer1Data?.type == "test" && <Button1 value="Test" />}
                          </>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            showError ? 
              <ErrorPageAfterLogin />
              :
              <LoaderAfterLogin />
            
          )
        ) : showLayer == "layer2" ? (
            layer2List &&
            layer2List?.list?.map((item, i) => {
          // topic_PDF_Ary &&
          // topic_PDF_Ary.map((item, i) => {
            return (
              <div
                className=" pg-tabs-description mt-3"
                onClick={() => handleLayer2Click(i, item)}
                key={i}
              >
                <div className="tabs-deschovr d-flex align-items-center rounded">
                  <div
                    className="pg-sb-topic d-flex align-items-center"
                    style={{ width: "97%" }}
                  >
                    <span className="videoimage">
                      <img
                        src={
                          item.image_icon ? (item.image_icon.length
                            ? item.image_icon
                            : item.image)
                          : '/assets/images/noImage.jfif'
                        }
                        height={"60px"}
                      />
                      {/* <img src={item} height={'50px'}/> */}
                      {/* <i className="fa fa-file-text" aria-hidden="true"></i> */}
                    </span>

                    {/* <h3>{item.title}</h3> */}
                    <div className="subjectDetails">
                      <p className="m-0 sub_name">{item.title}</p>
                      {item.role == "subject" && (
                        <p className="m-0 sub_topics">{item.content} Topics</p>
                      )}
                      {item.role == "topic" && (
                        <p className="m-0 sub_topics">{item.content} PDF's</p>
                      )}
                    </div>
                  </div>
                  <div className="pg-sb-topic pe-2">
                    <span className="rightChevron">
                      {/* {item.is_locked == '0' ?   */}
                      {/* <i className="fa fa-angle-right" aria-hidden="true"></i> */}
                      <IoIosArrowForward />
                      {/* :  <img src={lock_icon}/>} */}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          showLayer == "layer1" &&
            layer1Data &&
            layer1Data?.meta?.list?.map((item, i) => {
          // subject_PDF_Ary &&
          // subject_PDF_Ary.map((item, i) => {
            return (
              <div
                className=" pg-tabs-description mt-3"
                onClick={() => handleLayer1Click(i, item)}
                key={i}
              >
                {/* {console.log('item.title', item)} */}
                <div className="tabs-deschovr d-flex align-items-center rounded">
                  <div
                    className="pg-sb-topic d-flex align-items-center"
                    style={{ width: "97%" }}
                  >
                    <span className="videoimage">
                      <img
                        src={
                          item.image_icon ? (item.image_icon.length
                            ? item.image_icon
                            : item.image)
                          : '/assets/images/noImage.jfif'
                        }
                        height={"60px"}
                      />
                      {/* <img src={item} height={'50px'}/> */}
                      {/* <i className="fa fa-file-text" aria-hidden="true"></i> */}
                    </span>

                    {/* <h3>{item.title}</h3> */}
                    <div className="subjectDetails">
                      <p className="m-0 sub_name">{item.title}</p>
                      {item.role == "subject" && (
                        <p className="m-0 sub_topics">{item.content} Topics</p>
                      )}
                      {item.role == "topic" && (
                        <p className="m-0 sub_topics">{item.content} PDF's</p>
                      )}
                    </div>
                  </div>
                  <div className="pg-sb-topic pe-2">
                    <span className="rightChevron text-center">
                      {/* {item.is_locked == '0' ?   */}
                      {/* <i className="fa fa-angle-right" aria-hidden="true"></i> */}
                      <IoIosArrowForward />
                      {/* :  <img src={lock_icon}/>} */}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
      </section>
    </div>
    </>);
};

export default Notes;