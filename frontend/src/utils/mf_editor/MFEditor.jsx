import { MinusCircleOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Form, Input, InputNumber, Row, Space, Typography, Divider, Empty } from "antd";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

export const MFGraphEditor = ({ value, onChange, hideApply, form }) => {
    const [f] = Form.useForm();
    let graphForm = form || f;

    useEffect(() => {
        graphForm.setFieldsValue(value);
    }, [value]);

    const [graph, setGraph] = useState(value);

    const updateGraph = () => {
        const data = graphForm.getFieldsValue();
        setGraph(data);
    };

    const save = async () => {
        try {
            const data = await graphForm.validateFields();
            onChange(data);
        } catch (e) {
            console.error(e);
        }
    };

    const graphData = {
        x:
            [...(graph?.points || [])]
                ?.map((p) => ({ x: graph?.min || 0, y: 0, ...p }))
                .sort((p1, p2) => p1.x - p2?.x)
                .map((p) => p.x) || [],
        y:
            [...(graph?.points || [])]
                ?.map((p) => ({ x: graph?.min || 0, y: 0, ...p }))
                .sort((p1, p2) => p1.x - p2?.x)
                .map((p) => p.y) || [],
        type: "scatter",
        mode: "lines+markers",
        marker: { color: "red" },
    };

    const minMaxData = {
        x: [graph?.min || 0, graph?.max || 0],
        y: [0, 1],
        type: "scatter",
        mode: "lines+markers",
        marker: { color: "transparent" },
    };

    const minMaxValidator = () => {
        const min = graphForm.getFieldValue("min");
        const max = graphForm.getFieldValue("max");
        if (min !== undefined && max !== undefined && min > max) {
            return Promise.reject(new Error("Некорректные значения"));
        }
        return Promise.resolve();
    };

    const mfCountValidator = () => {
        const points = graphForm.getFieldValue("points");
        if (points !== undefined && points.length < 2) {
            return Promise.reject(new Error("Укажите минимум 2 точки"));
        }
        return Promise.resolve();
    };

    const xMinMaxValudator = (_, x) => {
        const min = graphForm.getFieldValue("min");
        const max = graphForm.getFieldValue("max");
        if (max !== undefined && x > max) {
            return Promise.reject(new Error("x больше максимума"));
        }
        if (min !== undefined && x < min) {
            return Promise.reject(new Error("x меньше минимума"));
        }
        return Promise.resolve();
    };

    return (
        <Row gutter={[50, 10]}>
            <Col xxl={18} xl={12} lg={24} md={24} sm={24} xs={24}>
                <Plot style={{ width: "100%", height: 450 }} useResizeHandler={true} data={[graphData, minMaxData]} layout={{ title: "График функции принадлежности" }} />
            </Col>
            <Col flex="auto">
                <Row>
                    <Col flex="auto">
                        <Typography.Title level={5} style={{ marginTop: 2, marginBottom: 5 }}>
                            Данные функции принадлежности
                        </Typography.Title>
                    </Col>
                    <Col>
                        {hideApply ? (
                            <></>
                        ) : (
                            <Button type="primary" onClick={save}>
                                Применить
                            </Button>
                        )}
                    </Col>
                </Row>
                <Form layout="vertical" form={graphForm} onFieldsChange={updateGraph}>
                    <Form.Item label="Имя функции принадлежности" rules={[{ required: true, message: "Укажите имя функции принадлежности" }]} name="name">
                        <Input />
                    </Form.Item>
                    <Row gutter={[10, 10]}>
                        <Col flex={12}>
                            <Form.Item label="Минимальное значение" name="min" rules={[{ required: true, message: "Укажите значение" }, { validator: minMaxValidator }]}>
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col flex={12}>
                            <Form.Item label="Максимальное значение" name="max" rules={[{ required: true, message: "Укажите значение" }, { validator: minMaxValidator }]}>
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Form.Item name="_check" rules={[{ validator: mfCountValidator }]} label="Точки">
                        <Form.List name="points">
                            {(fields, { add, remove }, { errors }) =>
                                !fields.length ? (
                                    <Empty description="Точек не добавлено">
                                        <Button onClick={() => add({ x: graph?.min || 0, y: 0 })} type="dashed" icon={<PlusOutlined />}>
                                            Добавить
                                        </Button>
                                    </Empty>
                                ) : (
                                    <>
                                        <Row align="middle">
                                            <Col flex="auto">
                                                <Typography.Title className="kb-title" level={5}>
                                                    Список точек
                                                </Typography.Title>
                                            </Col>
                                            <Col>
                                                <Button icon={<PlusOutlined />} type="dashed" onClick={() => add()}>
                                                    Добавить
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Divider style={{ marginTop: 5 }} />
                                        {fields.map(({ key, name, ...field }, index) => (
                                            <div>
                                                <Space key={key} align="start">
                                                    <Button type="link" icon={<MinusCircleOutlined />} onClick={() => remove(index)} />
                                                    <span style={{ fontSize: 18 }}>x:</span>
                                                    <Form.Item
                                                        initialValue={graphForm.getFieldValue("min")}
                                                        name={[name, "x"]}
                                                        rules={[{ required: true, message: "Укажите x" }, { validator: xMinMaxValudator }]}
                                                    >
                                                        <InputNumber min={graph?.min || undefined} max={graph?.max || undefined} size="small" placeholder="x" />
                                                    </Form.Item>
                                                    <span style={{ fontSize: 18 }}>y:</span>
                                                    <Form.Item initialValue={0} name={[name, "y"]} rules={[{ required: true, message: "Укажите у" }]}>
                                                        <InputNumber size="small" min={0} max={1} step={0.01} placeholder="y" />
                                                    </Form.Item>
                                                </Space>
                                            </div>
                                        ))}
                                    </>
                                )
                            }
                        </Form.List>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default ({ value, onChange, variableName }) => {
    const [open, setOpen] = useState();
    const show = () => setOpen(true);
    const hide = () => setOpen(false);

    const [form] = Form.useForm();

    const save = async () => {
        try {
            const data = await form.validateFields();
            onChange(data);
            hide();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <Space onClick={show}>
                {value?.name ? <Typography.Link>{value.name}</Typography.Link> : <Typography.Text type="secondary">(укажите функцию принадлежности)</Typography.Text>}
                <Button type="link" icon={<SettingOutlined />} />
            </Space>
            <Drawer
                placement="bottom"
                height="100%"
                closable={false}
                open={open}
                title={
                    <>
                        Редактирование функции принадлежности для лингвистической переменной <b>{variableName}</b>
                    </>
                }
                extra={
                    <Space>
                        <Button type="primary" onClick={save}>
                            Применить
                        </Button>
                        <Button onClick={hide}>Отмена</Button>
                    </Space>
                }
            >
                <MFGraphEditor value={value} onChange={save} hideApply form={form} />
            </Drawer>
        </>
    );
};
