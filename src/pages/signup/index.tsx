import { Button, Form, Input, Row, Col, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import client from "../../utils/axios";
import { useMutation } from "react-query";
import "./style.less";

const Signup = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<SignupFormValues>();

  const singupUser = async (values: SignupFormValues) => {
    const { data } = await client.post(`auth/signup`, values);
    return data;
  };

  const { mutate: signup, isLoading } = useMutation(singupUser, {
    onSuccess: (data: APIReturnResponse) => {
      form.resetFields();
      message.success(data.message);
      navigate("/", { replace: true });
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

  const onFinish = async (values: SignupFormValues) => {
    signup({ ...values, role: "salesperson" });
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
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
          className="signup-left-box"
        >
          <Form
            layout="vertical"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
          >
            <Col span={24}>
              <h1>Create your Aethos Account</h1>
              <span className="sub-title">
                Fill out below form to create your account
              </span>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter your Full Name" },
                ]}
              >
                <Input size="large" placeholder="Enter Full Name" />
              </Form.Item>
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
                label="Phone Number"
                name="phone_number"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                  { max: 10, message: "Phone number must be of 10 numbers" },
                ]}
              >
                <Input size="large" placeholder="Enter Phone Number" />
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
                  Sign up
                </Button>
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: "center" }}>
              <Link to="/" className="signup">
                Already have an account? Log in now
              </Link>
            </Col>
          </Form>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
          className="signup-right-box"
        >
          <h1>Welcome to Aethos!</h1>
        </Col>
      </Row>
    </>
  );
};

export default Signup;
