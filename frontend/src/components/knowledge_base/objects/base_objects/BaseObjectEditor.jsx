import { DeleteOutlined, FileAddOutlined, FolderViewOutlined, SettingOutlined, CheckOutlined, ExclamationCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { Form, Skeleton, Row, Col, Typography, Dropdown, Button, Card, Input, Modal, theme, Space, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadStatuses } from "../../../../GLOBAL";
import {
    duplicateObject,
    selectKbObjects,
    setObjectAttrs,
    updateObject,
    deleteObject,
    resetKrl,
    loadObjectKrl,
    setAutoSaveStatus,
    setTimer,
} from "../../../../redux/stores/kbObjectsSlicer";
import mobileCheck from "../../../../utils/mobileCheck";
import AttributesForm from "./AttributesForm";
import MainBaseObjectForm from "./MainBaseObjectForm";

export default () => {
    const { id, objectId } = useParams();
    const navigate = useNavigate();
    const kbObjectsStore = useSelector(selectKbObjects);
    const dispatch = useDispatch();
    const {
        token: { borderRadius },
    } = theme.useToken();

    const [autoSaving, setAutoSaving] = useState(false);
    useEffect(() => {
        if (autoSaving && kbObjectsStore.autoSaveStatus === loadStatuses.loaded) {
            setAutoSaving(false);
        }
    }, [kbObjectsStore.autoSaveStatus]);

    const object = kbObjectsStore.items.find((o) => parseInt(o.id) === parseInt(objectId));

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

    const performDelete = () => {
        Modal.confirm({
            title: "Удаление объекта",
            content: (
                <>
                    Удалить объект <b>{object.kb_id}</b> ?
                </>
            ),
            style: { borderRadius },
            onOk: () => {
                dispatch(deleteObject({ id, objectId, navigate }));
            },
            okText: "Удалить",
            cancelText: "Отмена",
            okButtonProps: { style: { borderRadius } },
            cancelButtonProps: { style: { borderRadius } },
        });
    };
    const duplicate = () => dispatch(duplicateObject({ id, objectId, navigate }));
    const preview = () => dispatch(loadObjectKrl({ id, objectId }));

    const actions = {
        delete: performDelete,
        duplicate,
        preview,
    };

    const update = async () => {
        try {
            let data = await form.validateFields();
            const attrs = await attrsForm.validateFields();
            data = { ...data, ...attrs };
            dispatch(updateObject({ id, objectId, data }));
        } catch (e) {
            dispatch(setAutoSaveStatus(loadStatuses.error));
            setAutoSaving(false);
        }
    };

    const autoSave = () => {
        if (!inFrame) {
            setAutoSaving(true);
            dispatch(setTimer(update));
        }
    };

    const autoSaveStatusElement =
        kbObjectsStore.autoSaveStatus === loadStatuses.loading || (autoSaving && kbObjectsStore.autoSaveStatus !== loadStatuses.error) ? (
            <Space>
                <Spin size="small" />
                <Typography.Text type="secondary">Сохранение...</Typography.Text>
            </Space>
        ) : kbObjectsStore.autoSaveStatus === loadStatuses.error ? (
            <Tag color="error" icon={<ExclamationCircleOutlined />}>
                Ошибка сохранения
            </Tag>
        ) : (
            <Tag color="success" icon={<CheckOutlined />}>
                Данные сохранены
            </Tag>
        );

    const inFrame = Boolean(window.sessionStorage.getItem("frameId"));

    return (
        <div className={mobileCheck() ? "" : "container"} style={{ paddingTop: 0 }}>
            {object ? (
                <Row wrap={false}>
                    <Col flex="auto">
                        <Typography.Title className="kb-title kbitem-title" level={4}>
                            Объект «{object.kb_id}»
                        </Typography.Title>
                    </Col>
                    {inFrame ? (
                        <Col>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={() => {
                                    setAutoSaving(true);
                                    update();
                                }}
                            >
                                Сохранить
                            </Button>
                        </Col>
                    ) : (
                        <></>
                    )}
                    <Col>
                        <Dropdown menu={{ items, onClick: ({ key }) => actions[key]() }} trigger={["click"]}>
                            <Button type="text" {...(mobileCheck() ? { size: "small" } : {})} onClick={(e) => e.preventDefault()} icon={<SettingOutlined />}>
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
                                    <Col>{autoSaveStatusElement}</Col>
                                </Row>
                            }
                        >
                            <MainBaseObjectForm layout="vertical" form={form} initialValues={object} onValuesChange={autoSave} />
                        </Card>
                    </Col>
                    <Col xxl={18} xl={14} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            style={{ minHeight: "100%", minWidth: "100%" }}
                            title={
                                <Row wrap={false} align="middle" justify="space-between">
                                    <Col>Атрибуты</Col>
                                    <Col>{autoSaveStatusElement}</Col>
                                </Row>
                            }
                        >
                            <AttributesForm form={attrsForm} onValuesChange={autoSave} />
                        </Card>
                    </Col>
                </Row>
            ) : (
                <Skeleton active />
            )}
            <Modal
                title="Предпросмотр"
                style={{ borderRadius }}
                width={600}
                okText="Закрыть"
                onOk={() => dispatch(resetKrl())}
                onCancel={() => dispatch(resetKrl())}
                okButtonProps={{ style: { borderRadius } }}
                open={[loadStatuses.loaded, loadStatuses.loading].includes(kbObjectsStore.krlStatus)}
                cancelButtonProps={{
                    style: { display: "none" },
                }}
            >
                {kbObjectsStore.krlStatus === loadStatuses.loaded ? <Input.TextArea readOnly style={{ minHeight: 350 }} value={kbObjectsStore.previewKrl} /> : <Skeleton active />}
            </Modal>
        </div>
    );
};
