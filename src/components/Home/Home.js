import React, { useEffect } from "react";
import Header from "../Header/Header";
import { Image, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { sagaGetFeeds, sagaToggleLike } from "../../actions";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import "./index.scss";

function Home({ userReducer }) {
  const dispatch = useDispatch();
  const feedsReducer = useSelector((state) => state.feedsReducer);

  const toggleLike = (postId, ownerId, likes, likeStatus) => () => {
    dispatch(sagaToggleLike({ postId, ownerId, likes, likeStatus }));
  };

  useEffect(() => {
    dispatch(sagaGetFeeds());
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className="feeds">
        {feedsReducer.isLoading ? (
          <div className="loading">
            <Spin />
          </div>
        ) : (
          feedsReducer.feeds.map((post) => {
            return (
              <div key={post.id} className="feedItem">
                <Image preview={false} width={600} src={post.imageUrl}></Image>
                <p>
                  <strong>Caption: </strong> {post.caption}
                </p>
                <div className="postFooter">
                  {post.likes.includes(userReducer.userId) ? (
                    <LikeFilled
                      style={{ fontSize: "22px" }}
                      onClick={toggleLike(
                        post.id,
                        post.ownerId,
                        post.likes,
                        false
                      )}
                    />
                  ) : (
                    <LikeOutlined
                      style={{ fontSize: "22px" }}
                      onClick={toggleLike(
                        post.id,
                        post.ownerId,
                        post.likes,
                        true
                      )}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default Home;
