import { Button, Divider, Empty, Form, Row, Col, Typography, Space } from "antd";
import NFFormulaEditor from "../../../utils/formula_editor/NFFormulaEditor";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { ReferenceInput } from "../../../utils/formula_editor/SimpleFormulaEditor";
import { NFInput, NFValueInput } from "../../../utils/formula_editor/NFWrapper";
import mobileCheck from "../../../utils/mobileCheck";

export default ({ form, onValuesChange, ...props }) => {
    return (
        <Form form={form} onValuesChange={onValuesChange} layout="vertical" {...props}>
            <Form.Item
                name="condition"
                label="Условие (ЕСЛИ)"
                rules={[
                    {
                        validator: (_, value) => (value?.hasOwnProperty("tag") ? Promise.resolve() : Promise.reject(new Error("Укажите условие правила"))),
                    },
                ]}
            >
                <NFFormulaEditor />
            </Form.Item>
            <Divider />
            <Form.Item label="Действия (ТО)">
                <Form.List name="kr_instructions">
                    {(fields, { add, remove }, { errors }) =>
                        fields.length ? (
                            <Form.Item>
                                <Row wrap={false}>
                                    <Col flex="auto">
                                        <Typography.Title level={5} style={{ marginTop: 2, marginBottom: 10 }}>
                                            Список действий
                                        </Typography.Title>
                                    </Col>
                                    <Col>
                                        <Button {...(mobileCheck() ? { size: "small" } : {})} icon={<PlusOutlined />} type="dashed" onClick={() => add()}>
                                            Добавить
                                        </Button>
                                    </Col>
                                </Row>
                                <div style={{ overflowX: "scroll", overflowY: "hidden", maxWidth: "100%" }}>
                                    {fields.map(({ key, name, ...field }, index) => (
                                        <>
                                            <Space key={key} align="start">
                                                <Button type="link" icon={<MinusCircleOutlined />} onClick={() => remove(index)} />
                                                <Form.Item
                                                    name={[name, "data", "ref"]}
                                                    {...field}
                                                    rules={[
                                                        {
                                                            validator: (_, value) =>
                                                                value?.id && value?.ref?.id
                                                                    ? Promise.resolve()
                                                                    : Promise.reject(new Error("Укажите устанавливаемый атрибут")),
                                                        },
                                                    ]}
                                                >
                                                    <ReferenceInput />
                                                </Form.Item>
                                                <b style={{ fontSize: 18 }}>=</b>
                                                <Form.Item
                                                    name={[name, "data", "value"]}
                                                    {...field}
                                                    rules={[
                                                        {
                                                            validator: (_, value) =>
                                                                value?.hasOwnProperty("tag") ? Promise.resolve() : Promise.reject(new Error("Укажите присваиваемое значение")),
                                                        },
                                                    ]}
                                                >
                                                    <NFFormulaEditor noAllen noScrollOverflow minHeight={40} />
                                                </Form.Item>
                                                <Form.Item name={[name, "data", "non_factor"]} {...field}>
                                                    <NFValueInput />
                                                </Form.Item>
                                            </Space>
                                            <Divider />
                                        </>
                                    ))}
                                </div>
                            </Form.Item>
                        ) : (
                            <Empty description="Действий не добавлено">
                                <Button icon={<PlusOutlined />} type="dashed" onClick={() => add()}>
                                    Добавить
                                </Button>
                            </Empty>
                        )
                    }
                </Form.List>
            </Form.Item>
            <Divider />
            <Form.Item label="Действия (ИНАЧЕ)">
                <Form.List name="kr_else_instructions">
                    {(fields, { add, remove }, { errors }) =>
                        fields.length ? (
                            <Form.Item>
                                <Row wrap={false}>
                                    <Col flex="auto">
                                        <Typography.Title level={5} style={{ marginTop: 2, marginBottom: 10 }}>
                                            Список действий
                                        </Typography.Title>
                                    </Col>
                                    <Col>
                                        <Button {...(mobileCheck() ? { size: "small" } : {})} icon={<PlusOutlined />} type="dashed" onClick={() => add()}>
                                            Добавить
                                        </Button>
                                    </Col>
                                </Row>
                                <div style={{ overflowX: "scroll", overflowY: "hidden", maxWidth: "100%" }}>
                                    {fields.map(({ key, name, ...field }, index) => (
                                        <>
                                            <Form.Item hidden name={[name, "data", "tag"]} initialValue={"assign"} />
                                            <Space key={key} align="start">
                                                <Button type="link" icon={<MinusCircleOutlined />} onClick={() => remove(index)} />
                                                <Form.Item
                                                    name={[name, "data", "ref"]}
                                                    rules={[
                                                        {
                                                            validator: (_, value) =>
                                                                value?.id && value?.ref?.id
                                                                    ? Promise.resolve()
                                                                    : Promise.reject(new Error("Укажите устанавливаемый атрибут")),
                                                        },
                                                    ]}
                                                    {...field}
                                                >
                                                    <ReferenceInput />
                                                </Form.Item>
                                                <b style={{ fontSize: 18 }}>=</b>
                                                <Form.Item
                                                    name={[name, "data", "value"]}
                                                    rules={[
                                                        {
                                                            validator: (_, value) =>
                                                                value?.hasOwnProperty("tag") ? Promise.resolve() : Promise.reject(new Error("Укажите присваиваемое значение")),
                                                        },
                                                    ]}
                                                    {...field}
                                                >
                                                    <NFFormulaEditor noAllen noScrollOverflow minHeight={40} />
                                                </Form.Item>
                                                <Form.Item name={[name, "data", "non_factor"]} {...field}>
                                                    <NFValueInput />
                                                </Form.Item>
                                            </Space>
                                            <Divider />
                                        </>
                                    ))}
                                </div>
                            </Form.Item>
                        ) : (
                            <Empty description="Действий не добавлено">
                                <Button icon={<PlusOutlined />} type="dashed" onClick={() => add()}>
                                    Добавить
                                </Button>
                            </Empty>
                        )
                    }
                </Form.List>
            </Form.Item>
        </Form>
    );
};
