import { MinusCircleOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Form, Input, InputNumber, Row, Space, Typography, Divider, Empty } from "antd";
import { useState } from "react";
import Plot from "react-plotly.js";

export const MFGraphEditor = ({ value, onChange }) => {
    const [form] = Form.useForm();
    const [graph, setGraph] = useState(value);

    const updateGraph = async () => {
        try {
            const data = form.getFieldsValue();
            setGraph(data);
        } catch (e) {
            console.error(e);
        }
    };

    const graphData = {
        x:
            [...(graph?.points || [])]
                ?.sort(
                    (p1, p2) => (p1?.x || form.getFieldValue("min") || 0) - (p2?.x || form.getFieldValue("min") || 0)
                )
                .map((p) => p?.x || form.getFieldValue("min") || 0) || [],
        y:
            [...(graph?.points || [])]
                ?.sort(
                    (p1, p2) => (p1?.x || form.getFieldValue("min") || 0) - (p2?.x || form.getFieldValue("min") || 0)
                )
                .map((p) => p?.y || 0) || [],
        type: "scatter",
        mode: "lines+markers",
        marker: { color: "red" },
    };

    const minMaxData = {
        x: [form.getFieldValue("min") || 0, form.getFieldValue("max") || 0],
        y: [0, 1],
        type: "scatter",
        mode: "lines+markers",
        marker: { color: "transparent" },
    };

    return (
        <Row gutter={[50, 10]}>
            <Col xxl={18} xl={12} lg={24} md={24} sm={24} xs={24}>
                <Plot
                    style={{ width: "100%", height: "100%" }}
                    useResizeHandler={true}
                    data={[graphData, minMaxData]}
                />
            </Col>
            <Col flex="auto">
                <Form layout="vertical" form={form} onFieldsChange={updateGraph}>
                    <Form.Item
                        label="Имя функции принадлежности"
                        rules={[{ required: true, message: "Укажите имя функции принадлежности" }]}
                        name="name"
                    >
                        <Input />
                    </Form.Item>
                    <Row>
                        <Col flex={12}>
                            <Form.Item label="Минимальное значение" name="min" rules={[{ required: true, message: "Укажите значение" }]}>
                                <InputNumber />
                            </Form.Item>
                        </Col>
                        <Col flex={12}>
                            <Form.Item label="Максимальное значение" name="max" rules={[{ required: true, message: "Укажите значение" }]}>
                                <InputNumber />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Form.Item label="Точки">
                        <Form.List name="points">
                            {(fields, { add, remove }, { errors }) =>
                                !fields.length ? (
                                    <Empty description="Точек не добавлено">
                                        <Button
                                            onClick={() => add({ x: form.getFieldValue("min") || 0, y: 0 })}
                                            type="dashed"
                                            icon={<PlusOutlined />}
                                        >
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
                                                    <Button
                                                        type="link"
                                                        icon={<MinusCircleOutlined />}
                                                        onClick={() => remove(index)}
                                                    />
                                                    <span style={{ fontSize: 18 }}>x:</span>
                                                    <Form.Item
                                                        initialValue={form.getFieldValue("min")}
                                                        name={[name, "x"]}
                                                        min={form.getFieldValue("min") || undefined}
                                                        max={form.getFieldValue("max") || undefined}
                                                        rules={[{ required: true, message: "Укажите x" }]}
                                                    >
                                                        <InputNumber size="small" placeholder="x" />
                                                    </Form.Item>
                                                    <span style={{ fontSize: 18 }}>y:</span>
                                                    <Form.Item
                                                        initialValue={0}
                                                        name={[name, "y"]}
                                                        rules={[{ required: true, message: "Укажите у" }]}
                                                    >
                                                        <InputNumber
                                                            size="small"
                                                            min={0}
                                                            max={1}
                                                            step={0.01}
                                                            placeholder="y"
                                                        />
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

    const save = (v) => {
        onChange(v);
        hide();
    };

    return (
        <>
            <Space onClick={show}>
                {value?.name ? (
                    <Typography.Link>{value.name}</Typography.Link>
                ) : (
                    <Typography.Text type="secondary">(укажите функцию принадлежности)</Typography.Text>
                )}
                <Button type="link" icon={<SettingOutlined />} />
            </Space>
            <Drawer
                placement="bottom"
                height="100%"
                open={open}
                title={
                    <>
                        Редактирование функции принадлежности для лингвистической переменной <b>{variableName}</b>
                    </>
                }
                extra={<Button onClick={hide}>Отмена</Button>}
            >
                <MFGraphEditor value={value} onChange={save} />
            </Drawer>
        </>
    );
};
