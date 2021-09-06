import { Avatar, Spin, Button } from "antd";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sagaFollow, sagaUnfollow, setSagaAllUsers } from "../../actions";

function UsersList() {
  const allUsersReducer = useSelector((state) => state.allUsersReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSagaAllUsers());
    return () => {};
  }, [dispatch]);

  const follow = (user) => () => {
    dispatch(sagaFollow(user));
  };

  const unFollow = (user) => () => {
    dispatch(sagaUnfollow(user));
  };

  return (
    <div className="usersList">
      {allUsersReducer.isloading ? (
        <div className="loading">
          <Spin />
        </div>
      ) : (
        <div>
          {allUsersReducer.allUsers &&
            allUsersReducer.allUsers.map((user) => {
              return (
                <div key={user.id} className="usersListItem">
                  <Avatar className="profileIcon">{user.displayName[0]}</Avatar>
                  <strong>{user.displayName}</strong>
                  {allUsersReducer.following &&
                    (allUsersReducer.following.includes(user.id) ? (
                      <Button onClick={unFollow(user)}>Following</Button>
                    ) : (
                      <Button type="primary" onClick={follow(user)}>
                        Follow
                      </Button>
                    ))}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default UsersList;
