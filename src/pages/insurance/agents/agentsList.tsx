import { message, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import client from "../../../utils/axios";
import dayjs from "dayjs";
import DescriptionTitle from "../../../components/ui/DescriptionTitle";
import { useNavigate } from "react-router-dom";

const AgentsList = () => {
  const navigate = useNavigate();
  const columns: ColumnsType<InsuranceAgent> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: (a, b) =>
        (a.phoneNumber || "").localeCompare(b.phoneNumber || ""),
    },
    {
      title: "Insurance Company",
      dataIndex: ["insuranceCompanyId", "name"],
      key: "insuranceCompanyId",
      sorter: (a, b) =>
        (a.insuranceCompanyId.name || "").localeCompare(
          b.insuranceCompanyId.name || ""
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
      sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <EditOutlined
            style={{ fontSize: 18 }}
            onClick={() => navigate(`/home/insurance-agent/${record._id}`)}
          />
          <DeleteOutlined
            style={{ fontSize: 18, color: "red", marginLeft: "5px" }}
          />
        </Space>
      ),
    },
  ];

  const fetchAllAgents = async (): Promise<InsuranceAgent[]> => {
    const { data } = await client.get<{
      status: string;
      result: InsuranceAgent[];
    }>(`/iagent/all-agents`);
    return data.result;
  };

  const {
    data: insuranceCompanies,
    isLoading: insuranceCompaniesLoading,
    error: insuranceCompaniesError,
  } = useQuery(["InsuranceAgents"], fetchAllAgents);

  if (insuranceCompaniesError) message.error("Error fetching insurance agents");

  return (
    <>
      <DescriptionTitle
        title="List of Insurance Agents"
        description="View all insurance agents"
      />
      <Table
        rowKey="_id"
        loading={insuranceCompaniesLoading}
        dataSource={insuranceCompanies}
        columns={columns}
      />
    </>
  );
};

export default AgentsList;
