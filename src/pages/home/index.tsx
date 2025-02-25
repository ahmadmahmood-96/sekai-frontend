import { useEffect, useRef, useState } from "react";
import { Card, Layout } from "antd";
// import FooterComponent from "../components/FooterComponent";
import HomeRoutes from "../../routes/HomeRoutes";
import ErrorPage from "../ErrorPage";
import SiderComponent from "../../components/ui/SiderComponent";
import HeaderComponent from "../../components/ui/HeaderComponent";
import "./style.less";

const { Sider, Content } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const handleResize = () => {
    setCollapsed(window.innerWidth <= 1024);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (window.innerWidth <= 1024) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setCollapsed(true);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token"); // Return true if token exists
  };

  return isAuthenticated() ? (
    <>
      <Layout style={layoutStyle} className="main">
        <HeaderComponent collapsed={collapsed} handleToggle={handleToggle} />
        <Layout className="layout-main" style={{ backgroundColor: "#e9e9e9" }}>
          <Sider
            ref={sidebarRef}
            width="230px"
            trigger={null}
            collapsible
            className="side-bar"
            collapsed={collapsed}
            collapsedWidth={0}
            breakpoint="lg"
          >
            <SiderComponent handleToggle={handleToggle} />
          </Sider>
          <Card style={{ width: "100%", margin: 20 }} bordered={false}>
            <Content style={contentStyle}>
              <HomeRoutes />
            </Content>
          </Card>
        </Layout>
        {/* <FooterComponent /> */}
      </Layout>
    </>
  ) : (
    <ErrorPage />
  );
};

const layoutStyle = {
  overflow: "hidden",
  width: "100%",
  minHeight: "100vh", // Set the minimum height of the layout to fill the screen
};

const contentStyle = {
  padding: "10px 14px",
  height: "100%", // Set the height to 100% to fill the container
};

export default Home;
