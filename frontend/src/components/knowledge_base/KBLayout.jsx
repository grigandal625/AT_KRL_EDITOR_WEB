import { Tabs, Form, Input, Button, Skeleton, Row, Col, Typography, Collapse } from "antd";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useMatches, Outlet, useParams, Navigate } from "react-router-dom";
import ThemedContainer from "../../utils/ThemedContainer";
import { getKb } from "../../redux/stores/kbSlicer";
import "./KBLayout.css";

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
            key: "types",
            label: <Link to={`/knowledge_bases/${id}/types`}>Типы</Link>,
            children: <Outlet />,
        },
        {
            key: "objects",
            label: <Link to={`/knowledge_bases/${id}/objects`}>Объекты</Link>,
            children: <Outlet />,
        },
        {
            key: "rules",
            label: <Link to={`/knowledge_bases/${id}/rules`}>Правила</Link>,
            children: <Outlet />,
        },
    ];
    return matches.length < 4 ? (
        <Navigate to={`/knowledge_bases/${id}/types`} replace />
    ) : (
        <ThemedContainer>
            {kbStore.knowledgeBase && kbStore.knowledgeBase.id === parseInt(id) ? (
                <>
                    <Typography.Title className="kb-title" level={3}>
                        База знаний «{kbStore.knowledgeBase.name}»
                    </Typography.Title>
                    <Collapse
                        className="kb-general"
                        items={[
                            {
                                key: "main",
                                label: "Общие настройки и описание",
                                children: (
                                    <Form
                                        onFinish={(...args) => {
                                            console.log(...args);
                                        }}
                                        layout="vertical"
                                    >
                                        <Form.Item
                                            required
                                            initialValue={kbStore.knowledgeBase.name}
                                            name="name"
                                            label="Имя файла БЗ"
                                        >
                                            <Input addonAfter=".kbs" />
                                        </Form.Item>
                                        <Form.Item
                                            initialValue={kbStore.knowledgeBase.problem_area}
                                            name="problem_area"
                                            label="Проблемная область"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            initialValue={kbStore.knowledgeBase.description}
                                            name="description"
                                            label="Описание задач"
                                        >
                                            <Input.TextArea style={{ minHeight: 250 }} />
                                        </Form.Item>

                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                Сохранить
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                ),
                            },
                        ]}
                    />
                    <Tabs activeKey={kbTab} items={items} />
                </>
            ) : (
                <Skeleton active />
            )}
        </ThemedContainer>
    );
};
