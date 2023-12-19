import React, { useState } from "react";
import MainMenu from "./components/MainMenu";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;

const App = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout
            style={{
                minHeight: "100vh",
            }}
        >
            <MainMenu />
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content
                    style={{
                        margin: "0 16px",
                    }}
                >
                    <Breadcrumb style={{ margin: "16px 0" }} items={[{ title: "User" }, { title: "Bill" }]} />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                        }}
                    >
                        Bill is a cat.
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: "center",
                    }}
                >
                    Ant Design ©2023 Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};
export default App;
