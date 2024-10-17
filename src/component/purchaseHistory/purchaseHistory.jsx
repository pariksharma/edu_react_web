import {
  getFPaymentService,
  getMyOrderService,
  getPayGatewayService,
  pendingInstallmentService,
} from "@/services";
import { decrypt, encrypt, get_token } from "@/utils/helpers";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { format } from "date-fns";
import Button1 from "../buttons/button1/button1";
import ErrorPage from "../errorPage";
import Script from "next/script";
import ThankyouModal from "../modal/thankyouModal";
import LoaderAfterLogin from "../loaderAfterLogin";
import Button2 from "../buttons/button2/button2";
import ExtendValiditymodal from "../modal/extendValiditymodal";
const PurchaseHistory = () => {
  const [myOrder, setMyOrder] = useState([]);
  // const [addedDate, setAddedDate] = useState('');
  const [installments, setInstallments] = useState({});
  const [thankYouModalShow, setThankYouModalShow] = useState(false)
  const [showError, setShowError] = useState(false)
  const [validityShow, setValidityShow] = useState(false);
  const [validityDetail, setValidityDetail] =useState([])

  const token = get_token();
  const router = useRouter();

  useEffect(() => {
    setShowError(false);
    fetchMyOrders();
  }, []);

  useEffect(() => {
    if(thankYouModalShow) {
      setTimeout(() => {
        setThankYouModalShow(false)
      }, 3000)
    }
  }, [thankYouModalShow])

  // useEffect(() => {
  //   // Fetch installments for orders with payment_mode == 1
  //   myOrder.forEach((item) => {
  //     if (item.payment_mode === 1) {
  //       handleInstallments(item.subscription_code);
  //     }
  //   });
  // }, [myOrder]);

  // const fetchMyOrders = async () => {
  //   const formData = {
  //     page: 1,
  //     type: 1,
  //   };
  //   const response_getMyOrder_service = await getMyOrderService(
  //     encrypt(JSON.stringify(formData), token)
  //   );
  //   const response_getMyOrder_data = decrypt(
  //     response_getMyOrder_service.data,
  //     token
  //   );
  //   if(response_getMyOrder_data.status){
  //     setMyOrder(response_getMyOrder_data.data)
  //   }
  //   else {
  //     if(response_getMyOrder_data.message == msg) {
  //       toast.error(response_getMyOrder_data.message);
  //           localStorage.removeItem('jwt');
  //           localStorage.removeItem('user_id');
  //           if(router.pathname.startsWith('/private')){
  //             router.push('/')
  //           }
  //           else location.reload();
  //     }
  //   }
  //   console.log("response_getMyOrder_data", response_getMyOrder_data);
  // };

  const fetchMyOrders = async () => {
    const formData = {
      page: 1,
      type: 1,
    };
    try {
      const response_getMyOrder_service = await getMyOrderService(
        encrypt(JSON.stringify(formData), token)
      );
      const response_getMyOrder_data = decrypt(
        response_getMyOrder_service.data,
        token
      );

      if (response_getMyOrder_data?.status) {
        if(response_getMyOrder_data?.data?.length == 0){ 
          setShowError(true)
        }
        else{
        // console.log('response_getMyOrder_data222', response_getMyOrder_data.data)
        const uniqueOrders = response_getMyOrder_data.data.reduce(
          (acc, order) => {
            if (!acc.find((o) => o.id === order.id)) {
              acc.push(order);
            }
            return acc;
          },
          []
        );
        setMyOrder(uniqueOrders);

        // Filter orders with payment_mode == 1
        const paymentMode1Orders = uniqueOrders.filter(
          (order) => order.payment_mode == 1
        );

        // Fetch installments for each subscription_code
        const installmentsPromises = paymentMode1Orders.map(async (order) => {
          try{
            const formData = {
              subscription_code: order.subscription_code,
              course_id: order.id,
              // subscription_code: "1725003555187616",
              // course_id: 414
            };
            const response = await pendingInstallmentService(
              encrypt(JSON.stringify(formData), token)
            );
            const data = decrypt(response.data, token);
            console.log("data", data);
            if (data.status) {
              return {
                subscription_code: order.subscription_code,
                data: data.data,
              };
            }
            return { subscription_code: order.subscription_code, data: [] };
          } catch (error) {
            console.log("error found: ", error)
            router.push('/')
          }
        });

        // Wait for all installment fetches to complete
        const installmentsResults = await Promise.all(installmentsPromises);

        // Convert the results into a dictionary for easy access
        const installmentsMap = installmentsResults.reduce((acc, curr) => {
          acc[curr.subscription_code] = curr.data;
          return acc;
        }, {});

        setInstallments(installmentsMap);
        }
      } else {
        setShowError(true)
        if (response_getMyOrder_data.message === msg) {
          toast.error(response_getMyOrder_data.message);
          localStorage.removeItem("jwt");
          localStorage.removeItem("user_id");
          if (router.pathname.startsWith("/private")) {
            router.push("/");
          } else {
            location.reload();
          }
        }
      }
      console.log("response_getMyOrder_data", response_getMyOrder_data);
    } catch (error) {
      console.error("Error fetching orders or installments:", error);
      toast.error("An error occurred while fetching data.");
    }
  };

  const formatDate = (value) => {
    const cr_date = new Date(value * 1000);
    if (cr_date) {
      // setDate(cr_date.toString().substring(0, cr_date.toString().indexOf('GMT')))
      return format(cr_date, "MMM d, yyyy");
    }
  };
  const handleInstallments = async (code) => {
    try{
      const formData = {
        subscription_code: code,
      };
      const response_pendingInstallment_service = await pendingInstallmentService(
        encrypt(JSON.stringify(formData), token)
      );
      const response_pendingInstallment_data = decrypt(
        response_pendingInstallment_service.data,
        token
      );
      console.log(
        "response_pendingInstallment_data",
        response_pendingInstallment_data
      );
      if (response_pendingInstallment_data.status) {
        return response_pendingInstallment_data.data;
      }
    } catch (error) {
      console.log("error found: ", error)
    }
  };

  const handlePayNow = async (item, installment) => {
    try{
      console.log("EMi installments", item);
      console.log("pay now", installment);
      const isLoggedIn = localStorage.getItem("jwt");
      if (isLoggedIn) {
        const formData = {};
        const response_getPayGateway_service = await getPayGatewayService(
          encrypt(JSON.stringify(formData), token)
        );
        const response_getPayGateway_data = decrypt(
          response_getPayGateway_service.data,
          token
        );
        const payName = response_getPayGateway_data?.data?.rzp?.status == 1 ? 
                          response_getPayGateway_data?.data?.rzp?.meta_name
                          : response_getPayGateway_data?.data?.easebuzz?.meta_name;
        if (
          response_getPayGateway_data.status
        ) {
          const razoparPayData = response_getPayGateway_data?.data?.rzp;
          const formDataPayment = {
            coupon_applied: 0,
            course_id: item.id,
            course_price: parseFloat(installment && installment?.emi_mrp).toFixed(
              2
            ),
            delivery_charge: item?.delivery_charge ? item?.delivery_charge : 0,
            pay_via: payName == "RZP_DETAIL" ? 3 : 9,
            //quantity:1
            tax: parseFloat(installment && installment?.emi_tax).toFixed(2),
            type: 1,
            //temp: 2
            subscription_code: installment.subscription_code
              ? installment.subscription_code
              : 0,
            plan_id: installment && installment?.plan_id,
            // payment_meta: installment && JSON.stringify(installment),
            payment_mode: "1",
          };
          // console.log('option', formDataPayment)
          const response_getFPayment_service = await getFPaymentService(
            encrypt(JSON.stringify(formDataPayment), token)
          );
          console.log(
            "response_getFPayment_service",
            response_getFPayment_service
          );
          const response_getFPayment_data = decrypt(
            response_getFPayment_service.data,
            token
          );
          let key = response_getPayGateway_data?.data?.easebuzz?.mid;
          console.log("response_getFPayment_data", response_getFPayment_data);
          if (response_getFPayment_data.status) {
            // console.log(response.razorpay_payment_id)
            if(response_getPayGateway_data?.data?.rzp?.status == 1) {
            try {
              const options = {
                key: razoparPayData.key, // Again, for client-side
                amount: parseFloat(installment.total_mrp).toFixed(2) * 100,
                currency: "INR",
                method: {
                  emi: false,
                },
                // Other options as needed
                handler: function (response) {
                  // Payment was successful
                  const orderDetails = {
                    txnid: response_getFPayment_data.data.pre_transaction_id,
                    payid: response.razorpay_payment_id,
                    pay_via: 3,
                  };
                  console.log("Payment ID:", response.razorpay_payment_id);
                  console.log("Order ID:", response.razorpay_order_id);
                  console.log("Signature:", response.razorpay_signature);
                  let status = 1;
                  paymentConfirmation(status, orderDetails, item.id);
                },
              };
              console.log("option", options);
              const instance = new Razorpay(options);
              instance.on("payment.failed", function (response) {
                toast.error("Payment failed!");
              });
              instance.open();
            } catch (error) {
              toast.error(error);
            }
          }
          else if(response_getPayGateway_data?.data?.easebuzz?.status == 1){
            paymentGateWay(response_getFPayment_data?.data?.txnToken, key, item.id);
          } 
          } else {
            toast.error(response_getFPayment_data.message);
            if (
              response_getFPayment_data.message ==
              "You are already logged in with some other devices, So you are logged out from this device. 9"
            ) {
              localStorage.removeItem("jwt");
              localStorage.removeItem("user_id");
              router.pathname.startsWith("/private")
                ? router.push("/")
                : location.reload();
            }
          }
        } else {
          if (response_getPayGateway_data.status) {
            toast.error("We're facing some technical issue");
          } else toast.error(response_getPayGateway_data.false);
        }
      }
    } catch (error) {
      console.log("error found: ", error)
    }
  };

  //////////////////////////////// EaseBuzz Payment Service ////////////////////////////////////////////////

  const paymentGateWay = async (acc_key, key, id) => {
    try{
      var easebuzzCheckout = new window.EasebuzzCheckout(
        key,
        process.env.NEXT_PUBLIC_TYPE
      );
      var options = {
        access_key: acc_key, // access key received via Initiate Payment
        onResponse: (response) => {
          console.log(response);
          // post_transaction_id
          const order_details = {
            txnid: response.txnid,
            payid: response.easepayid,
            pay_via: 9,
          };
          let status = response.status == "success" ? 1 : 0;
          console.log('responsey8778', response)
          // loading(true);
          paymentConfirmation(status, order_details, id);
          //   const formData = new FormData();
          //   formData.append('type', 2);
          //   formData.append('course_id', courseId);
          //   formData.append('course_price', stringToFloat(detail.mrp));
          //   formData.append('tax',stringToFloat(detail.tax));
          //   formData.append('pay_via', 9);
          //   formData.append('coupon_applied', 0);
          //   formData.append('pre_transaction_id',response.txnid);
          //   formData.append('transaction_status', status);
          //   formData.append('post_transaction_id', response.easepayid);
          //    getFPaymentService(formData).then(res =>{
          //     let {data, status, message} = resHandler(res);
          //   //  status && console.log(data)
          //    status && sendDataToParent(order_details);
          //    loading(false)

          // }).catch(err =>{
          //   console.log(err)
          // })
        },
        theme: "#123456", // color hex
      };

      await easebuzzCheckout.initiatePayment(options);
      // console.log(JSON.stringify(selectedPaymentGateway))
    } catch (error) {
      console.log("error found: ", error)
      // router.push('/')
    }
  };

  //////////////////////////////// Payment Confirmation Service ////////////////////////////////////////////////

  const paymentConfirmation = async (status, data, id) => {
    try {
      const formDataConfirm = {
        type: 2,
        course_id: id,
        pre_transaction_id: data.txnid,
        transaction_status: status,
        post_transaction_id: data.payid,
      };
      console.log("formDataConfirm", formDataConfirm);
      const response_ConfirmPayment_service = await getFPaymentService(
        encrypt(JSON.stringify(formDataConfirm), token)
      );
      const response_ConfirmPayment_data = decrypt(
        response_ConfirmPayment_service.data,
        token
      );
      console.log("response_ConfirmPayment_data", response_ConfirmPayment_data);
      if (response_ConfirmPayment_data.status) {
        // toast.success(response_ConfirmPayment_data.message);
        setThankYouModalShow(true)
        fetchMyOrders();
        //   if (titleName == "Bookstore" || titleName == "e-Book") {
        //     router.push("/private/myProfile/ourCourse");
        //   } else {
        //     router.push("/private/myProfile/MyCourse");
        //   }
        // } else {
        //   toast.error(response_ConfirmPayment_data.message);
      }
      else {
        if(response_ConfirmPayment_data.message != "The transaction_status field must be one of: 1,2."){
          showErrorToast(response_ConfirmPayment_data.message);
        }
        else{
          showErrorToast("Payment Cancelled!")
        }
      }
    } catch (error) {
      console.log("error found: ", error)
    }
  };

  const handleInvoice = (pdfUrl) => {
    if (typeof window !== "undefined") {
      window.open(pdfUrl, "_blank");
    }
  };


  const checkEMIStatus = (givenTimestamp ) => {
    const givenDate = new Date(givenTimestamp * 1000); // multiply by 1000 to convert seconds to milliseconds

    // Get the current date's timestamp in milliseconds and convert it to seconds
    const currentDate = new Date();
    const currentTimestamp = Math.floor(currentDate.getTime() / 1000); // divide by 1000 to convert milliseconds to seconds

    // Compare the two timestamps
    if (currentTimestamp >= givenTimestamp) {
      console.log("Current date is greater than the given date.");
      return "Upcoming"
    } else if (currentTimestamp < givenTimestamp) {
      console.log("Given date is greater than the current date.");
      return "Overdue"
    } 
    else {
      console.log("Both dates are equal.");
      return "due"
    }
  }

  const handleExtendValidity = (value) => {
    console.log('item2222', value)
    setValidityShow(true)
    setValidityDetail(value)
    // console.log('extend', value)
  }

  const handleSelectedValidity = (selectedPack, courseData) => {
    console.log("Clicked ==========12345", selectedPack);
    setValidityShow(false)
    handleValidityPayNow(selectedPack, courseData)
  };


  const handleValidityPayNow = async (item, courseData) => {
    console.log('courseData', courseData)
    try{
      // console.log("EMi installments", item);
      console.log("pay now", item);
      const isLoggedIn = localStorage.getItem("jwt");
      if (isLoggedIn) {
        const formData = {};
        const response_getPayGateway_service = await getPayGatewayService(
          encrypt(JSON.stringify(formData), token)
        );
        const response_getPayGateway_data = decrypt(
          response_getPayGateway_service.data,
          token
        );
        const payName = response_getPayGateway_data?.data?.rzp?.status == 1 ? 
                          response_getPayGateway_data?.data?.rzp?.meta_name
                          : response_getPayGateway_data?.data?.easebuzz?.meta_name;
        if (
          response_getPayGateway_data.status
        ) {
          const razoparPayData = response_getPayGateway_data?.data?.rzp;
          const formDataPayment = {
            course_id: item.course_id,
            extender_id: item.id,
            pay_via: payName == "RZP_DETAIL" ? 3 : 9,
            txn_id: courseData.txn_id,
            type: "3"
          };
          // console.log('option', formDataPayment)
          const response_getFPayment_service = await getFPaymentService(
            encrypt(JSON.stringify(formDataPayment), token)
          );
          console.log(
            "response_getFPayment_service",
            response_getFPayment_service
          );
          const response_getFPayment_data = decrypt(
            response_getFPayment_service.data,
            token
          );
          let key = response_getPayGateway_data?.data?.easebuzz?.mid;
          console.log("response_getFPayment_data", response_getFPayment_data);
          if (response_getFPayment_data.status) {
            // console.log('price', item.price)
            if(response_getPayGateway_data?.data?.rzp?.status == 1) {
            try {
              const options = {
                key: razoparPayData.key, // Again, for client-side
                amount: parseFloat(item.price).toFixed(2) * 100,
                // amount: 100 * 100,
                currency: "INR",
                method: {
                  emi: false,
                },
                // Other options as needed
                handler: function (response) {
                  // Payment was successful
                  const orderDetails = {
                    txnid: response_getFPayment_data.data.pre_transaction_id,
                    payid: response.razorpay_payment_id,
                    pay_via: 3,
                  };
                  console.log("Payment ID:", response.razorpay_payment_id);
                  console.log("Order ID:", response.razorpay_order_id);
                  console.log("Signature:", response.razorpay_signature);
                  let status = 1;
                  paymentValidityConfirmation(status, orderDetails, item.course_id, courseData);
                },
              };
              const instance = new Razorpay(options);
              console.log("option", options);
              instance.on("payment.failed", function (response) {
                toast.error("Payment failed!");
              });
              instance.open();
            } catch (error) {
              toast.error(error);
            }
          }
          else if(response_getPayGateway_data?.data?.easebuzz?.status == 1){
            paymentValidityGateWay(response_getFPayment_data?.data?.txnToken, key, item.course_id, courseData);
          }
          } else {
            toast.error(response_getFPayment_data.message);
            if (
              response_getFPayment_data.message ==
              "You are already logged in with some other devices, So you are logged out from this device. 9"
            ) {
              localStorage.removeItem("jwt");
              localStorage.removeItem("user_id");
              router.pathname.startsWith("/private")
                ? router.push("/")
                : location.reload();
            }
          }
        } else {
          if (response_getPayGateway_data.status) {
            toast.error("We're facing some technical issue");
          } else toast.error(response_getPayGateway_data.false);
        }
      }
    } catch (error) {
      console.log("error found: ", error)
      // router.push('/')
    }
  };
  const paymentValidityGateWay = async (acc_key, key, id, courseData) => {
    try{
      var easebuzzCheckout = new window.EasebuzzCheckout(
        key,
        process.env.NEXT_PUBLIC_TYPE
      );
      var options = {
        access_key: acc_key, // access key received via Initiate Payment

        disable_payment_mode: 'emi',
        onResponse: (response) => {
          console.log(response);
          // post_transaction_id
          const order_details = {
            txnid: response.txnid,
            payid: response.easepayid,
            pay_via: 9,
          };
          let status = response.status == "success" ? 1 : 0;
          console.log('responsey8778', response)
          // loading(true);
          paymentValidityConfirmation(status, order_details, id, courseData);
          //   const formData = new FormData();
          //   formData.append('type', 2);
          //   formData.append('course_id', courseId);
          //   formData.append('course_price', stringToFloat(detail.mrp));
          //   formData.append('tax',stringToFloat(detail.tax));
          //   formData.append('pay_via', 9);
          //   formData.append('coupon_applied', 0);
          //   formData.append('pre_transaction_id',response.txnid);
          //   formData.append('transaction_status', status);
          //   formData.append('post_transaction_id', response.easepayid);
          //    getFPaymentService(formData).then(res =>{
          //     let {data, status, message} = resHandler(res);
          //   //  status && console.log(data)
          //    status && sendDataToParent(order_details);
          //    loading(false)

          // }).catch(err =>{
          //   console.log(err)
          // })
        },
        theme: "#123456", // color hex
      };

      await easebuzzCheckout.initiatePayment(options);
      // console.log(JSON.stringify(selectedPaymentGateway))
    } catch (error) {
      console.log("error found: ", error)
      // router.push('/')
    }
  };

  //////////////////////////////// Payment Confirmation Service ////////////////////////////////////////////////

  const paymentValidityConfirmation = async (status, data, id, courseData) => {
    try{
      console.log('confirm', courseData)
      const formDataConfirm = {
        type: 4,
        course_id: id,
        pre_transaction_id: data.txnid,
        transaction_status: status,
        post_transaction_id: data.payid,
        txn_id: courseData.txn_id,
      };
      console.log("formDataConfirm", formDataConfirm);
      const response_ConfirmPayment_service = await getFPaymentService(
        encrypt(JSON.stringify(formDataConfirm), token)
      );
      const response_ConfirmPayment_data = decrypt(
        response_ConfirmPayment_service.data,
        token
      );
      console.log("response_ConfirmPayment_data", response_ConfirmPayment_data);
      if (response_ConfirmPayment_data.status) {
        // toast.success(response_ConfirmPayment_data.message);
        setThankYouModalShow(true);
        // setGetCourse(data.payid)
        fetchMyOrders();
        //   if (titleName == "Bookstore" || titleName == "e-Book") {
        //     router.push("/private/myProfile/ourCourse");
        //   } else {
        //     router.push("/private/myProfile/MyCourse");
        //   }
        // } else {
        //   toast.error(response_ConfirmPayment_data.message);
      }
      else {
        if(response_ConfirmPayment_data.message != "The transaction_status field must be one of: 1,2."){
          showErrorToast(response_ConfirmPayment_data.message);
        }
        else{
          showErrorToast("Payment Cancelled!")
        }
      }
    } catch (error) {
      console.log("error found: ", error)
      // router.push('/')
    }
  };
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Script 
        src="https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/v2.0.0/easebuzz-checkout-v2.min.js" 
      />
      <ThankyouModal
        show={thankYouModalShow}
        onHide = {() => setThankYouModalShow(false)}
      />
      <ExtendValiditymodal
      show={validityShow}
      onHide={() => {
        setValidityShow(false);
      }}
      handleSelectedValidity = {handleSelectedValidity}
      courseDetail={validityDetail && validityDetail}
      // editReviewData = {editReviewData}
    />
      {myOrder?.length > 0 ? (
        <div className="container-fluid mt-1 mb-4">
          <div className="row mt-3">
            <div className="history_List col-sm-12 col-md-12 col-lg-12 mb-3 ">
              {myOrder &&
                myOrder.map((item, index) => {
                  return (
                    <div className="card historyCard px-2 py-2 mb-2" key={index}>
                      <div class="row align-items-center">
                        {/* <tr className=""> */}
                        <div class="col-12 col-md-2 mb-2 mb-md-0 purchaseThumbnail">
                           <div> <img
                              className="img-fluid"
                              src={item?.desc_header_image ? item.desc_header_image : '/assets/images/noImage.jfif'}
                            />
                            </div>
                            {/* <IoCloseCircleOutline /> */}
                          </div>
                          {/* <td style={{ width: "224px" }}>
                            <div className="w-100 m-0">
                              <h4 className="mb-1 H_title">{item.title}</h4>
                              <p className="m-0 historyDate">
                                <span>Added: </span>{" "}
                                {formatDate(JSON.parse(item.purchase_date))}
                              </p>
                            </div>
                          </td> */}
                          {/* <!-- Course Details Section --> */}
                          <div class="col-12 col-md-3 mb-2 mb-md-0">
                            <h6 class="mb-1 H_title">{item.title}</h6>
                            <p class="m-0 text-muted"><span>Added:</span> {formatDate(JSON.parse(item.purchase_date))}</p>
                          </div>
                          {/* <td style={{ width: "180px" }}>
                            <p className="m-0 historyDate">
                              <span>Expired On:</span>{" "}
                              {formatDate(JSON.parse(item.expiry_date))}
                            </p>
                          </td> */}
                          <div class="col-6 col-md-2 mb-2 mb-md-0">
                            <p class="m-0 text-muted"><span>Expired On:</span> {formatDate(JSON.parse(item.expiry_date))}</p>
                          </div>
                          {/* <td style={{ width: "150px" }}>
                            <p className="m-0 historyDate">
                              <span className="p-1">Order ID: </span>
                              {item.txn_id}
                            </p>
                          </td> */}
                          <div class="col-6 col-md-2 mb-2 mb-md-0">
                            <p class="m-0 text-muted"><span>Order ID: </span>{item.txn_id}</p>
                          </div>
                          {/* <td style={{ width: "122px" }}>
                            <p className="m-0 historyDate">
                              <span className="p-1">Amount: </span>
                              <FaRupeeSign className="rupeeSign" />
                              {item.payment_mode == 1
                                ? item.emi_payment
                                : item.mrp}
                            </p>
                          </td> */}
                          <div class="col-6 col-md-2 mb-2 mb-md-0">
                            <p class="m-0">
                              <span>Amount: </span>
                              <FaRupeeSign className="rupeeSign" />{item.payment_mode == 1
                                ? item.emi_payment
                                : item.mrp}
                              </p>
                              {item.payment_mode && item.payment_mode == 0 && (
                              <>
                                {item.mrp != 0 &&
                                  <p class="m-0 text-success">Paid</p>
                                
                                }
                                <>
                                  {item.invoice_url && (
                                    <div class="col-6 col-md-1 text-end d-flex">
                                      <Button1
                                        value={"Download"}
                                        handleClick={() =>
                                          handleInvoice(item.invoice_url)
                                        }
                                      />
                                      <>
                                      &nbsp;
                                      </>
                                      {/* {console.log('item', item)} */}
                                      {item?.prices?.length > 0 &&
                                        <Button2 value="Extend Validity" handleClick={() => handleExtendValidity(item)} />
                                      }
                                      {/* <button class="btn btn-warning">Download <i class="bi bi-download"></i></button> */}
                                   </div>
                                  )}
                                </>
                              </>
                              )
                              }
                          </div>
                      {/* {
                      item.payment_mode == 1 && 
                      handleInstallments(item.subscription_code).map((item, index) => { */}
                      {/* {item.payment_mode === 1 && installments[item.subscription_code] && (
                      installments[item.subscription_code].map((installment, idx) => (
                      <>
                      
                        <div className="py-2 d-flex align-items-center">
                          <p className="">
                            Transaction Date: Jul 1st, 2024
                          </p>
                          <p className="">
                            Amount: <FaRupeeSign className="rupeeSign" />300.0
                          </p>
                          <p className="">
                            Paid
                          </p>
                          <p className="">
                            <Button1 value={"Download Invoice"} />
                          </p>
                          </div>
                          </>
                      )))
                      } */}
                      {item.payment_mode == 1 &&
                        installments[item.subscription_code] &&
                        installments[item.subscription_code].map(
                          (installment, idx) => (
                            <div
                              className="col-md-12 my-3 "
                              key={idx}
                            >
                              {console.log('installment', installment)}
                              <div className="card child_historyCard"><p className="m-0 purchaseStripe">Installment {idx+1}</p>
                              <table>
                                <tr className="" key={idx}>
                                  <td className="">
                                {installment.emi_status === "Paid"
                                  ? <p className="m-0 child_Date">
                                    Transaction Date: 
                                      <span className="ms-1">
                                        {formatDate(
                                        JSON.parse(installment?.modified)
                                      )}
                                      </span>
                                      </p>
                                  : 
                                  <p className="m-0 child_Date">
                                    Due Date:
                                    <span className="ms-1">
                                      {formatDate(
                                        JSON.parse(installment?.creation_date)
                                      )}
                                    </span>
                                  </p>
                                }
                              </td>
                              <td className=""
                                style={{width: "235px"}}
                              >
                              <p className="m-0 child_Date">
                                Amount: 
                                <span className="ms-1">
                                  <FaRupeeSign className="rupeeSign" />
                                {parseFloat(
                                  Number(installment.emi_mrp) +
                                    Number(installment.emi_tax)
                                ).toFixed(2)}
                                </span>
                              </p>
                              </td>
                              <td className="" style={{ width: "135px" }}>
                                {installment.emi_status === "Paid"
                                  ? <p className="m-0 paid">Paid</p>
                                  : 
                                    checkEMIStatus(installment?.modified) == "due" ?
                                    <p className="m-0 due">Due</p>
                                    :
                                      checkEMIStatus(installment?.modified) == "Upcoming" ?
                                      <p className="m-0 due">Upcoming</p>
                                      :
                                        (checkEMIStatus(installment?.modified) == "Overdue" &&
                                          <p className="m-0 due">Overdue</p>)
                                }
                              </td>
                              <td className="" style={{ width: "118px" }}>
                                {installment.emi_status === "Paid" ? (
                                  <Button1
                                    value={"Download"}
                                    handleClick={() =>
                                      handleInvoice(installment.invoice_url)
                                    }
                                  />
                                ) : installment.emi_status === "Due" ? (
                                  <Button1
                                    value={"Pay Now"}
                                    handleClick={() =>
                                      handlePayNow(item, installment)
                                    }
                                  />
                                ) : null}
                              </td>
                            </tr>
                            </table>
                            </div>
                            </div>
                          )
                        )}
                    </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (<>
      {showError ? 
        <div className=" pt-0 flex-grow-1">
          <img src="/assets/images/BuyErrorImg.svg" alt="" />
          <h4>No Data found!</h4>
          <p>Unable to locate data, seeking alternative methods for retrieval.</p>
        </div>
        :
        <LoaderAfterLogin />
      }
      </>)}
    </>
  );
};

const msg =
  "You are already logged in with some other devices, So you are logged out from this device. 9";

export default PurchaseHistory;