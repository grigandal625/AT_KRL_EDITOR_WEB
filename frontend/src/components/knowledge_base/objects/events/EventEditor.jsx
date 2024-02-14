import { DeleteOutlined, FileAddOutlined, FolderViewOutlined, SettingOutlined } from "@ant-design/icons";
import { Form, Skeleton, Row, Col, Typography, Dropdown, Button, Card, Input, Modal, theme } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadStatuses } from "../../../../GLOBAL";
import mobileCheck from "../../../../utils/mobileCheck";
import { selectkbEvents, updateEvent, resetKrl, deleteEvent, loadEventKrl, duplicateEvent } from "../../../../redux/stores/kbEventsSlicer";
import EventOccuranceConditionForm from "./EventOccuranceConditionForm";
import MainEventForm from "./MainEventForm";

export default () => {
    const { id, eventId } = useParams();
    const navigate = useNavigate();
    const kbEventsStore = useSelector(selectkbEvents);
    const dispatch = useDispatch();
    const {
        token: { borderRadius },
    } = theme.useToken();

    const event = kbEventsStore.items.find((e) => parseInt(e.id) === parseInt(eventId));

    const [form] = Form.useForm();
    const [occCondForm] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(event);
        occCondForm.setFieldsValue(event);
    }, [event]);

    const items = [
        {
            label: "Удалить событие",
            icon: <DeleteOutlined />,
            key: "delete",
            danger: true,
        },
        {
            label: "Дублировать событие",
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
            title: "Удаление события",
            content: (
                <>
                    Удалить событие <b>{event.kb_id}</b> ?
                </>
            ),
            style: { borderRadius },
            onOk: () => {
                dispatch(deleteEvent({ id, eventId, navigate }));
            },
            okText: "Удалить",
            cancelText: "Отмена",
            okButtonProps: { style: { borderRadius } },
            cancelButtonProps: { style: { borderRadius } },
        });
    };
    const duplicate = () => dispatch(duplicateEvent({ id, eventId, navigate }));
    const preview = () => dispatch(loadEventKrl({ id, eventId }));

    const actions = {
        delete: performDelete,
        duplicate,
        preview,
    };

    const saveOccCond = async () => {
        try {
            const occurance_condition = await occCondForm.validateFields();
            dispatch(updateEvent({ id, eventId, data: occurance_condition }));
        } catch (e) {
            console.error(e);
        }
    };

    const saveEvent = async () => {
        try {
            const data = await form.validateFields();
            dispatch(updateEvent({ id, eventId, data }));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={mobileCheck() ? "" : "container"} style={{ paddingTop: 0 }}>
            {event ? (
                <Row wrap={false}>
                    <Col flex="auto">
                        <Typography.Title className="kb-title kbitem-title" level={4}>
                            Событие «{event.kb_id}»
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
            {kbEventsStore.status === loadStatuses.loaded && event ? (
                <Row style={{ minHeight: "calc(100vh - 395px)" }} gutter={[5, 5]}>
                    <Col xxl={6} xl={10} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            style={{ minHeight: "100%", minWidth: "100%" }}
                            title={
                                <Row wrap={false} align="middle" justify="space-between">
                                    <Col>Основные данные</Col>
                                    <Col>
                                        <Button
                                            loading={kbEventsStore.saveStatus !== loadStatuses.loaded}
                                            {...(mobileCheck() ? { size: "small" } : {})}
                                            onClick={saveEvent}
                                            type="primary"
                                        >
                                            Сохранить
                                        </Button>
                                    </Col>
                                </Row>
                            }
                        >
                            <MainEventForm layout="vertical" form={form} initialValues={event} />
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
                                            loading={kbEventsStore.saveStatus !== loadStatuses.loaded}
                                            {...(mobileCheck() ? { size: "small" } : {})}
                                            type="primary"
                                            onClick={saveOccCond}
                                        >
                                            Сохранить
                                        </Button>
                                    </Col>
                                </Row>
                            }
                        >
                            <EventOccuranceConditionForm form={occCondForm} />
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
                open={[loadStatuses.loaded, loadStatuses.loading].includes(kbEventsStore.krlStatus)}
                cancelButtonProps={{
                    style: { display: "none" },
                }}
            >
                {kbEventsStore.krlStatus === loadStatuses.loaded ? <Input.TextArea readOnly style={{ minHeight: 350 }} value={kbEventsStore.previewKrl} /> : <Skeleton active />}
            </Modal>
        </div>
    );
};
