import { message, Table } from "antd";
import client from "../../utils/axios";
import { useQuery } from "react-query";
import DescriptionTitle from "../../components/ui/DescriptionTitle";
import { getCompanyRoute } from "../../utils/getCompanyRoute";
import { useNavigate } from "react-router-dom";
const CompaniesList = () => {
  const navigate = useNavigate();
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
      <DescriptionTitle
        title="Companies"
        description="List of all companies in Sekai"
      />
      <Table
        loading={companiesLoading}
        dataSource={companies}
        columns={columns}
        rowHoverable
        className="row-pointer"
        onRow={(record) => ({
          onClick: () => {
            const route = getCompanyRoute(record.name);
            navigate(route);
          },
        })}
      />
    </>
  );
};

export default CompaniesList;
