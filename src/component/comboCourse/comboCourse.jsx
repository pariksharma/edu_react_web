import { isValidData } from '@/utils/helpers';
import React from 'react'
import ErrorPage from '../errorPage';
import Loader from '../loader';
import ComboCourseCard from '../cards/comboCourseCard';

const ComboCourse = ({courseDetail, CourseID, tabName, keyValue, titleName, onlineCourseAry}) => {
    // console.log('CombocourseDetail', courseDetail)
    const dataAry = courseDetail?.meta?.list;
  return (
    <div className="course_cardContainer onlineCourse mb-3">
        <div className="row">
        {isValidData(dataAry) ? 
            dataAry.map((item, index) => {
            return <ComboCourseCard value = {item} titleName = {titleName} key={index} CourseID={CourseID} onlineCourseAry={onlineCourseAry} />
            })
            :
            showError ? 
            <ErrorPage />
            :
            <Loader />
        }
        </div>
    </div>
  )
}

export default ComboCourse