import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Form, Skeleton, Row, Col, Typography, Dropdown, Card, Tooltip, Space, theme, message } from "antd";
import { loadStatuses } from "../../../GLOBAL";
import MainTypeForm from "./MainTypeForm";
import { useEffect, useState } from "react";
import mobileCheck from "../../../utils/mobileCheck";
import { DeleteOutlined, FileAddOutlined, FolderViewOutlined, SettingOutlined, WarningFilled } from "@ant-design/icons";
import SymbolicTypeValuesForm from "./values/SymbolicTypeValuesForm";
import NumericTypeValuesForm from "./values/NumericTypeValuesForm";

export default () => {
    const kbTypesStore = useSelector((state) => state.kbTypes);
    const { id, typeId } = useParams();
    const [form] = Form.useForm();
    const [valuesForm] = Form.useForm();
    const [disabled, setDisabled] = useState(false);
    const {
        token: { colorWarningText },
    } = theme.useToken();

    const type = kbTypesStore.types.find((t) => parseInt(t.id) === parseInt(typeId));
    useEffect(() => {
        form.setFieldsValue(type);
        valuesForm.setFieldsValue(type);
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
        {
            label: "Предпросмотр в формате ЯПЗ",
            icon: <FolderViewOutlined />,
            key: "preview",
        },
    ];
    const valuesForms = {
        1: <SymbolicTypeValuesForm form={valuesForm} disabled={disabled} />,
        2: <NumericTypeValuesForm form={valuesForm} disabled={disabled} />,
    };
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
                <Row style={{ minHeight: "calc(100vh - 395px)" }} gutter={[5, 5]}>
                    <Col xxl={12} xl={12} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            style={{ minHeight: "100%", minWidth: "100%" }}
                            title={
                                <Row wrap={false} align="middle" justify="space-between">
                                    <Col>Основные данные</Col>
                                    <Col>
                                        <Space>
                                            <Button {...(mobileCheck() ? { size: "small" } : {})} type="primary">
                                                Сохранить
                                            </Button>
                                            <Dropdown menu={{ items }} trigger={["click"]}>
                                                <Button {...(mobileCheck() ? { size: "small" } : {})} onClick={(e) => e.preventDefault()} icon={<SettingOutlined />} />
                                            </Dropdown>
                                        </Space>
                                    </Col>
                                </Row>
                            }
                        >
                            <MainTypeForm
                                layout="vertical"
                                form={form}
                                initialValues={type}
                                showSuffix
                                onValuesChange={(changed) => {
                                    if (changed.hasOwnProperty("meta")) {
                                        setDisabled(type.meta !== changed.meta);
                                    }
                                }}
                            />
                        </Card>
                    </Col>
                    <Col xxl={12} xl={12} lg={24} md={24} sm={24} xs={24}>
                        <Tooltip
                            open={disabled}
                            title={
                                <Space>
                                    <WarningFilled style={{ color: colorWarningText }} />
                                    <span>Изменен базовый тип. При сохранении значения будут удалены</span>
                                </Space>
                            }
                        >
                            <Card
                                style={{ minHeight: "100%", minWidth: "100%" }}
                                title={
                                    <Row wrap={false} align="middle" justify="space-between">
                                        <Col>Значения</Col>
                                        <Col>
                                            <Button
                                                {...(mobileCheck() ? { size: "small" } : {})}
                                                disabled={disabled}
                                                type="primary"
                                                onClick={async () => {
                                                    try {
                                                        const values = await valuesForm.validateFields();
                                                        console.log(values);
                                                    } catch (e) {
                                                        message.error("Некорректно заполнены данные");
                                                    }
                                                }}
                                            >
                                                Сохранить
                                            </Button>
                                        </Col>
                                    </Row>
                                }
                            >
                                {valuesForms[type.meta]}
                            </Card>
                        </Tooltip>
                    </Col>
                </Row>
            ) : (
                <Skeleton />
            )}
        </div>
    );
};
