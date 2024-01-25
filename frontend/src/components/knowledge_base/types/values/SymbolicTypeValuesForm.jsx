import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Form, Row, Col, Typography, theme, Input, Empty, Divider } from "antd";
import { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export default ({ useDefaultProps, ...props }) => {
    const kbTypesStore = useSelector((state) => state.kbTypes);
    const { id, typeId } = useParams();

    const {
        token: { colorWarningText },
    } = theme.useToken();

    const type = kbTypesStore.types.find((t) => parseInt(t.id) === parseInt(typeId));

    const [form] = Form.useForm();
    const [disabled, setDisabled] = useState(false);
    useEffect(() => {
        form.setFieldsValue(type);
    }, [type]);

    const defaultProps = {
        form,
        disabled,
    };
    const formProps = useDefaultProps ? defaultProps : props;
    return (
        <Form {...formProps}>
            <Form.List
                rules={[
                    {
                        validator: (_, value) =>
                            value.length >= 2
                                ? Promise.resolve()
                                : Promise.reject(new Error("Укажите как минимум 2 значения")),
                    },
                ]}
                name="kt_values"
            >
                {(fields, { add, remove }, { errors }) =>
                    !fields.length ? (
                        <Empty description="Значений не добавлено">
                            <Button icon={<PlusOutlined />} type="dashed" onClick={() => add()}>
                                Добавить
                            </Button>
                        </Empty>
                    ) : (
                        <>
                            <Row align="middle">
                                <Col flex="auto">
                                    <Typography.Title className="kb-title" level={5}>
                                        Символьные значения
                                    </Typography.Title>
                                </Col>
                                <Col>
                                    <Button icon={<PlusOutlined />} type="dashed" onClick={() => add()}>
                                        Добавить
                                    </Button>
                                </Col>
                            </Row>
                            <Divider style={{ marginTop: 5 }} />
                            <Form.Item>
                                {fields.map((field, i) => (
                                    <Row>
                                        <Col flex="auto">
                                            <Form.Item {...field} name={[i, "data"]}>
                                                <Input placeholder="Введите символьное значение" />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Button
                                                type="link"
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => remove(i)}
                                            />
                                        </Col>
                                    </Row>
                                ))}
                            </Form.Item>
                        </>
                    )
                }
            </Form.List>
        </Form>
    );
};
