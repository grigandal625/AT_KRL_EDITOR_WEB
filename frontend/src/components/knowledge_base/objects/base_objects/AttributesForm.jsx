import { useDispatch, useSelector } from "react-redux";
import { selectKbObjects } from "../../../../redux/stores/kbObjectsSlicer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Row, Col, Empty, Form, Input, Select, Typography, Divider, Space, Dropdown } from "antd";
import { getKbTypes, selectKbTypes } from "../../../../redux/stores/kbTypesSlicer";
import { MinusCircleOutlined, PlusOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import { attrUniqueValidator, baseObjectAttributesValidator, kbIdFormatValidator, uniqueKbIdValidator } from "../../../../utils/Validators";
import mobileCheck from "../../../../utils/mobileCheck";
import { loadStatuses } from "../../../../GLOBAL";

const AttrTypeSelect = ({ value, onChange, types, id }) => {
    const items = types.map((t) => Object({ key: parseInt(t.id), label: t.kb_id }));
    const onClick = ({ key }) => {
        onChange({ ...value, type: parseInt(key) });
    };
    const type = value && value.type ? types.find((t) => parseInt(t.id) === parseInt(value.type)) : undefined;
    return (
        <div style={{ whiteSpace: "nowrap", marginLeft: 10 }}>
            {type ? (
                <a style={{ width: "100%" }} href={`/knowledge_bases/${id}/types/${type.id}`} target="_blank">
                    {type.kb_id}
                </a>
            ) : (
                <Typography.Text type="danger" style={{ whiteSpace: "nowrap" }}>
                    (тип не указан)
                </Typography.Text>
            )}

            <Dropdown trigger="click" menu={{ items, selectedKeys: [value && value.type], onClick }}>
                <Button type="link" icon={<EditOutlined />} />
            </Dropdown>
        </div>
    );
};

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
        layout: "horizontal",
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
                                        <Button {...(mobileCheck() ? { size: "small" } : {})} icon={<PlusOutlined />} type="dashed" onClick={() => add()}>
                                            {mobileCheck() ? "" : "Добавить"}
                                        </Button>
                                    </Col>
                                </Row>
                                <Divider style={{ marginTop: 5 }} />
                                <Form.Item>
                                    <table style={{ width: "100%" }}>
                                        <tr>
                                            <th>Имя атрибута</th>
                                            <th>Тип</th>
                                            <th>Комментарий</th>
                                        </tr>
                                        {fields.map((field, index) => (
                                            <tr>
                                                <td style={{ verticalAlign: "top" }}>
                                                    <Form.Item
                                                        {...field}
                                                        rules={[
                                                            { required: true, message: "Укажите имя атрибута" },
                                                            { validator: kbIdFormatValidator },
                                                            {
                                                                validator: attrUniqueValidator(currentForm, index)
                                                            },
                                                        ]}
                                                        name={[index, "kb_id"]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </td>
                                                <td style={{ verticalAlign: "top", textAlign: "center" }}>
                                                    <Form.Item
                                                        name={[index, "type"]}
                                                        {...field}
                                                        rules={[
                                                            {
                                                                validator: (_, value) =>
                                                                    !value || (value && value.type) ? Promise.resolve() : Promise.reject(new Error("Укажите тип атрибута")),
                                                            },
                                                        ]}
                                                    >
                                                        <AttrTypeSelect types={types} id={id} />
                                                    </Form.Item>
                                                </td>
                                                <td style={{ verticalAlign: "top" }}>
                                                    <Form.Item {...field} name={[index, "comment"]}>
                                                        <Input />
                                                    </Form.Item>
                                                </td>
                                                <td style={{ verticalAlign: "top" }}>
                                                    <Button type="link" icon={<MinusCircleOutlined />} onClick={() => remove(index)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
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
