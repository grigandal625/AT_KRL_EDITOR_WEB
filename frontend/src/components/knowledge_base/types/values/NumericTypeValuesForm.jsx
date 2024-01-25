import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Form, Row, Col, Typography, theme, Input, Empty, Divider, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import mobileCheck from "../../../../utils/mobileCheck";

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
            <Form.Item name="from" label="От" rules={[{ required: true, message: "Укажите минимальное значение" }]}>
                <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="to" label="До" rules={[{ required: true, message: "Укажите максимальное значение" }]}>
                <InputNumber style={{ width: "100%" }} />
            </Form.Item>
        </Form>
    );
};
