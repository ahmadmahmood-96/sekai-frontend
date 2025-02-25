import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LogoutOutlined,
  DollarOutlined,
  BarChartOutlined,
  AreaChartOutlined,
  ImportOutlined,
  LineChartOutlined,
  SnippetsOutlined,
  DiffOutlined,
  UserAddOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { FaPlus } from "react-icons/fa";
import { VscEye } from "react-icons/vsc";
import { IoInformationCircleOutline } from "react-icons/io5";
import { LuUsers, LuUserSearch } from "react-icons/lu";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import type { MenuProps } from "antd";
import { handleLogout } from "../../utils/logout";
import { getUserFromLocalStorage } from "../../utils/getUser";
import("../../pages/home/style.less");

interface SiderComponentProps {
  handleToggle: () => void;
}

const SiderComponent: React.FC<SiderComponentProps> = ({ handleToggle }) => {
  const navigate = useNavigate();
  const user = getUserFromLocalStorage();
  const currentPath = window.location.pathname;

  const items: MenuProps["items"] = [
    { key: "/home", label: "Home", icon: <LineChartOutlined /> },
    // {
    //   key: "/home/total-revenue-volume",
    //   label: "Total Revenue & Volume",
    //   icon: <BarChartOutlined />,
    // },
    {
      key: "/home/revenue-mid",
      label: "Revenue per MID",
      icon: <DollarOutlined />,
    },
    {
      key: "/home/agents",
      label: "Agents Data",
      icon: <BarChartOutlined />,
    },
    {
      key: "/home/industry",
      label: "Industry",
      icon: <AreaChartOutlined />,
    },
    {
      key: "/home/insights",
      label: "Insights",
      icon: <DollarOutlined />,
    },
    {
      key: "/home/merchants",
      label: "MIDs",
      icon: <DiffOutlined />,
    },
    {
      key: "/home/import-data",
      label: "Import Data",
      icon: <ImportOutlined />,
    },
    {
      key: "/home/adjustments",
      label: "Adjustments",
      icon: <LiaFileInvoiceDollarSolid />,
      children: [
        {
          key: "/home/adjustments/new",
          label: "Add Adjustments",
          icon: <FaPlus />,
        },
        {
          key: "/home/adjustments",
          label: "View Adjustments",
          icon: <VscEye />,
        },
      ],
    },
    {
      key: "/home/logs",
      label: "Logs",
      icon: <SnippetsOutlined />,
    },
    {
      key: "/home/users",
      label: "Users",
      icon: <LuUsers />,
      children: [
        {
          key: "/home/users/new",
          label: "Add Users",
          icon: <UserAddOutlined />,
        },
        {
          key: "/home/users",
          label: "View Users",
          icon: <LuUserSearch />,
        },
      ],
    },
    {
      key: "/home/iso",
      label: "ISO",
      icon: <IoInformationCircleOutline />,
      children: [
        {
          key: "/home/iso/new",
          label: "Add ISO",
          icon: <FaPlus />,
        },
        {
          key: "/home/iso",
          label: "View ISO",
          icon: <VscEye />,
        },
      ],
    },
    { key: "logout", label: "Logout", icon: <LogoutOutlined />, danger: true },
  ];

  const userItems: MenuProps["items"] = [
    { key: "/home", label: "Home", icon: <HomeOutlined /> },
    {
      key: "/home/monthly-data",
      label: "Monthly Data",
      icon: <AreaChartOutlined />,
    },
    { key: "logout", label: "Logout", icon: <LogoutOutlined />, danger: true },
  ];

  const flattenMenuItems = (menuItems: MenuProps["items"] = []) => {
    return menuItems.reduce((acc: any[], item: any) => {
      acc.push(item);
      if (item.children) {
        acc = acc.concat(flattenMenuItems(item.children));
      }
      return acc;
    }, []);
  };

  const flatItems = flattenMenuItems(
    user?.role === "admin" ? items : userItems
  );

  const matchMenuKey = (path: string, menuItems: any[]): string | undefined => {
    for (const item of menuItems) {
      if (path === item.key) {
        return item.key; // Exact match
      }
      if (item.children) {
        const childMatch = matchMenuKey(path, item.children);
        if (childMatch) {
          return childMatch;
        }
      }
    }

    // For all dynamic paths under
    if (path.startsWith("/home/users") && path !== "/home/users") {
      return "/home/users/new";
    } else if (path.startsWith("/home/iso") && path !== "/home/iso") {
      return "/home/iso/new";
    } else if (
      path.startsWith("/home/adjustments") &&
      path !== "/home/adjustments"
    ) {
      return "/home/adjustments/new";
    } else if (path.startsWith("/home/merchants")) {
      return "/home/merchants";
    }

    return undefined; // No match
  };

  const matchedKey = matchMenuKey(currentPath, flatItems);

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      handleLogout(navigate);
    } else {
      navigate(key);
    }
    if (window.innerWidth < 786) handleToggle();
  };

  return (
    <Menu
      onClick={onClick}
      className="sidebar-menu"
      selectedKeys={[matchedKey || currentPath]}
      mode="inline"
      items={user?.role === "admin" ? items : userItems}
    />
  );
};

export default SiderComponent;
