import { useState, useEffect } from "react";
import { Button, Form, Input, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import "./style.less";
import client from "../../utils/axios";
import ResetPasswordModal from "../../components/ui/ResetPasswordModal";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginFormValues>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/home");
  });

  const loginUser = async (values: LoginFormValues) => {
    const { data } = await client.post(`auth/login`, values);
    return data;
  };

  const { mutate: login, isLoading } = useMutation(loginUser, {
    onSuccess: (data: LoginReturnValues) => {
      // This will run on successful login
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Clear the input fields if needed
      form.resetFields();
      // Navigate to the home page after successful login
      navigate("/home", { replace: true });
      message.success(data.message);
    },
    onError: (error: any) => {
      // Handle login errors
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Failed to log in. Please try again");
      }
    },
  });

  const onFinish = async (values: LoginFormValues) => {
    if (!values.email || !values.password)
      return message.error("Please enter credentials");
    login(values);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Row
        justify="center"
        align="middle"
        gutter={30}
        style={{ margin: 0 }}
        className="row-box"
      >
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="login-left-box">
          <img
            className="sekai-logo-image"
            src="/sekai-logo.png"
            alt="Sekai logo"
          />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
          className="login-right-box"
        >
          <Form
            layout="vertical"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
          >
            <Col span={24}>
              <h1>Log into your Sekai Account</h1>
              <span className="sub-title">
                Sign in by entering correct credentials
              </span>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter the E-mail" },
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                    validateTrigger: "onBlur",
                  },
                ]}
              >
                <Input size="large" placeholder="Enter E-mail" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter the password" },
                ]}
              >
                <Input.Password size="large" placeholder="Enter Password" />
              </Form.Item>

              <div className="login-options">
                <span
                  className="forgot-password"
                  onClick={() => setModalVisible(true)}
                >
                  Forgot Password?
                </span>
              </div>
            </Col>

            <Col span={24}>
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="primary"
                  size="large"
                  style={{ width: "100%" }}
                  loading={isLoading}
                  htmlType="submit"
                >
                  Sign in
                </Button>
              </Form.Item>
            </Col>
          </Form>
        </Col>
      </Row>

      {isModalVisible && (
        <ResetPasswordModal
          isResetPassword={false}
          onOk={handleOk}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default Login;
