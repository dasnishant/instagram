import React, { useEffect } from "react";
import Header from "../Header/Header";
import { Image, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { sagaGetFeeds, sagaLike, sagaRemoveLike } from "../../actions";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import "./index.scss";

function Home({ userReducer }) {
  const dispatch = useDispatch();
  const feedsReducer = useSelector((state) => state.feedsReducer);

  const like = (userId, postId, ownerId, likes) => () => {
    dispatch(sagaLike({ userId, postId, ownerId, likes }));
  };

  const removeLike = (userId, postId, ownerId, likes) => () => {
    dispatch(sagaRemoveLike({ userId, postId, ownerId, likes }));
  };
  useEffect(() => {
    dispatch(sagaGetFeeds(userReducer.userId));
  }, [userReducer.userId, dispatch]);

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
                      onClick={removeLike(
                        userReducer.userId,
                        post.id,
                        post.ownerId,
                        post.likes
                      )}
                    />
                  ) : (
                    <LikeOutlined
                      style={{ fontSize: "22px" }}
                      onClick={like(
                        userReducer.userId,
                        post.id,
                        post.ownerId,
                        post.likes
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
