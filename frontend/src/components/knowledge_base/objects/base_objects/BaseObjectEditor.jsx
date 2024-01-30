import { DeleteOutlined, FileAddOutlined, FolderViewOutlined, SettingOutlined } from "@ant-design/icons";
import { Form, Skeleton, Row, Col, Typography, Dropdown, Button, Card } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadStatuses } from "../../../../GLOBAL";
import { selectKbObjects } from "../../../../redux/stores/kbObjectsSlicer";
import mobileCheck from "../../../../utils/mobileCheck";
import MainBaseObjectForm from "./MainBaseObjectForm";

export default () => {
    const { id, objectId } = useParams();
    const kbObjectsStore = useSelector(selectKbObjects);

    const object = kbObjectsStore.items.find((o) => parseInt(o.id) == parseInt(objectId));

    const [form] = Form.useForm();
    const [attrsForm] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(object);
        attrsForm.setFieldsValue(object);
    }, [object]);

    const items = [
        {
            label: "Удалить объект",
            icon: <DeleteOutlined />,
            key: "delete",
            danger: true,
        },
        {
            label: "Дублировать объект",
            icon: <FileAddOutlined />,
            key: "duplicate",
        },
        {
            label: "Предпросмотр в формате ЯПЗ",
            icon: <FolderViewOutlined />,
            key: "preview",
        },
    ];

    return (
        <div className={mobileCheck() ? "" : "container"} style={{ paddingTop: 0 }}>
            {object ? (
                <Row wrap={false}>
                    <Col flex="auto">
                        <Typography.Title className="kb-title kbitem-title" level={4}>
                            Объект «{object.kb_id}»
                        </Typography.Title>
                    </Col>
                    <Col>
                        <Dropdown menu={{ items }} trigger={["click"]}>
                            <Button
                                type="text"
                                {...(mobileCheck() ? { size: "small" } : {})}
                                onClick={(e) => e.preventDefault()}
                                icon={<SettingOutlined />}
                            >
                                Опции
                            </Button>
                        </Dropdown>
                    </Col>
                </Row>
            ) : (
                <></>
            )}
            {kbObjectsStore.status === loadStatuses.loaded && object ? (
                <Row style={{ minHeight: "calc(100vh - 395px)" }} gutter={[5, 5]}>
                    <Col xxl={6} xl={10} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            style={{ minHeight: "100%", minWidth: "100%" }}
                            title={
                                <Row wrap={false} align="middle" justify="space-between">
                                    <Col>Основные данные</Col>
                                    <Col>
                                        <Button {...(mobileCheck() ? { size: "small" } : {})} type="primary">
                                            Сохранить
                                        </Button>
                                    </Col>
                                </Row>
                            }
                        >
                            <MainBaseObjectForm layout="vertical" form={form} initialValues={object} />
                        </Card>
                    </Col>
                    <Col xxl={18} xl={14} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            style={{ minHeight: "100%", minWidth: "100%" }}
                            title={
                                <Row wrap={false} align="middle" justify="space-between">
                                    <Col>Атрибуты</Col>
                                    <Col>
                                        <Button {...(mobileCheck() ? { size: "small" } : {})} type="primary">
                                            Сохранить
                                        </Button>
                                    </Col>
                                </Row>
                            }
                        ></Card>
                    </Col>
                </Row>
            ) : (
                <Skeleton active />
            )}
        </div>
    );
};
