import { Skeleton, Empty, Menu, Layout, theme, Typography, Input, Row, Col, Tooltip } from "antd";

import { useEffect, useState } from "react";
import { useParams, Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadStatuses } from "../GLOBAL";
import "./KBItemMenuList.css";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import mobileCheck from "./mobileCheck";
import AddEntityButton from "./AddEntityButton";

export const ItemMenu = ({ storeSelector, asSider }) => {
    const [itemFilter, setItemFilter] = useState();
    const store = useSelector(storeSelector);
    const kbItems = store.items;
    const params = useParams();
    const { id } = params;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!store.kbId || parseInt(id) !== parseInt(store.kbId)) {
            dispatch(store.getAction(id));
        }
    }, []);

    const menuItems = kbItems
        .filter((item) => (itemFilter ? item.kb_id.includes(itemFilter) : true))
        .map((item) =>
            Object({
                key: item.id.toString(),
                label: (
                    <Tooltip title={mobileCheck() || !asSider ? item.kb_id : ""}>
                        <Link title={item.kb_id} to={store.urlRenderer({ ...params, item })}>
                            {item.kb_id}
                        </Link>
                    </Tooltip>
                ),
            })
        );

    return (
        <>
            <div className="sider-divider" style={mobileCheck() || !asSider ? { borderRight: 0 } : {}}>
                <Row style={mobileCheck() || !asSider ? {} : { width: 176 }} justify="space-between" align="middle">
                    <Col>
                        <Typography.Title level={5} className="kbitem-list-title">
                            {store.listTitle}
                        </Typography.Title>
                    </Col>
                    <Col>
                        <AddEntityButton
                            size="small"
                            icon={<PlusOutlined />}
                            type="primary"
                            ghost
                            kbTab={store.kbTab}
                        />
                    </Col>
                </Row>
                <Input
                    value={itemFilter}
                    onChange={(e) => setItemFilter(e.target.value)}
                    style={mobileCheck() || !asSider ? {} : { width: 176 }}
                    prefix={<SearchOutlined />}
                    placeholder="Поиск..."
                />
            </div>
            {kbItems.length ? (
                <Menu
                    style={
                        mobileCheck() || !asSider
                            ? { width: "100%", borderRight: 0 }
                            : { maxHeight: "calc(100vh - 378px)", height: "calc(100% - 70px)", overflowY: "scroll" }
                    }
                    items={menuItems}
                    selectedKeys={[params[store.itemParamKey]]}
                    mode="vertical"
                />
            ) : (
                <>
                    <br />
                    <Empty description={store.notCreatedLabel} />
                </>
            )}
        </>
    );
};

export default ({ storeSelector }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const dispatch = useDispatch();
    const { id, ...params } = useParams();

    const store = useSelector(storeSelector);
    const kbItems = store.items;
    useEffect(() => {
        if (!store.kbId || parseInt(id) !== parseInt(store.kbId)) {
            dispatch(store.getAction(id));
        }
    }, []);

    return store.status !== loadStatuses.loaded ? (
        <Skeleton />
    ) : kbItems.length ? (
        mobileCheck() ? (
            params[store.itemParamKey] ? (
                <Outlet />
            ) : (
                <ItemMenu storeSelector={storeSelector} />
            )
        ) : (
            <Layout style={{ minHeight: "calc(100vh - 348px)", backgroundColor: colorBgContainer }}>
                <Layout.Sider style={{ minHeight: "calc(100vh - 348px)", backgroundColor: colorBgContainer }}>
                    <ItemMenu asSider storeSelector={storeSelector} />
                </Layout.Sider>
                <Layout.Content style={{ minHeight: "100%", backgroundColor: colorBgContainer }}>
                    <Outlet />
                </Layout.Content>
            </Layout>
        )
    ) : (
        <Empty description={store.notCreatedLabel}>
            <AddEntityButton type="primary" icon={<PlusOutlined />} kbTab={store.kbTab}>
                {store.createLabel}
            </AddEntityButton>
        </Empty>
    );
};
