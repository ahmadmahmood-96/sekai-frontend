import { Col, Input, message, Row, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import client from "../../utils/axios";
import DescriptionTitle from "../../components/ui/DescriptionTitle";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/ui/LoaderSpinner";
import { useMemo, useState } from "react";

const CarsList = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const columns: ColumnsType<Car> = [
    {
      title: "Make",
      dataIndex: "make",
      key: "make",
      sorter: (a, b) => a.make.localeCompare(b.make),
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      sorter: (a, b) => a.model.localeCompare(b.model),
    },
    {
      title: "Year",
      dataIndex: "manufacturingYear",
      key: "manufacturingYear",
      sorter: (a, b) => a.manufacturingYear - b.manufacturingYear,
    },
    {
      title: "Gear Type",
      dataIndex: "gearType",
      key: "gearType",
      filters: [
        { text: "Auto", value: "Auto" },
        { text: "Manual", value: "Manual" },
        { text: "Column", value: "Column" },
      ],
      onFilter: (value, record) => record.gearType === value,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Car Type",
      dataIndex: "carType",
      key: "carType",
      filters: [
        { text: "Petrol", value: "Petrol" },
        { text: "Diesel", value: "Diesel" },
        { text: "Electric", value: "Electric" },
      ],
      onFilter: (value, record) => record.carType === value,
      render: (type: string) => <Tag color="green">{type}</Tag>,
    },
    {
      title: "Reg No",
      dataIndex: "regNo",
      key: "regNo",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <EditOutlined
            style={{ fontSize: 18 }}
            onClick={() => navigate(`/home/cars/${record._id}`)}
          />
          <DeleteOutlined
            style={{ fontSize: 18, color: "red", marginLeft: "5px" }}
            // You can add a delete handler here
          />
        </Space>
      ),
    },
  ];

  const fetchAllCars = async (): Promise<Car[]> => {
    const { data } = await client.get<{
      status: string;
      result: Car[];
    }>("/cars/all-cars");
    return data.result;
  };

  const {
    data: cars,
    isLoading: carsLoading,
    error: carsError,
  } = useQuery(["Cars"], fetchAllCars);

  const filteredCars = useMemo(() => {
    if (!searchText) return cars;

    return cars?.filter((car) => {
      const search = searchText.toLowerCase();
      return (
        car.make?.toLowerCase().includes(search) ||
        car.model?.toLowerCase().includes(search) ||
        car.manufacturingYear?.toString().includes(search) ||
        car.regNo?.toLowerCase().includes(search)
      );
    });
  }, [cars, searchText]);

  if (carsError) message.error("Error fetching cars");

  return (
    <>
      <LoadingSpinner isLoading={carsLoading} />
      <DescriptionTitle
        title="List of Cars"
        description="View all cars in the Sekai system"
      />
      <Row>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Input.Search
            allowClear
            placeholder="Search by Make, Model, Year, or Reg No"
            size="large"
            style={{ marginBottom: 12 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>
      <Table
        rowKey="_id"
        loading={carsLoading}
        dataSource={filteredCars}
        columns={columns}
      />
    </>
  );
};

export default CarsList;
