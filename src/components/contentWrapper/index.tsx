import React from "react";

import { Layout, theme } from "antd";
const { Content } = Layout;
type FooProps = {
  children: React.ReactNode; // JSX.Element //
};
const ContentWrapper: React.FC<FooProps> = (props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Content
      style={{
        background: colorBgContainer,
        borderRadius: 7,
      }}
    >
      {props.children}
    </Content>
  );
};

export default ContentWrapper;
