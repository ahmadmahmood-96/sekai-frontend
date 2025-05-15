import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LogoutOutlined,
  AreaChartOutlined,
  LineChartOutlined,
  UserAddOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { BsBuildings } from "react-icons/bs";
import { LuUsers, LuUserSearch } from "react-icons/lu";
import { IoCarSportOutline, IoAdd } from "react-icons/io5";
import { AiOutlineUserAdd, AiOutlineInsurance } from "react-icons/ai";
import { PiListMagnifyingGlassThin, PiUserList } from "react-icons/pi";
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
    { key: "/home/companies", label: "Companies", icon: <BsBuildings /> },
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
      key: "/home/cars",
      label: "Cars",
      icon: <IoCarSportOutline size={16} />,
      children: [
        {
          key: "/home/cars/new",
          label: "Add Car",
          icon: <IoAdd />,
        },
        {
          key: "/home/users",
          label: "View Cars",
          icon: <PiListMagnifyingGlassThin />,
        },
      ],
    },
    {
      key: "/home/insurance",
      label: "Insurance",
      icon: <AiOutlineInsurance size={16} />,
      children: [
        {
          key: "/home/insurance-company/new",
          label: "Add Company",
          icon: <IoAdd />,
        },
        {
          key: "/home/insurance-company",
          label: "View Companies",
          icon: <PiListMagnifyingGlassThin />,
        },
        {
          key: "/home/insurance-agent/new",
          label: "Add Agent",
          icon: <AiOutlineUserAdd />,
        },
        {
          key: "/home/insurance-agent",
          label: "View Agents",
          icon: <PiUserList />,
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
    } else if (path.startsWith("/home/cars") && path !== "/home/cars") {
      return "/home/cars/new";
    } else if (
      path.startsWith("/home/insurance-company") &&
      path !== "/home/insurance-company"
    ) {
      return "/home/insurance-company/new";
    } else if (
      path.startsWith("/home/insurance-agent") &&
      path !== "/home/insurance-agent"
    ) {
      return "/home/insurance-agent/new";
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
