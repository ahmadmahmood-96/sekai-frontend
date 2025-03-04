import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LogoutOutlined,
  AreaChartOutlined,
  LineChartOutlined,
  UserAddOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { LuUsers, LuUserSearch } from "react-icons/lu";
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
