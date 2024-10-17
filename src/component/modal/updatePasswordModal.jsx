import { sendVerificationOtpService } from "@/services";
import { decrypt, encrypt, get_token } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const UpdatePasswordModal = (props) => {
  const [isToasterOpen, setIsToasterOpen] = useState(false);
  const [getOTP, setGetOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const token = get_token();
  const logo = localStorage.getItem("logo");
  const versionData = useSelector((state) => state.allCategory?.versionData);

  useEffect(() => {
    if (isToasterOpen) {
      setTimeout(() => {
        setIsToasterOpen(false);
      }, 1000);
    }
  }, [isToasterOpen]);

  useEffect(() => {
    if (!props.show) {
      setMobile("");
      setGetOTP(false);
      setOTP("");
    }
  }, [props.show]);

  const showSuccessToast = (toastMsg) => {
    if (!isToasterOpen) {
      setIsToasterOpen(true);
      toast.success(toastMsg, {
        // onClose: () => setIsToasterOpen(false),  // Set isToasterOpen to false when the toaster closes
        autoClose: 1500,
      });
    }
  };

  const validateIndianNumber = (number) => {
    // Regular expression for Indian mobile numbers starting with 6-9
    const mobileRegex = /^[6-9]\d{9}$/;

    return mobileRegex.test(number);
  };

  const handleInputMobile = (event) => {
    if (versionData.country == 0) {
      const newNumber = event.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      if (
        !(
          newNumber.startsWith("0") ||
          newNumber.startsWith("1") ||
          newNumber.startsWith("2") ||
          newNumber.startsWith("3") ||
          newNumber.startsWith("4") ||
          newNumber.startsWith("5")
        ) &&
        newNumber.length < 11
      ) {
        setMobile(newNumber);
        setError(
          validateIndianNumber(newNumber) ? "" : "Invalid Indian number format"
        );
      }
    } else {
      setMobile(event.target.value);
    }
  };

  const handlefetchOTP = (e) => {
    e.preventDefault();
    if (mobile && mobile.length == 10) {
      fetchOTPService();
    }
  };

  const fetchOTPService = async () => {
    try {
      const formData = {
        mobile: mobile,
        resend: 0,
        is_registration: 0,
        c_code: countryCode,
        otp: 0,
      };
      const response_fetchOtp_service = await sendVerificationOtpService(
        encrypt(JSON.stringify(formData), token)
      );
      const response_fetchOtp_data = decrypt(
        response_fetchOtp_service?.data,
        token
      );
      if (response_fetchOtp_data?.status) {
        showSuccessToast(response_fetchOtp_data?.message);
      }
    } catch (error) {
      console.log("error found: ", error);
    }
  };

  return (
    <Modal
      {...props}
      size={"sm"}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <img src={logo && logo} alt="" />
      </Modal.Header>
      {!getOTP ? (
        <>
          <h4 className="l_text">Enter mobile number to continue</h4>
          <form onSubmit={handlefetchOTP}>
            <div className="input-group mb-1 mt-3">
              <span
                className="bg-white input_num input-group-text"
                id="basic-addon1"
              >
                <select className="Num_list" disabled>
                  <option value="">
                    <div className="gap-1 d-flex align-items-center">
                      <img
                        loading="lazy"
                        className=""
                        src="/assets/images/india.png"
                        alt=""
                      />
                      {countryCode}
                    </div>
                  </option>
                  {versionData.country != 0 && (
                    <option value="">
                      <div className="gap-1 d-flex align-items-center">
                        <img
                          loading="lazy"
                          className=""
                          src="/assets/images/india.png"
                          alt=""
                        />
                        {"+81"}
                      </div>
                    </option>
                  )}
                </select>
              </span>
              <input
                type="tel"
                className="mobNum"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={handleInputMobile}
              />
              {/* <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"> */}
            </div>
            <button
              className={`mt-5 btn ${
                mobile.length != 10 ? "btnDisabled" : "btnEnabled"
              }`}
              type="submit"
              // disabled = {mobile.length != 10 ? true : false}
            >
              Continue
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="l_text">
            We've sent an OTP to your registered mobile number
            <br />
            <div className="Otp_visibleNum d-flex align-items-center">
              <span>
                {versionData.country == 0
                  ? `${countryCode} ${mobile} `
                  : `${mobile} `}
              </span>
              <img
                className="ms-1 editNumLogo"
                src="/assets/images/editNumLogo.png"
                alt=""
                onClick={() => setGetOTP(false)}
              />
            </div>
          </p>
          <div className="otpContainer">
            <OtpInput
              className="d-flex gap-4 align-items-center"
              value={OTP}
              onChange={setOTP}
              numInputs={6}
              // renderSeparator={<span></span>}
              renderInput={(props) => <input {...props} />}
            />
          </div>
          {!isActive && <div id="countdown">{formatTime(timeRemaining)}</div>}
          <p className={`resendOTP ${isActive ? "active" : ""}`}>
            Didn't recieve code? <span onClick={fetchResendOTP}>Resend</span>
          </p>
          {/* <p className="resendOTP">
                            Didn't recieve code?{" "}
                            <span onClick={fetchResendOTP}>Resend</span>
                          </p> */}
          <button
            className={`verifyBtn btn btnDisabled ${
              OTP.length != 6 ? "btnDisabled" : "btnEnabled"
            }`}
            onClick={handleLoginVerifyOTP}
            // disabled = {OTP.length != 6 ? true : false}
          >
            Verify
          </button>
        </>
      )}
    </Modal>
  );
};

export default UpdatePasswordModal;
