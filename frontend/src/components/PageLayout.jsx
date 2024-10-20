import MainMenu, { PageMenu } from "./MainMenu";
import { Layout, theme, Typography } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import PageHeader from "../utils/PageHeader";
import { useState } from "react";
import mobileCheck from "../utils/mobileCheck";
import { useEffect } from "react";

const { Header, Content, Footer } = Layout;

export default () => {
    const themeToken = theme.useToken();
    const {
        token: { colorBgContainer },
    } = themeToken;

    const [width, setWidth] = useState(80);

    const location = useLocation();

    useEffect(() => {
        const frameId = window.sessionStorage.getItem("frameId");
        if (frameId) {
            const parentOrigin = window.sessionStorage.getItem("parentOrigin") || "*";
            window.parent.postMessage({ type: "urlUpdate", frameId, url: window.location.href }, parentOrigin);
        }
    }, [location]);

    const content = (
        <Layout style={{ marginLeft: mobileCheck() ? 0 : width, transition: "0.2s" }}>
            <Header style={{ padding: 0, background: colorBgContainer }}>{mobileCheck() ? <PageMenu /> : <PageHeader title="Редактор базы знаний" />}</Header>
            <Content
                style={
                    mobileCheck()
                        ? {}
                        : {
                              margin: "0 16px",
                          }
                }
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
    );

    return mobileCheck() ? (
        content
    ) : (
        <Layout
            style={{
                minHeight: "100vh",
            }}
        >
            {mobileCheck() ? <></> : <MainMenu width={width} setWidth={setWidth} />}
            {content}
        </Layout>
    );
};
