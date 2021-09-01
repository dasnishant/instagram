import React, { useEffect } from "react";
import { Avatar, Modal, Spin } from "antd";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSagaFollowers, setSagaFollowing } from "../../actions";

function ModalComponent({ handleCancel, profileInfo, showModal }) {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (showModal === "followers" && !profileInfo.followersList.length) {
      dispatch(setSagaFollowers({ userId: profileInfo.userId, showModal }));
    } else if (showModal === "following" && !profileInfo.followingList.length) {
      dispatch(setSagaFollowing({ userId: profileInfo.userId, showModal }));
    }
    return () => {};
  }, [
    showModal,
    profileInfo.userId,
    dispatch,
    profileInfo.followersList.length,
    profileInfo.followingList.length,
  ]);

  return (
    <Modal
      bodyStyle={{ height: "500px" }}
      title={showModal}
      footer={null}
      visible={showModal}
      onCancel={handleCancel}
    >
      {profileInfo[`${showModal}List`] ? (
        profileInfo[`${showModal}List`].map((doc) => {
          return (
            <div
              className="modalListItem"
              key={doc.id}
              onClick={() => {
                handleCancel();
                history.push(`/profile/${doc.id.trim()}`);
              }}
            >
              <Avatar className="profileIcon">{doc.displayName[0]}</Avatar>
              <strong>{doc.displayName}</strong>
            </div>
          );
        })
      ) : (
        <div className="loading">
          <Spin />
        </div>
      )}
    </Modal>
  );
}

export default ModalComponent;
