import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { numericTypeValuesValidator } from "../../../../utils/Validators";
import { selectKbTypes } from "../../../../redux/stores/kbTypesSlicer";

export default ({ onValuesChange, ...props }) => {
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
    const formProps = { ...defaultProps, ...props };
    const currentForm = formProps.form || form;
    const validator = numericTypeValuesValidator(currentForm);
    return (
        <Form onValuesChange={onValuesChange} {...formProps}>
            <Form.Item name="_check" rules={[{ validator }]}>
                <Form.List name="kt_values">
                    {() => [
                        <Form.Item
                            name={[0, "data"]}
                            label="От"
                            rules={[{ required: true, message: "Укажите минимальное значение" }]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>,
                        <Form.Item
                            name={[1, "data"]}
                            label="До"
                            rules={[{ required: true, message: "Укажите максимальное значение" }]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>,
                    ]}
                </Form.List>
            </Form.Item>
        </Form>
    );
};
