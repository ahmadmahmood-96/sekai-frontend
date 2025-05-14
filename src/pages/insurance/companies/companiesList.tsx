import { message, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import client from "../../../utils/axios";
import dayjs from "dayjs";
import DescriptionTitle from "../../../components/ui/DescriptionTitle";
import { useNavigate } from "react-router-dom";
const InsuranceCompaniesList = () => {
  const navigate = useNavigate();
  const columns: ColumnsType<InsuranceCompany> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
            onClick={() => navigate(`/home/insurance-company/${record._id}`)}
          />
          <DeleteOutlined
            style={{ fontSize: 18, color: "red", marginLeft: "5px" }}
          />
        </Space>
      ),
    },
  ];

  const fetchAllCompanies = async (): Promise<InsuranceCompany[]> => {
    const { data } = await client.get<{
      status: string;
      result: InsuranceCompany[];
    }>(`/icomp/all-companies`);
    return data.result;
  };

  const {
    data: insuranceCompanies,
    isLoading: insuranceCompaniesLoading,
    error: insuranceCompaniesError,
  } = useQuery(["InsuranceCompanies"], fetchAllCompanies);

  if (insuranceCompaniesError)
    message.error("Error fetching insurance companies");

  return (
    <>
      <DescriptionTitle
        title="List of Insurance Companies"
        description="View all insurance companies"
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

export default InsuranceCompaniesList;
