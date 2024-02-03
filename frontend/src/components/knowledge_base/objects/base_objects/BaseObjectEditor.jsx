import { DeleteOutlined, FileAddOutlined, FolderViewOutlined, SettingOutlined } from "@ant-design/icons";
import { Form, Skeleton, Row, Col, Typography, Dropdown, Button, Card, Input, Modal, theme } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadStatuses } from "../../../../GLOBAL";
import { duplicateObject, selectKbObjects, setObjectAttrs, updateObject, deleteObject, resetKrl, loadObjectKrl } from "../../../../redux/stores/kbObjectsSlicer";
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

    const saveAttrs = async () => {
        try {
            const data = await attrsForm.validateFields();
            dispatch(setObjectAttrs({ id, objectId, ...data }));
        } catch (e) {
            console.error(e);
        }
    };

    const saveObj = async () => {
        try {
            const data = await form.validateFields();
            dispatch(updateObject({ id, objectId, data }));
        } catch (e) {
            console.error(e);
        }
    };

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
                                    <Col>
                                        <Button
                                            loading={kbObjectsStore.saveStatus !== loadStatuses.loaded}
                                            {...(mobileCheck() ? { size: "small" } : {})}
                                            onClick={saveObj}
                                            type="primary"
                                        >
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
                                        <Button
                                            loading={kbObjectsStore.saveStatus !== loadStatuses.loaded}
                                            {...(mobileCheck() ? { size: "small" } : {})}
                                            type="primary"
                                            onClick={saveAttrs}
                                        >
                                            Сохранить
                                        </Button>
                                    </Col>
                                </Row>
                            }
                        >
                            <AttributesForm form={attrsForm} />
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
