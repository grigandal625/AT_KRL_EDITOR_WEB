import { DeleteOutlined, FileAddOutlined, FolderViewOutlined, SettingOutlined } from "@ant-design/icons";
import { Form, Skeleton, Row, Col, Typography, Dropdown, Button, Card, Input, Modal, theme } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadStatuses } from "../../../../GLOBAL";
import mobileCheck from "../../../../utils/mobileCheck";
import { selectkbIntervals, updateInterval, resetKrl, deleteInterval, loadIntervalKrl, duplicateInterval } from "../../../../redux/stores/kbItervalsSlicer";
import IntervalOpenCloseForm from "./IntervalOpenCloseForm";
import MainIntervalForm from "./MainIntervalForm";

export default () => {
    const { id, intervalId } = useParams();
    const navigate = useNavigate();
    const kbIntervalsStore = useSelector(selectkbIntervals);
    const dispatch = useDispatch();
    const {
        token: { borderRadius },
    } = theme.useToken();

    const interval = kbIntervalsStore.items.find((e) => parseInt(e.id) === parseInt(intervalId));

    const [form] = Form.useForm();
    const [openCloseFrom] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(interval);
        openCloseFrom.setFieldsValue(interval);
    }, [interval]);

    const items = [
        {
            label: "Удалить интервал",
            icon: <DeleteOutlined />,
            key: "delete",
            danger: true,
        },
        {
            label: "Дублировать интервал",
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
            title: "Удаление интервала",
            content: (
                <>
                    Удалить интервал <b>{interval.kb_id}</b> ?
                </>
            ),
            style: { borderRadius },
            onOk: () => {
                dispatch(deleteInterval({ id, intervalId, navigate }));
            },
            okText: "Удалить",
            cancelText: "Отмена",
            okButtonProps: { style: { borderRadius } },
            cancelButtonProps: { style: { borderRadius } },
        });
    };
    const duplicate = () => dispatch(duplicateInterval({ id, intervalId, navigate }));
    const preview = () => dispatch(loadIntervalKrl({ id, intervalId }));

    const actions = {
        delete: performDelete,
        duplicate,
        preview,
    };

    const saveOpenClose = async () => {
        try {
            const occurance_condition = await openCloseFrom.validateFields();
            dispatch(updateInterval({ id, intervalId, data: occurance_condition }));
        } catch (e) {
            console.error(e);
        }
    };

    const saveInterval = async () => {
        try {
            const data = await form.validateFields();
            dispatch(updateInterval({ id, intervalId, data }));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={mobileCheck() ? "" : "container"} style={{ paddingTop: 0 }}>
            {interval ? (
                <Row wrap={false}>
                    <Col flex="auto">
                        <Typography.Title className="kb-title kbitem-title" level={4}>
                            Событие «{interval.kb_id}»
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
            {kbIntervalsStore.status === loadStatuses.loaded && interval ? (
                <Row style={{ minHeight: "calc(100vh - 395px)" }} gutter={[5, 5]}>
                    <Col xxl={6} xl={10} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            style={{ minHeight: "100%", minWidth: "100%" }}
                            title={
                                <Row wrap={false} align="middle" justify="space-between">
                                    <Col>Основные данные</Col>
                                    <Col>
                                        <Button
                                            loading={kbIntervalsStore.saveStatus !== loadStatuses.loaded}
                                            {...(mobileCheck() ? { size: "small" } : {})}
                                            onClick={saveInterval}
                                            type="primary"
                                        >
                                            Сохранить
                                        </Button>
                                    </Col>
                                </Row>
                            }
                        >
                            <MainIntervalForm layout="vertical" form={form} initialValues={interval} />
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
                                            loading={kbIntervalsStore.saveStatus !== loadStatuses.loaded}
                                            {...(mobileCheck() ? { size: "small" } : {})}
                                            type="primary"
                                            onClick={saveOpenClose}
                                        >
                                            Сохранить
                                        </Button>
                                    </Col>
                                </Row>
                            }
                        >
                            <IntervalOpenCloseForm form={openCloseFrom} layout="vertical"/>
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
                open={[loadStatuses.loaded, loadStatuses.loading].includes(kbIntervalsStore.krlStatus)}
                cancelButtonProps={{
                    style: { display: "none" },
                }}
            >
                {kbIntervalsStore.krlStatus === loadStatuses.loaded ? <Input.TextArea readOnly style={{ minHeight: 350 }} value={kbIntervalsStore.previewKrl} /> : <Skeleton active />}
            </Modal>
        </div>
    );
};
