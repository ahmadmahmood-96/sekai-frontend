import { message, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQuery } from "react-query";
import client from "../../../utils/axios";
import dayjs from "dayjs";

const InsuranceCompaniesList = () => {
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
    <Table
      rowKey="_id"
      loading={insuranceCompaniesLoading}
      dataSource={insuranceCompanies}
      columns={columns}
    />
  );
};

export default InsuranceCompaniesList;
