import React, { useEffect, useState } from 'react'
import Footer from '@/component/footer/footer'
import Header from '@/component/header/header'
import { aboutUsService } from '@/services'
import { decrypt, encrypt, get_token } from '@/utils/helpers'

const index = () => {

  const [aboutUsData, setAboutUsData] = useState('');
  const token = get_token()

  useEffect(() => {
    fetchAboutService()
  }, [])

  const fetchAboutService = async () => {
    try{
      console.log('hjghhgjh')
      const formData = {}
      const response_aboutUs_service = await aboutUsService();
      if(response_aboutUs_service.status) {
        setAboutUsData(response_aboutUs_service.data)
      }
      console.log('response_aboutUs_data', response_aboutUs_service)
      // const response_aboutUs_data = decrypt(response_aboutUs_service.data, token);
    } catch (error) {
      console.log("error found: ", error)
      // router.push('/')
    }
  }
  return (
    <>
    <Header />
    <div className='container-fluid p-0 mt-5' >
      <div className='' dangerouslySetInnerHTML={{ __html: aboutUsData && aboutUsData }}>
      </div>
    </div>
    <Footer />
    </>
  )
}

export default index