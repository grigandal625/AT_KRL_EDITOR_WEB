import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    Button,
    Form,
    Skeleton,
    Row,
    Col,
    Typography,
    Dropdown,
    Card,
    Tooltip,
    Space,
    theme,
    message,
    Modal,
    Input,
} from "antd";
import { loadStatuses } from "../../../GLOBAL";
import MainTypeForm from "./MainTypeForm";
import { useEffect, useState } from "react";
import mobileCheck from "../../../utils/mobileCheck";
import { DeleteOutlined, FileAddOutlined, FolderViewOutlined, SettingOutlined, WarningFilled } from "@ant-design/icons";
import SymbolicTypeValuesForm from "./values/SymbolicTypeValuesForm";
import NumericTypeValuesForm from "./values/NumericTypeValuesForm";
import {
    deleteType,
    duplicateType,
    loadTypeKrl,
    resetKrl,
    selectKbTypes,
    setTypeValues,
    updateType,
} from "../../../redux/stores/kbTypesSlicer";

export default () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const kbTypesStore = useSelector(selectKbTypes);
    const { id, typeId } = useParams();
    const [form] = Form.useForm();
    const [valuesForm] = Form.useForm();
    const [disabled, setDisabled] = useState(false);
    const saveStatus = kbTypesStore.saveStatus;
    const saved = saveStatus == loadStatuses.loaded;
    const saving = !saved;
    const {
        token: { borderRadius, colorWarningText },
    } = theme.useToken();

    const type = kbTypesStore.items.find((t) => parseInt(t.id) === parseInt(typeId));
    useEffect(() => {
        form.setFieldsValue(type);
        valuesForm.setFieldsValue(type);
    }, [type]);

    useEffect(() => {
        setDisabled(saving);
    }, [saving]);
    useEffect(() => {
        try {
            valuesForm.validateFields();
        } catch (e) {}
    });

    const update = async () => {
        try {
            const data = await form.validateFields();
            dispatch(updateType({ id, typeId, data }));
        } catch (e) {}
    };

    const setValues = async () => {
        try {
            const data = await valuesForm.validateFields();
            dispatch(setTypeValues({ id, typeId, values: data.kt_values }));
        } catch (e) {}
    };

    const performDelete = () => {
        Modal.confirm({
            title: "Удаление типа",
            content: (
                <>
                    Удалить тип <b>{type.kb_id}</b> ?
                </>
            ),
            style: { borderRadius },
            onOk: () => {
                dispatch(deleteType({ id, typeId, navigate }));
            },
            okText: "Удалить",
            cancelText: "Отмена",
            okButtonProps: { style: { borderRadius } },
            cancelButtonProps: { style: { borderRadius } },
        });
    };

    const duplicate = () => dispatch(duplicateType({ id, typeId, navigate }));

    const preview = () => dispatch(loadTypeKrl({ id, typeId }));

    const actions = {
        delete: performDelete,
        duplicate,
        preview,
    };

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
                <Row wrap={false}>
                    <Col flex="auto">
                        <Typography.Title className="kb-title kbitem-title" level={4}>
                            Тип «{type.kb_id}»
                        </Typography.Title>
                    </Col>
                    <Col>
                        <Dropdown menu={{ items, onClick: ({ key }) => actions[key]() }} trigger={["click"]}>
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
            {kbTypesStore.status === loadStatuses.loaded && type ? (
                <Row style={{ minHeight: "calc(100vh - 395px)" }} gutter={[5, 5]}>
                    <Col xxl={6} xl={10} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            style={{ minHeight: "100%", minWidth: "100%" }}
                            title={
                                <Row wrap={false} align="middle" justify="space-between">
                                    <Col>Основные данные</Col>
                                    <Col>
                                        <Button
                                            onClick={update}
                                            loading={saving}
                                            {...(mobileCheck() ? { size: "small" } : {})}
                                            type="primary"
                                        >
                                            Сохранить
                                        </Button>
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
                    <Col xxl={18} xl={14} lg={24} md={24} sm={24} xs={24}>
                        <Tooltip
                            open={!saving && disabled}
                            title={
                                <Space>
                                    <WarningFilled style={{ color: colorWarningText }} />
                                    <span>
                                        Изменен базовый тип. При сохранении основных данных все значения будут удалены
                                    </span>
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
                                                loading={saving}
                                                onClick={setValues}
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
                open={[loadStatuses.loaded, loadStatuses.loading].includes(kbTypesStore.krlStatus)}
                cancelButtonProps={{
                    style: { display: "none" },
                }}
            >
                {kbTypesStore.krlStatus === loadStatuses.loaded ? (
                    <Input.TextArea readOnly style={{ minHeight: 350 }} value={kbTypesStore.previewKrl} />
                ) : (
                    <Skeleton active />
                )}
            </Modal>
        </div>
    );
};
