import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { Spin, Image } from "antd";
// import { useParams } from "react-router-dom";
import CountComponent from "./CountComponent";
import ModalComponent from "./ModalComponent";
import { useDispatch, useSelector } from "react-redux";
import { sagaGetProfile } from "../../actions";
import "./index.scss";

function Profile() {
  // const param = useParams();
  const dispatch = useDispatch();
  const profileInfo = useSelector((state) => state.profileReducer);
  const [showModal, setshowModal] = useState(null);

  const handleCancel = () => {
    setshowModal(false);
  };

  //wrapper(url,params,method)
  // get (no body)
  // post,put,patch body can be there
  //body-> success:true, data:json obj

  useEffect(() => {
    dispatch(sagaGetProfile());
  }, [dispatch]);

  return profileInfo.isLoading ? (
    <div className="loading">
      <Spin />
    </div>
  ) : (
    <>
      <Header />
      <div className="profile">
        <main>
          <div className="profilePic">{profileInfo.displayName[0]}</div>
          <div className="profileInfo">
            <h1>{profileInfo.displayName}</h1>
            <CountComponent
              count={profileInfo.postsCount}
              text={"Posts"}
            ></CountComponent>
            <CountComponent
              count={profileInfo.followers}
              text={"Followers"}
              showModal={() => setshowModal("followers")}
            ></CountComponent>
            <CountComponent
              count={profileInfo.following}
              text={"Following"}
              showModal={() => setshowModal("following")}
            ></CountComponent>
          </div>
        </main>
        <div className="profilePosts">
          {profileInfo.posts.map((post) => {
            return (
              <Image
                className="postImage"
                key={post.id}
                height={200}
                width={200}
                src={post.imageUrl}
              ></Image>
            );
          })}
        </div>
      </div>
      <ModalComponent
        showModal={showModal}
        handleCancel={handleCancel}
        profileInfo={profileInfo}
      />
    </>
  );
}

export default Profile;
