import { useDispatch, useSelector } from "react-redux";
import { selectKbObjects } from "../../../../redux/stores/kbObjectsSlicer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Row, Col, Empty, Form, Input, Select, Typography, Divider } from "antd";
import { getKbTypes, selectKbTypes } from "../../../../redux/stores/kbTypesSlicer";
import { MinusCircleFilled, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { baseObjectAttributesValidator, kbIdFormatValidator, uniqueKbIdValidator } from "../../../../utils/Validators";
import mobileCheck from "../../../../utils/mobileCheck";
import { loadStatuses } from "../../../../GLOBAL";

export default ({ ...props }) => {
    const kbObjectsStore = useSelector(selectKbObjects);
    const kbTypesStore = useSelector(selectKbTypes);
    const { objectId, id } = useParams();
    const dispatch = useDispatch();

    const object = kbObjectsStore.items.find((o) => parseInt(o.id) === parseInt(objectId));
    const types = kbTypesStore.items;
    const [form] = Form.useForm();
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        form.setFieldsValue(object);
    }, [object]);

    useEffect(() => {
        if (kbObjectsStore.status !== loadStatuses.loaded || parseInt(kbTypesStore.kbId) !== parseInt(id)) {
            dispatch(getKbTypes(id));
        }
    }, [id]);

    const defaultProps = {
        form,
        disabled,
        layout: "vertical",
    };
    const formProps = { ...defaultProps, ...props };
    const currentForm = formProps.form || form;
    const validator = baseObjectAttributesValidator(currentForm);
    return (
        <Form {...formProps}>
            <Form.Item name="_check" rules={[{ validator }]}>
                <Form.List name="ko_attributes">
                    {(fields, { add, remove }, { errors }) =>
                        fields.length ? (
                            <>
                                <Row align="middle">
                                    <Col flex="auto">
                                        <Typography.Title className="kb-title" level={5}>
                                            Список атрибутов
                                        </Typography.Title>
                                    </Col>
                                    <Col>
                                        <Button
                                            {...(mobileCheck() ? { size: "small" } : {})}
                                            icon={<PlusOutlined />}
                                            type="dashed"
                                            onClick={() => add()}
                                        >
                                            {mobileCheck() ? "" : "Добавить"}
                                        </Button>
                                    </Col>
                                </Row>
                                <Divider style={{ marginTop: 5 }} />
                                <Form.Item>
                                    {fields.map((field, index) => (
                                        <Row align="middle" gutter={[5, 5]} wrap={false}>
                                            <Col span={7}>
                                                <Form.Item
                                                    {...field}
                                                    rules={[
                                                        { required: true, message: "Укажите имя атрибута" },
                                                        { validator: kbIdFormatValidator },
                                                        {
                                                            validator: uniqueKbIdValidator(
                                                                currentForm
                                                                    .getFieldValue("ko_attributes")
                                                                    .map((item) => item && item.kb_id)
                                                            ),
                                                        },
                                                    ]}
                                                    label="Имя"
                                                    name={[index, "kb_id"]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={7}>
                                                <Form.Item
                                                    {...field}
                                                    label="Тип"
                                                    rules={[{ required: true, message: "Укажите тип" }]}
                                                    name={[index, "type"]}
                                                >
                                                    <Select
                                                        style={{ width: "100%" }}
                                                        options={types.map((t) =>
                                                            Object({ value: t.id, label: t.kb_id })
                                                        )}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={9}>
                                                <Form.Item {...field} label="Комментарий" name={[index, "comment"]}>
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={1}>
                                                <Button
                                                    type="link"
                                                    icon={<MinusCircleOutlined />}
                                                    onClick={() => remove(index)}
                                                />
                                            </Col>
                                        </Row>
                                    ))}
                                </Form.Item>
                            </>
                        ) : (
                            <Empty description="Аттрибутов не добавлено">
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
