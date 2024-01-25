import { Skeleton, Empty, Menu, Layout, theme, Typography, Input, Row, Col, Space } from "antd";
import { getKbTypes } from "../../../redux/stores/kbTypesSlicer";
import { useEffect, useState } from "react";
import { useParams, Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadStatuses } from "../../../GLOBAL";
import "./Types.css";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import mobileCheck from "../../../utils/mobileCheck";
import AddEntityButton from "../AddEntityButton";

export default () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [itemFilter, setItemFilter] = useState();
    const dispatch = useDispatch();
    const { id, typeId } = useParams();
    const kbTypesStore = useSelector((state) => state.kbTypes);
    useEffect(() => {
        if (!kbTypesStore.kbId || parseInt(id) !== parseInt(kbTypesStore.kbId)) {
            dispatch(getKbTypes(id));
        }
    }, []);
    const menuItems = kbTypesStore.types
        .filter((type) => (itemFilter ? type.kb_id.includes(itemFilter) : true))
        .map((type) =>
            Object({
                key: type.id.toString(),
                label: <Link to={`/knowledge_bases/${id}/types/${type.id}`}>{type.kb_id}</Link>,
            })
        );

    const typeList = (
        <>
            <div className="sider-divider">
                <Row style={{ width: 176 }} justify="space-between" align="middle">
                    <Col>
                        <Typography.Title level={5} className="types-list-title">
                            Список типов
                        </Typography.Title>
                    </Col>
                    <Col>
                        <AddEntityButton size="small" icon={<PlusOutlined />} type="primary" ghost kbTab="types" />
                    </Col>
                </Row>
                <Input
                    value={itemFilter}
                    onChange={(e) => setItemFilter(e.target.value)}
                    style={mobileCheck() ? {} : { width: 176 }}
                    prefix={<SearchOutlined />}
                    placeholder="Поиск..."
                />
            </div>
            <Menu
                style={mobileCheck() ? { width: "100%" } : { maxHeight: "calc(100vh - 378px)", height: "calc(100% - 70px)", overflowY: "scroll" }}
                items={menuItems}
                selectedKeys={[typeId]}
                mode="vertical"
            />
        </>
    );

    return kbTypesStore.status !== loadStatuses.loaded ? (
        <Skeleton />
    ) : kbTypesStore.types.length ? (
        mobileCheck() ? (
            typeId ? (
                <Outlet />
            ) : (
                typeList
            )
        ) : (
            <Layout style={{ minHeight: "calc(100vh - 348px)", backgroundColor: colorBgContainer }}>
                <Layout.Sider style={{ minHeight: "calc(100vh - 348px)", backgroundColor: colorBgContainer }}>{typeList}</Layout.Sider>
                <Layout.Content style={{ minHeight: "100%", backgroundColor: colorBgContainer }}>
                    <Outlet />
                </Layout.Content>
            </Layout>
        )
    ) : (
        <Empty description="Типов не создано" />
    );
};
