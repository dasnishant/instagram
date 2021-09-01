import React, { useState } from "react";
import { Avatar, Input } from "antd";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetFeeds, userLogOut } from "../../actions";
import UsersList from "./UsersList";
import "./index.scss";

function Header() {
  const history = useHistory();
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.userReducer);
  const [showUsers, setShowUsers] = useState(false);

  const showSearch = () => {
    setShowUsers(!showUsers);
  };

  const gotoHome = () => () => {
    history.push("/");
  };

  const gotoProfile = () => () => {
    history.push(`/profile/${userReducer.userId}`);
  };

  return (
    <>
      <header>
        <h3 onClick={gotoHome()}>Instagram</h3>
        <div>
          <Input
            placeholder="Search"
            className="inputSearch"
            onClick={showSearch}
          />
          {showUsers && <UsersList />}
        </div>
        <div className="icons">
          <HomeOutlined className="homeIcon" onClick={gotoHome()} />
          <Avatar className="profileIcon" onClick={gotoProfile()}>
            {userReducer.displayName[0]}
          </Avatar>
          <LogoutOutlined
            className="logoutIcon"
            onClick={() => {
              dispatch(userLogOut());
              dispatch(resetFeeds({ feeds: [], isloading: true }));
            }}
          />
        </div>
      </header>
    </>
  );
}

export default Header;
