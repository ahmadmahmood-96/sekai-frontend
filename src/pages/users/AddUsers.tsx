import { Form, Input, Button, Row, Col, Select, message } from "antd";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../../utils/axios";

const { Option } = Select;

interface UsersFormValues {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  role: "admin" | "salesperson";
}

message.config({
  duration: 2,
  maxCount: 1,
});

const AddUsers = () => {
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm<UsersFormValues>();

  useEffect(() => {
    setIsEdit(id !== "new");
  }, [id]);

  const fetchUserData = async () => {
    const { data } = await client.get(`/users/${id}`);
    return data;
  };

  useQuery(["fetchUserData", id], fetchUserData, {
    enabled: isEdit, // Only run query if editing
    onSuccess: (data) => {
      // Populate form fields with the fetched data
      form.setFieldsValue({
        ...data,
      });
      if (data?.message) message.success(data?.message);
    },
    onError: () => {
      message.error("Failed to fetch user details.");
    },
  });

  const submitUser = async (values: UsersFormValues) => {
    const payload = {
      ...values,
      ...(isEdit ? {} : { password: values.password }), // Include password only when adding
      ...(isEdit ? { id } : {}), // Include id only when editing
    };

    await client.post("/users", payload);
  };

  const { mutate: handleSubmit, isLoading } = useMutation(submitUser, {
    onSuccess: () => {
      if (isEdit) message.success("User edited successfully");
      else {
        message.success("User added successfully");
        form.resetFields();
      }
    },
    onError: (error: any) => {
      if (error?.response?.data?.message)
        message.error(error?.response?.data?.message);
      else message.error("Failed to submit user details.");
    },
  });

  const onFinish = (values: UsersFormValues) => {
    handleSubmit(values);
  };

  return (
    <>
      <h2>{isEdit ? "Edit User" : "Add Users"}</h2>
      <span className="subtitle">
        Fill the form below to add or edit agents or admins in Sekai
      </span>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24} lg={8}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input the user's full name!",
                },
              ]}
            >
              <Input placeholder="Enter Full Name" size="large" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input the user's email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
                {
                  validator: (_, value) => {
                    // Custom validation for specific email pattern
                    const emailRegex =
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!value || emailRegex.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Email must follow the pattern: example@domain.com"
                      )
                    );
                  },
                },
              ]}
            >
              <Input placeholder="Enter Email" size="large" />
            </Form.Item>
          </Col>

          {isEdit ? null : (
            <Col xs={24} lg={8}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input the user's password!",
                  },
                ]}
              >
                <Input.Password placeholder="Enter Password" size="large" />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} lg={8}>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Please input the user's phone number!",
                },
              ]}
            >
              <Input placeholder="Enter Phone Number" size="large" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item
              label="Role"
              name="role"
              rules={[
                { required: true, message: "Please select the user's role!" },
              ]}
            >
              <Select placeholder="Select Role" size="large">
                <Option value="admin">Admin</Option>
                <Option value="salesperson">Salesperson</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Submit Button aligned to the right */}
          <Col span={24}>
            <Form.Item>
              <div style={{ textAlign: "right" }}>
                <Button
                  className="download-btn"
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isLoading}
                >
                  {isEdit ? "Edit User" : "Add User"}
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddUsers;
