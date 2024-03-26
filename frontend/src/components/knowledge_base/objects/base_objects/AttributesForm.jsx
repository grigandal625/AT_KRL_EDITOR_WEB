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
        onChange(parseInt(key));
    };
    const type = value ? types.find((t) => parseInt(t.id) === parseInt(value)) : undefined;
    return (
        <div style={{ whiteSpace: "nowrap", marginLeft: 10 }}>
            {mobileCheck() ? (
                <Dropdown trigger="click" menu={{ items, selectedKeys: [value], onClick }}>
                    <Button type="link" icon={<EditOutlined />} />
                </Dropdown>
            ) : (
                <></>
            )}
            {type ? (
                <a style={{ width: "100%" }} href={`/knowledge_bases/${id}/types/${type.id}`} target="_blank">
                    {type.kb_id}
                </a>
            ) : (
                <Typography.Text type="danger" style={{ whiteSpace: "nowrap" }}>
                    (тип не указан)
                </Typography.Text>
            )}
            {!mobileCheck() ? (
                <Dropdown trigger="click" menu={{ items, selectedKeys: [value], onClick }}>
                    <Button type="link" icon={<EditOutlined />} />
                </Dropdown>
            ) : (
                <></>
            )}
        </div>
    );
};

export default ({ onValuesChange, ...props }) => {
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
        <Form onValuesChange={onValuesChange} {...formProps}>
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
                                    <div style={{ overflowX: "scroll" }}>
                                        <table style={{ width: "100%", minWidth: 450 }}>
                                            <tr>
                                                {mobileCheck() ? <th></th> : <></>}
                                                <th>Имя атрибута</th>
                                                <th>Тип</th>
                                                <th>Комментарий</th>
                                            </tr>
                                            {fields.map((field, index) => (
                                                <tr>
                                                    {mobileCheck() ? (
                                                        <td style={{ verticalAlign: "top" }}>
                                                            <Button type="link" icon={<MinusCircleOutlined />} onClick={() => remove(index)} />
                                                        </td>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    <td style={{ verticalAlign: "top" }}>
                                                        <Form.Item
                                                            {...field}
                                                            rules={[
                                                                { required: true, message: "Укажите имя атрибута" },
                                                                {
                                                                    validator: attrUniqueValidator(currentForm, index),
                                                                },
                                                                { validator: kbIdFormatValidator },
                                                            ]}
                                                            name={[index, "kb_id"]}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </td>
                                                    <td style={{ verticalAlign: "top", textAlign: "center" }}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[index, "type"]}
                                                            rules={[
                                                                {
                                                                    validator: (_, value) => {
                                                                        return !value || value === "" || !types.map((t) => parseInt(t.id)).includes(parseInt(value))
                                                                            ? Promise.reject(new Error("Укажите тип атрибута"))
                                                                            : Promise.resolve();
                                                                    },
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
                                                    {!mobileCheck() ? (
                                                        <td style={{ verticalAlign: "top" }}>
                                                            <Button type="link" icon={<MinusCircleOutlined />} onClick={() => remove(index)} />
                                                        </td>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </tr>
                                            ))}
                                        </table>
                                    </div>
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
