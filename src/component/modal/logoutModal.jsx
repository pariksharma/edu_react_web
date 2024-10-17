import React from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Modal } from 'react-bootstrap'
import { decrypt, encrypt, get_token } from '@/utils/helpers'
import { userLogoutService } from '@/services'
import { useRouter } from 'next/router'

const LogoutModal = (props) => {
  
  const router = useRouter();

  const fetchLogoutService = async () => {
    try{
      const token = get_token()
      const formData = {}
      const response_userLogout_service = await userLogoutService(encrypt(JSON.stringify(formData), token));
      console.log('response_userLogout_data', response_userLogout_service)
      const response_userLogout_data = decrypt(response_userLogout_service.data, token);
      if(response_userLogout_data.status) {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user_id');
        toast.success(response_userLogout_data.message)
        if(router.pathname.startsWith('/private')){
          router.push('/')
        }
        else location.reload();
      }
      else {
        if(response_userLogout_data.message == msg) {
          toast.error(response_userLogout_data.message);
          localStorage.removeItem('jwt');
          localStorage.removeItem('user_id');
          if(router.pathname.startsWith('/private')){
            router.push('/')
          }
          else location.reload();
        }
        else {
          toast.error(response_userLogout_data.message);
          // localStorage.removeItem('jwt');
          // localStorage.removeItem('user_id');
          // router.push('/')
        }
      }
    } catch (error) {
      console.log("error found: ", error)
      router.push('/')
    }
  }
    
  const handleLogout = () => {
    fetchLogoutService();
  };

  return (
    <>
        <Modal
            {...props}
            size={"sm"}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="logOutModal"
        >
        <Toaster position="top-right" reverseOrder={false} />
            <h4 className='LogOutTitle'>Log Out</h4>
            <p className='logout_text'>Are you sure you want to Log out <br/> from this account?</p>
            <div className="gap-2 d-flex align-items-center">
              <button className="btn logOutBtn" onClick={handleLogout}>Logout</button>
              <button className="btn cancelBtn" onClick={() => props.onHide()}>Cancel</button>
            </div>
        </Modal>
    </>
  )
}

const msg = "You are already logged in with some other devices, So you are logged out from this device. 9"

export default LogoutModal