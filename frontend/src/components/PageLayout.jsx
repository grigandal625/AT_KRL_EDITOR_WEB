import MainMenu from "./MainMenu";
import { Layout, theme, Typography } from "antd";
import { Outlet } from "react-router-dom";
import PageHeader from "../utils/PageHeader";
const { Header, Content, Footer } = Layout;

export default () => {
    const themeToken = theme.useToken();
    const {
        token: { colorBgContainer },
    } = themeToken;
    console.log(themeToken);
    return (
        <Layout
            style={{
                minHeight: "100vh",
            }}
        >
            <MainMenu />
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <PageHeader title="Редактор базы знаний" />
                </Header>
                <Content
                    style={{
                        margin: "0 16px",
                    }}
                >
                    <Outlet />
                </Content>
                <Footer
                    style={{
                        textAlign: "center",
                    }}
                >
                    Лаборатория «Интеллекутальные системы и технологии» ©2024
                </Footer>
            </Layout>
        </Layout>
    );
};
