import React, { useState } from "react";
import { Avatar, Dropdown, MenuProps } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
// import ResetPassWordIcon from "./ui/ResetPasswordIcon";
import ResetPasswordModal from "./ResetPasswordModal";
import { getUserFromLocalStorage } from "../../utils/getUser";
import { handleLogout } from "../../utils/logout";

interface HeaderComponentProps {
  collapsed: boolean;
  handleToggle: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  collapsed,
  handleToggle,
}) => {
  const user = getUserFromLocalStorage();
  const navigate = useNavigate();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const items: MenuProps["items"] = [
    // {
    //   key: "1",
    //   label: (
    //     <span
    //       style={{ display: "flex", alignItems: "center" }}
    //       onClick={() => setModalVisible(true)}
    //     >
    //       <ResetPassWordIcon />
    //       Reset Password
    //     </span>
    //   ),
    // },
    {
      key: "2",
      label: (
        <span
          onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
            e.stopPropagation();
            handleLogout(navigate);
          }}
          style={{ color: "var(--red-color)", width: "100%" }}
        >
          <LogoutOutlined style={{ marginRight: "10px" }} />
          Logout
        </span>
      ),
    },
  ];

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <header style={headerStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined
              style={{ fontSize: 26, color: "#000" }}
              onClick={handleToggle}
            />
          ) : (
            <MenuFoldOutlined
              style={{ fontSize: 26, color: "#000" }}
              onClick={handleToggle}
            />
          )}
          <img className="header-logo" src="/aethos-logo.png" alt="Aethos Logo" />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              {user?.name || "N/A"}
            </span>
            <span>{user?.role == "admin" ? "Admin" : "Agent"}</span>
          </div>
          <Dropdown
            placement="bottomLeft"
            trigger={["hover", "click"]}
            menu={{ items }}
          >
            <Avatar
              size="large"
              style={{
                backgroundColor: "var(--primary-color)",
              }}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </div>
      </header>
      {isModalVisible && (
        <ResetPasswordModal
          isResetPassword={true}
          onOk={handleOk}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

const headerStyle: React.CSSProperties = {
  color: "#333", // Slightly darker text for contrast
  height: 65,
  backgroundColor: "rgba(252, 252, 252, 0.9)", // Light gray with slight transparency
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
};

export default HeaderComponent;
