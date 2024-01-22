import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Form, Skeleton, Row, Col, Typography, Dropdown, Card } from "antd";
import { loadStatuses } from "../../../GLOBAL";
import MainTypeForm from "./MainTypeForm";
import { useEffect } from "react";
import mobileCheck from "../../../utils/mobileCheck";
import { DeleteOutlined, FileAddOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";

export default () => {
    const kbTypesStore = useSelector((state) => state.kbTypes);
    const { id, typeId } = useParams();
    const [form] = Form.useForm();

    const type = kbTypesStore.types.find((t) => parseInt(t.id) === parseInt(typeId));
    useEffect(() => {
        debugger;
        form.setFieldsValue(type);
    }, [type]);

    const items = [
        {
            label: "Удалить тип",
            icon: <DeleteOutlined />,
            key: "delete",
            danger: true,
        },
        {
            label: "Дублировать тип",
            icon: <FileAddOutlined />,
            key: "duplicate",
        },
    ];
    return (
        <div className={mobileCheck() ? "" : "container"} style={{ paddingTop: 0 }}>
            {type ? (
                <Typography.Title className="kb-title type-title" level={4}>
                    Тип «{type.kb_id}»
                </Typography.Title>
            ) : (
                <></>
            )}
            {kbTypesStore.status === loadStatuses.loaded ? (
                <Row gutter={5}>
                    <Col md={24} sm={24} xs={24} lg={7} xl={7} xxl={7}>
                        <Card
                            style={{ minHeight: "100%", minWidth: "100%" }}
                            title={
                                <Row align="middle" justify="space-between">
                                    <Col>Базовые настройки</Col>
                                    <Col>
                                        <Dropdown menu={{ items }} trigger={["click"]}>
                                            <Button onClick={(e) => e.preventDefault()} icon={<SettingOutlined />} />
                                        </Dropdown>
                                    </Col>
                                </Row>
                            }
                        >
                            <MainTypeForm
                                layout="vertical"
                                form={form}
                                initialValues={type}
                                showSuffix
                                onValuesChange={(...args) => console.log(...args)}
                            />
                            <Button type="primary">Сохранить</Button>
                        </Card>
                    </Col>
                    <Col md={24} sm={24} xs={24} lg={17} xl={17} xxl={17} style={5}>
                        <Card
                            style={{ minHeight: "100%", minWidth: "100%" }}
                            title={
                                <Row align="middle" justify="space-between">
                                    <Col>Значения</Col>
                                    <Col>
                                        <Button type="primary" ghost icon={<PlusOutlined />} />
                                    </Col>
                                </Row>
                            }
                        ></Card>
                    </Col>
                </Row>
            ) : (
                <Skeleton />
            )}
        </div>
    );
};
