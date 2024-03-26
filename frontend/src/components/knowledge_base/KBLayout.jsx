import { Tabs, Form, Input, Button, Skeleton, Row, Col, Typography, Collapse, Menu, Result, Spin } from "antd";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useMatches, Outlet, useParams, Navigate } from "react-router-dom";
import ThemedContainer, { ThemedBar } from "../../utils/ThemedContainer";
import { getKb } from "../../redux/stores/kbSlicer";
import "./KBLayout.css";
import AddEntityButton from "../../utils/AddEntityButton";
import mobileCheck from "../../utils/mobileCheck";

export default () => {
    const matches = useMatches();
    const kbTabMatch = matches.reverse().find((m) => m.data && m.data.kbTab);
    const kbTab = kbTabMatch ? kbTabMatch.data.kbTab : undefined;
    const { id } = useParams();

    const dispatch = useDispatch();
    const kbStore = useSelector((state) => state.kb);
    useEffect(() => {
        if (!kbStore.knowledgeBase || kbStore.knowledgeBase.id !== parseInt(id)) {
            dispatch(getKb(id));
        }
    }, []);

    const objectsTab = mobileCheck()
        ? [
              {
                  key: "objects",
                  label: (
                      <Link className="kb-edit-tab" to={`/knowledge_bases/${id}/objects`}>
                          Все объекты
                      </Link>
                  ),
              },
          ]
        : [];

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
            key: mobileCheck() ? "objects_select" : "objects",
            label: mobileCheck() ? (
                "Объекты"
            ) : (
                <Link className="kb-edit-tab" style={{ color: "inherit" }} to={`/knowledge_bases/${id}/objects`}>
                    Объекты
                </Link>
            ),
            children: objectsTab.concat([
                {
                    key: "base_objects",
                    label: (
                        <Link className="kb-edit-tab" to={`/knowledge_bases/${id}/objects/base_objects`}>
                            Базовые объекты
                        </Link>
                    ),
                },
                {
                    key: "temporal_objects",
                    label: "Темпоральные объекты",
                    children: [
                        {
                            key: "intervals",
                            label: (
                                <Link className="kb-edit-tab" to={`/knowledge_bases/${id}/objects/intervals`}>
                                    Интервалы
                                </Link>
                            ),
                        },
                        {
                            key: "events",
                            label: (
                                <Link className="kb-edit-tab" to={`/knowledge_bases/${id}/objects/events`}>
                                    События
                                </Link>
                            ),
                        },
                    ],
                },
            ]),
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
                    <br />
                    {kbStore.knowledgeBase.status == 1 ? (
                        <Result
                            status={"info"}
                            title="Ожидание"
                            extra={
                                <>
                                    <Spin size="large" />
                                    <Typography.Paragraph>В данный момент осуществляется чтение БЗ из файла</Typography.Paragraph>
                                </>
                            }
                        />
                    ) : kbStore.knowledgeBase.status == 2 ? (
                        <Outlet />
                    ) : (
                        <Result
                            status={"error"}
                            title="Ошибка"
                            extra={
                                <>
                                    <Typography.Paragraph>При чтении БЗ из файла произошла ошибка</Typography.Paragraph>
                                    <br />
                                    <br />
                                    <Typography.Paragraph>
                                        <code>{kbStore.knowledgeBase.error}</code>
                                    </Typography.Paragraph>
                                </>
                            }
                        />
                    )}
                </>
            ) : (
                <Skeleton active />
            )}
        </ThemedContainer>
    );
};
