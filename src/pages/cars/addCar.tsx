import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  message,
  DatePicker,
} from "antd";
import {} from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import client from "../../utils/axios";
import DescriptionTitle from "../../components/ui/DescriptionTitle";
import { carMakes } from "../../constants/carMakes";
import { carModelsByMake } from "../../constants/carModels";
import { gearTypes } from "../../constants/gearTypes";
import { carTypes } from "../../constants/carTypes";

const AddCar = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== "new";
  const [form] = Form.useForm<CarFormValues>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const selectedMake = Form.useWatch("make", form);
  const models = carModelsByMake[selectedMake] || [];

  // Fetch car details if editing
  useQuery(
    ["Car", id],
    async () => {
      const { data } = await client.get(`/cars/car/${id}`);
      return data;
    },
    {
      enabled: isEdit,
      onSuccess: (data) => {
        form.setFieldsValue(data.result); // Use the `result` field from the controller
      },
      onError: () => {
        message.error("Failed to fetch car details.");
      },
    }
  );

  const { mutate: submitCar, isLoading } = useMutation(
    async (values: CarFormValues) => {
      if (isEdit) {
        await client.patch(`/cars/car/${id}`, values);
      } else {
        await client.post("/cars/cars", values);
      }
    },
    {
      onSuccess: () => {
        message.success(
          isEdit ? "Car updated successfully" : "Car added successfully"
        );
        queryClient.invalidateQueries(["Cars"]);
        navigate("/home/cars");
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Failed to submit car details.";
        message.error(msg);
      },
    }
  );

  const onFinish = (values: CarFormValues) => {
    submitCar(values);
  };

  return (
    <>
      <DescriptionTitle
        title={isEdit ? "Edit Car" : "Add Car"}
        description="Fill the form below to add or edit car details"
      />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Make"
              name="make"
              rules={[
                { required: true, message: "Please select the car make" },
              ]}
            >
              <Select
                size="large"
                placeholder="Select Make"
                options={carMakes.map((make) => ({ label: make, value: make }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Model"
              name="model"
              rules={[
                { required: true, message: "Please enter the car model" },
              ]}
            >
              <Select
                size="large"
                placeholder="Select Model"
                options={models.map((model) => ({
                  label: model,
                  value: model,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Manufacturing Year"
              name="manufacturingYear"
              rules={[
                { required: true, message: "Please select manufacturing year" },
              ]}
            >
              <DatePicker
                picker="year"
                size="large"
                style={{ width: "100%" }}
                placeholder="Select Year"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Engine Capacity"
              name="engineCapacity"
              rules={[
                { required: true, message: "Please enter engine capacity" },
              ]}
            >
              <Input size="large" placeholder="e.g. 1800cc" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Chassis Number"
              name="chasisNo"
              rules={[
                { required: true, message: "Please enter chassis number" },
              ]}
            >
              <Input size="large" placeholder="Unique Chassis No." />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Engine Number"
              name="engineNo"
              rules={[
                { required: true, message: "Please enter engine number" },
              ]}
            >
              <Input size="large" placeholder="Unique Engine No." />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Registration Number"
              name="regNo"
              rules={[
                { required: true, message: "Please enter registration number" },
              ]}
            >
              <Input size="large" placeholder="e.g. ABC-1234" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Gear Type"
              name="gearType"
              rules={[{ required: true, message: "Please select gear type" }]}
            >
              <Select
                size="large"
                placeholder="Select Gear Type"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={gearTypes.map((type) => ({
                  label: type,
                  value: type,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Car Type"
              name="carType"
              rules={[{ required: true, message: "Please select car type" }]}
            >
              <Select
                showSearch
                size="large"
                placeholder="Select Car Type"
                options={carTypes
                  .sort((a, b) => a.localeCompare(b)) // Alphabetical sort
                  .map((type) => ({
                    label: type,
                    value: type,
                  }))}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item>
              <div style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isLoading}
                >
                  {isEdit ? "Update Car" : "Add Car"}
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddCar;
