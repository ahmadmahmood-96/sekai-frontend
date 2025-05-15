import { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Row, Col, Select } from "antd";
import client from "../../../utils/axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LoadingSpinner from "../../../components/ui/LoaderSpinner";
import DescriptionTitle from "../../../components/ui/DescriptionTitle";

interface InsuranceCompany {
  id: string;
  name: string;
}

const AddAgent = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const location = useLocation();
  const isNew = location.pathname.endsWith("/new");
  const navigate = useNavigate();

  const fetchAgentById = async (id: string): Promise<InsuranceAgent> => {
    const { data } = await client.get<{
      status: string;
      result: InsuranceAgent;
    }>(`/iagent/agent/${id}`);
    return data.result;
  };

  const submitAgent = async (values: InsuranceAgent) => {
    const endpoint = values.id ? `/iagent/agent/${values.id}` : "/iagent/agent";
    const method = values.id ? client.patch : client.post;
    const { data } = await method(endpoint, values);
    return data;
  };

  const {
    data: agent,
    isLoading: agentLoading,
    error: agentError,
  } = useQuery(["InsuranceAgent", id], () => fetchAgentById(id!), {
    enabled: !!id && !isNew,
  });

  const fetchCompanies = async (): Promise<InsuranceCompany[]> => {
    const { data } = await client.get<{
      status: string;
      result: InsuranceCompany[];
    }>("/icomp/all-companies");
    return data.result;
  };

  const {
    data: companies,
    isLoading: companiesLoading,
    error: companiesError,
  } = useQuery(["InsuranceCompanies"], fetchCompanies);

  useEffect(() => {
    if (agent) {
      form.setFieldsValue(agent);
    }
  }, [agent]);

  const { mutate: handleSubmit, isLoading: submitLoading } = useMutation(
    submitAgent,
    {
      onSuccess: () => {
        message.success(
          isNew
            ? "Insurance agent added successfully"
            : "Insurance agent updated successfully"
        );
        if (isNew) form.resetFields();
        queryClient.invalidateQueries(["InsuranceAgents"]);
        navigate("/home/insurance-agent");
      },
      onError: (error: any) => {
        if (error?.response?.data?.message)
          message.error(error.response.data.message);
        else message.error("Failed to submit insurance agent.");
      },
    }
  );

  const onFinish = (values: any) => {
    if (!isNew) values.id = id;
    handleSubmit(values);
  };

  if (agentError || companiesError)
    message.error("Failed to fetch insurance agent.");

  return (
    <div>
      <DescriptionTitle
        title={isNew ? "Add Insurance Agent" : "Update Insurance Agent"}
        description="Add or update an insurance agent"
      />
      {agentLoading && !isNew ? (
        <LoadingSpinner
          isLoading={agentLoading || submitLoading || companiesLoading}
        />
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                name: "",
                phoneNumber: "",
                email: "",
                insuranceCompanyId: undefined,
              }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Agent Name"
                    name="name"
                    rules={[
                      { required: true, message: "Please input agent name" },
                    ]}
                  >
                    <Input placeholder="Enter agent name" size="large" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Phone Number" name="phoneNumber">
                    <Input placeholder="Enter phone number" size="large" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: "Please enter a valid email address",
                      },
                    ]}
                  >
                    <Input placeholder="Enter email" size="large" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Insurance Company"
                    name="insuranceCompanyId"
                    rules={[
                      {
                        required: true,
                        message: "Please select an insurance company",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select an insurance company"
                      size="large"
                      loading={companiesLoading}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      options={companies?.map((company) => ({
                        value: company.id,
                        label: company.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ textAlign: "right" }}>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                >
                  {isNew ? "Add Agent" : "Update Agent"}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AddAgent;
