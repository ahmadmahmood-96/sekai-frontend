import { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Row, Col } from "antd";
import client from "../../../utils/axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LoadingSpinner from "../../../components/ui/LoaderSpinner";
import DescriptionTitle from "../../../components/ui/DescriptionTitle";

interface InsuranceCompany {
  id: string;
  name: string;
}

const fetchCompanyById = async (id: string): Promise<InsuranceCompany> => {
  const { data } = await client.get<{
    status: string;
    result: InsuranceCompany;
  }>(`/icomp/company/${id}`);
  return data.result;
};

const submitCompany = async (values: InsuranceCompany) => {
  const endpoint = values.id
    ? `/icomp/company/${values.id}`
    : "/icomp/companies";
  const method = values.id ? client.patch : client.post;
  const { data } = await method(endpoint, values);
  return data;
};

const AddInsuranceCompany = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const location = useLocation();
  const isNew = location.pathname.endsWith("/new");
  const navigate = useNavigate();

  const {
    data: company,
    isLoading: companyLoading,
    error: companyError,
  } = useQuery(["InsuranceCompany", id], () => fetchCompanyById(id!), {
    enabled: !!id && !isNew,
  });

  useEffect(() => {
    if (company) {
      form.setFieldsValue(company);
    }
  }, [company]);

  const { mutate: handleSubmit, isLoading: submitLoading } = useMutation(
    submitCompany,
    {
      onSuccess: () => {
        message.success(
          isNew
            ? "Insurance company added successfully"
            : "Insurance company updated successfully"
        );
        if (isNew) form.resetFields();
        queryClient.invalidateQueries(["InsuranceCompanies"]);
        navigate("/home/insurance-company");
      },
      onError: (error: any) => {
        if (error?.response?.data?.message)
          message.error(error.response.data.message);
        else message.error("Failed to submit insurance company.");
      },
    }
  );

  const onFinish = (values: any) => {
    if (!isNew) values.id = id;
    handleSubmit(values);
  };

  if (companyError) message.error("Failed to fetch insurance company.");

  return (
    <div>
      <DescriptionTitle
        title={isNew ? "Add Insurance Company" : "Update Insurance Company"}
        description="Add or update an insurance company"
      />
      {companyLoading && !isNew ? (
        <LoadingSpinner isLoading={companyLoading || submitLoading} />
      ) : (
        <Row align="middle">
          <Col span={24}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ name: "" }}
            >
              <Col span={8}>
                <Form.Item
                  label="Company Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please input company name" },
                  ]}
                >
                  <Input
                    placeholder="Enter insurance company name"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item style={{ textAlign: "right" }}>
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={submitLoading}
                  >
                    {isNew ? "Add Company" : "Update Company"}
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AddInsuranceCompany;
