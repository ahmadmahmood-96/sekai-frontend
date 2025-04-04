import { message, Table } from "antd";
import client from "../../utils/axios";
import { useQuery } from "react-query";
const CompaniesList = () => {
  const columns: any = [{ key: "name", dataIndex: "name", title: "Name" }];
  const fetchAllCompanies = async () => {
    const { data } = await client.get<{ companies: Company[] }>(
      `/company/companies`
    );
    return data.companies; // Fix: Extracting the array
  };

  const {
    data: companies,
    isLoading: companiesLoading,
    error: companiesError,
  } = useQuery(["AllOrganisations"], fetchAllCompanies);

  if (companiesError) message.error("Error fetching data");
  return (
    <>
      <Table
        loading={companiesLoading}
        dataSource={companies}
        columns={columns}
      />
    </>
  );
};

export default CompaniesList;
