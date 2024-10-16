import Footer from '@/component/footer/footer'
import Header from '@/component/header/header'
import { contactUsService } from '@/services';
import { get_token } from '@/utils/helpers';
import React, { useEffect, useState } from 'react'

const index = () => {

  const [contactUsData, setContactUsData] = useState('');
  const token = get_token();

  useEffect(() => {
    fetchContactService()
  }, [])

  const fetchContactService = async () => {
    try{
      const formData = {};
      const response_contactUs_service = await contactUsService();
      if(response_contactUs_service.status) {
        setContactUsData(response_contactUs_service.data);
      }
    } catch (error) {
      console.log("error found: ", error)
      // router.push('/')
    }
  }
  return (
    <>
      <Header />
      <div className='container-fluid p-0 mt-5' >
        <div className='' dangerouslySetInnerHTML={{ __html: contactUsData && contactUsData }}>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default index