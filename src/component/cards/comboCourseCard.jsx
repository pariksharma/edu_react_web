import { useRouter } from 'next/router'
import React from 'react'

const ComboCourseCard = ({value, titleName, key, CourseID, onlineCourseAry}) => {

    const router = useRouter();

    console.log('onlineCourseAry', onlineCourseAry)
    const handleDetail = () => {
        if(onlineCourseAry.is_purchased != 0){
            router.push(`/view-courses/details/${titleName + ":" + value.id + "&" + '' + "parent:" + onlineCourseAry.id}`)
        }
        else{
            router.push(`/view-courses/course-order/${titleName + ":" + onlineCourseAry.id + "&" + onlineCourseAry.combo_course_ids}`);
        }
    }
    console.log('CourseID', value)
  return (
    <div className="card border-0 shadow b-radius mb-3 p-2 freeCard" style={{width: '320px'}} onClick={handleDetail}>
        {<img style={{borderRadius: "10px"}} src={value?.desc_header_image ? value.desc_header_image : '/assets/images/noImage.jfif'} className="card-img-top" alt="..." />}
        <div className="card-body pt-3 px-0 pb-0">
            <h6 className="mb-2 slideTitle">
                {value?.title}
            </h6>
            <div className="courserate1">
                <div className='d-flex1'>
                    <div className="courseValidity1">
                        <span className="validity1">{value.segment_information}</span>
                    </div>
                    {/* <div className="courseRemaining1">
                        <span className="remaining"><p>Remaining </p></span>
                    </div> */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ComboCourseCard