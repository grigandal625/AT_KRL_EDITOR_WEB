import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Form, Row, Col, Typography, Input, Empty, Divider } from "antd";
import { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import mobileCheck from "../../../../utils/mobileCheck";
import { symbolicTypeValuesValidator } from "../../../../utils/Validators";
import { selectKbTypes } from "../../../../redux/stores/kbTypesSlicer";

export default ({ ...props }) => {
    const kbTypesStore = useSelector(selectKbTypes);
    const { id, typeId } = useParams();

    const type = kbTypesStore.items.find((t) => parseInt(t.id) === parseInt(typeId));

    const [form] = Form.useForm();
    const [disabled, setDisabled] = useState(false);
    useEffect(() => {
        form.setFieldsValue(type);
    }, [type]);

    const defaultProps = {
        form,
        disabled,
    };
    const formProps = {...defaultProps, ...props};
    const currentForm = formProps.form || form;
    const validator = symbolicTypeValuesValidator(currentForm)
    return (
        <Form {...formProps}>
            <Form.Item name="_check" rules={[{ validator }]}>
                <Form.List name="kt_values">
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
                                        <Button {...(mobileCheck() ? { size: "small" } : {})} icon={<PlusOutlined />} type="dashed" onClick={() => add()}>
                                            {mobileCheck() ? "" : "Добавить"}
                                        </Button>
                                    </Col>
                                </Row>
                                <Divider style={{ marginTop: 5 }} />
                                <Form.Item>
                                    {fields.map((field, i) => (
                                        <Row wrap={false}>
                                            <Col flex="auto">
                                                <Form.Item {...field} rules={[{ required: true, message: "Введите значение" }]} name={[i, "data"]}>
                                                    <Input placeholder="Введите символьное значение" />
                                                </Form.Item>
                                            </Col>
                                            <Col>
                                                <Button type="link" icon={<MinusCircleOutlined />} onClick={() => remove(i)} />
                                            </Col>
                                        </Row>
                                    ))}
                                </Form.Item>
                            </>
                        )
                    }
                </Form.List>
            </Form.Item>
        </Form>
    );
};
