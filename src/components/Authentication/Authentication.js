import React from "react";
import { Input, Button, Form } from "antd";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sagaUserLogIn, sagaUserSignUp } from "../../actions";
import "./index.scss";

function Authentication({ isSignUp }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const error = useSelector((state) => state.errorReducer);

  const authSubmit = (email, password, displayName) => {
    if (isSignUp) {
      dispatch(
        sagaUserSignUp({ email, password, displayName, isSignUp, history })
      );
    } else {
      dispatch(sagaUserLogIn({ email, password, history }));
    }
  };

  const onFinish = (values) => {
    const { email, password, displayName } = values;
    authSubmit(email, password, displayName);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div className="signIn">
        <Form
          name="authentication"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <p>Instagram</p>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Invalid Email",
              },
            ]}
          >
            <Input placeholder="Email" className="inputEmail" />
          </Form.Item>

          {isSignUp && (
            <Form.Item
              name="displayName"
              rules={[
                {
                  required: true,
                  type: "string",
                  message: "Enter display name",
                },
              ]}
            >
              <Input placeholder="Display Name" className="inputDisplayName" />
            </Form.Item>
          )}

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                min: 6,
                message: isSignUp
                  ? "Password Should be atleast 6 characters"
                  : "Invalid password",
              },
            ]}
          >
            <Input.Password placeholder="Password" className="inputPassword" />
          </Form.Item>
          {error && <div>{error}</div>}
          <Button
            type="primary"
            htmlType="submit"
            loading={false}
            block
            size="medium"
          >
            {isSignUp ? "Sign In" : "Log In"}
          </Button>
        </Form>
      </div>
      {isSignUp ? (
        <div className="authFooter">
          Have an account? <Link to="/login">Log in</Link>{" "}
        </div>
      ) : (
        <div className="authFooter">
          Don't have an account? <Link to="/signup">Sign up</Link>{" "}
        </div>
      )}
    </>
  );
}

export default Authentication;
