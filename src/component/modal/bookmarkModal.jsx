import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const BookmarkModal = (props) => {

    const [bookmarkTitle, setBookmarkTitle] = useState('')

  return (
    <Modal
      {...props}
      size={"sm"}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="reviewModal"
    >
        <div className="modal-body rateAndreviewModal">
            <h4 className="m-0 r_title">Add Bookmark</h4>
            <p>Time : {props.time}</p>
            <input 
                type="text" 
                placeholder="Enter Title"
                value={bookmarkTitle}
                onChange={(e) => setBookmarkTitle(e.target.value)}
            />
            <div>
                <button className="btn cancelAddBookmark" onClick={props.onHide}>Cancel</button>
                <button className="btn submitAddBookmark" onClick={() => props.submitBookmark(bookmarkTitle)}>Submit</button>
            </div>
        </div>
    </Modal>
  )
}

export default BookmarkModal