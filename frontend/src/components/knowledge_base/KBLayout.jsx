import { Tabs, Form, Input, Button, Skeleton, Row, Col, Typography, Collapse, Menu } from "antd";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useMatches, Outlet, useParams, Navigate } from "react-router-dom";
import ThemedContainer, { ThemedBar } from "../../utils/ThemedContainer";
import { getKb } from "../../redux/stores/kbSlicer";
import "./KBLayout.css";
import AddEntityButton from "./AddEntityButton";
import mobileCheck from "../../utils/mobileCheck";

export default () => {
    const matches = useMatches();
    const kbTabMatch = matches.find((m) => m.data && m.data.kbTab);
    const kbTab = kbTabMatch ? kbTabMatch.data.kbTab : undefined;
    const { id } = useParams();

    const dispatch = useDispatch();
    const kbStore = useSelector((state) => state.kb);
    useEffect(() => {
        if (!kbStore.knowledgeBase || kbStore.knowledgeBase.id !== parseInt(id)) {
            dispatch(getKb(id));
        }
    }, []);

    const items = [
        {
            key: "general",
            label: (
                <Link className="kb-edit-tab" to={`/knowledge_bases/${id}/`}>
                    Общие настройки
                </Link>
            ),
        },
        {
            key: "types",
            label: (
                <Link className="kb-edit-tab" to={`/knowledge_bases/${id}/types`}>
                    Типы
                </Link>
            ),
        },
        {
            key: "objects",
            label: (
                <Link className="kb-edit-tab" to={`/knowledge_bases/${id}/objects`}>
                    Объекты
                </Link>
            ),
        },
        {
            key: "rules",
            label: (
                <Link className="kb-edit-tab" to={`/knowledge_bases/${id}/rules`}>
                    Правила
                </Link>
            ),
        },
    ];

    return (
        <ThemedContainer>
            {kbStore.knowledgeBase && kbStore.knowledgeBase.id === parseInt(id) ? (
                <>
                    <Typography.Title className="kb-title" level={3}>
                        База знаний «{kbStore.knowledgeBase.name}»
                    </Typography.Title>
                    <Menu
                        className="kb-edit-tabs"
                        mode="horizontal"
                        selectedKeys={[kbTab]}
                        items={items}
                        tabBarExtraContent={{
                            right: <AddEntityButton kbTab={kbTab} />,
                        }}
                    />
                    <ThemedBar style={{ marginTop: 0, paddingTop: 15, ...(mobileCheck() ? { paddingLeft: 0, paddingRight: 0 } : {}) }}>
                        <Outlet />
                    </ThemedBar>
                </>
            ) : (
                <Skeleton active />
            )}
        </ThemedContainer>
    );
};
