import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteRule, duplicateRule, loadRuleKrl, resetKrl, selectkbRules, updateRule, updateRuleCondInstr, setTimer, setAutoSaveStatus } from "../../../redux/stores/kbRulesSlicer";
import { Card, Col, Form, Input, Modal, Row, Skeleton, Typography, theme, Button, Dropdown, Space, Spin, Tag } from "antd";
import mobileCheck from "../../../utils/mobileCheck";
import { loadStatuses } from "../../../GLOBAL";
import MainRuleForm from "./MainRuleForm";
import RuleConditionInstructionsForm from "./RuleConditionInstructionsForm";
import { useEffect, useState } from "react";
import { DeleteOutlined, FileAddOutlined, FolderViewOutlined, SettingOutlined, CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

export default () => {
    const { id, ruleId } = useParams();
    const navigate = useNavigate();
    const kbRulesStore = useSelector(selectkbRules);
    const {
        token: { borderRadius },
    } = theme.useToken();

    const [autoSaving, setAutoSaving] = useState(false);
    useEffect(() => {
        if (autoSaving && kbRulesStore.autoSaveStatus === loadStatuses.loaded) {
            setAutoSaving(false);
        }
    }, [kbRulesStore.autoSaveStatus]);

    const rule = kbRulesStore.items.find((r) => r.id === parseInt(ruleId));

    const dispatch = useDispatch();

    const [form] = Form.useForm();
    const [condInstrFrom] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(rule);
        condInstrFrom.setFieldsValue(rule);
    }, [rule]);

    const items = [
        {
            label: "Удалить правило",
            icon: <DeleteOutlined />,
            key: "delete",
            danger: true,
        },
        {
            label: "Дублировать правило",
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
            title: "Удаление правила",
            content: (
                <>
                    Удалить правило <b>{rule.kb_id}</b> ?
                </>
            ),
            style: { borderRadius },
            onOk: () => {
                dispatch(deleteRule({ id, ruleId, navigate }));
            },
            okText: "Удалить",
            cancelText: "Отмена",
            okButtonProps: { style: { borderRadius } },
            cancelButtonProps: { style: { borderRadius } },
        });
    };

    const duplicate = () => dispatch(duplicateRule({ id, ruleId, navigate }));
    const preview = () => dispatch(loadRuleKrl({ id, ruleId }));

    const actions = {
        delete: performDelete,
        duplicate,
        preview,
    };

    const update = async () => {
        try {
            let data = await form.validateFields();
            const cond_instr = await condInstrFrom.validateFields();
            data = { ...data, ...cond_instr };
            dispatch(updateRule({ id, ruleId, data }));
        } catch (e) {
            dispatch(setAutoSaveStatus(loadStatuses.error));
            setAutoSaving(false);
        }
    };

    const autoSave = () => {
        setAutoSaving(true);
        dispatch(setTimer(update));
    };

    const autoSaveStatusElement =
        kbRulesStore.autoSaveStatus === loadStatuses.loading || (autoSaving && kbRulesStore.autoSaveStatus !== loadStatuses.error) ? (
            <Space>
                <Spin size="small" />
                <Typography.Text type="secondary">Сохранение...</Typography.Text>
            </Space>
        ) : kbRulesStore.autoSaveStatus === loadStatuses.error ? (
            <Tag color="error" icon={<ExclamationCircleOutlined />}>
                Ошибка сохранения
            </Tag>
        ) : (
            <Tag color="success" icon={<CheckOutlined />}>
                Данные сохранены
            </Tag>
        );

    return (
        <div className={mobileCheck() ? "" : "container"} style={{ paddingTop: 0 }}>
            {rule ? (
                <Row wrap={false}>
                    <Col flex="auto">
                        <Typography.Title className="kb-title kbitem-title" level={4}>
                            Правило «{rule.kb_id}»
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
            {kbRulesStore.status === loadStatuses.loaded && rule ? (
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
                            <MainRuleForm layout="vertical" form={form} initialValues={rule} onValuesChange={autoSave} />
                        </Card>
                    </Col>
                    <Col xxl={18} xl={14} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            style={{ minHeight: "100%", minWidth: "100%" }}
                            title={
                                <Row wrap={false} align="middle" justify="space-between">
                                    <Col>Условия и действия</Col>
                                    <Col>{autoSaveStatusElement}</Col>
                                </Row>
                            }
                        >
                            <RuleConditionInstructionsForm form={condInstrFrom} onValuesChange={autoSave} />
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
                open={[loadStatuses.loaded, loadStatuses.loading].includes(kbRulesStore.krlStatus)}
                cancelButtonProps={{
                    style: { display: "none" },
                }}
            >
                {kbRulesStore.krlStatus === loadStatuses.loaded ? <Input.TextArea readOnly style={{ minHeight: 350 }} value={kbRulesStore.previewKrl} /> : <Skeleton active />}
            </Modal>
        </div>
    );
};
