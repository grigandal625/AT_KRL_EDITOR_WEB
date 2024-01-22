import { WarningFilled } from "@ant-design/icons";
import { Form, Input, Select, Tooltip, theme } from "antd";
import { useState } from "react";

export default ({ form, showSuffix, ...props }) => {
    const {
        token: { colorWarningText },
    } = theme.useToken();

    const [open, setOpen] = useState();
    return (
        <Form form={form} {...props}>
            <Form.Item label="Имя типа" name="kb_id" rules={[{ required: true, message: "Укажите имя типа" }]}>
                <Input />
            </Form.Item>
            <Form.Item
                label="Базовый тип"
                initialValue={1}
                name="meta"
                rules={[{ required: true, message: "Укажите базовый тип" }]}
            >
                <Select
                    onDropdownVisibleChange={setOpen}
                    suffixIcon={
                        showSuffix ? (
                            <Tooltip open={open} onOpenChange={setOpen} title="При смене базового типа значения удалятся">
                                <WarningFilled style={{ color: colorWarningText }} />
                            </Tooltip>
                        ) : undefined
                    }
                >
                    <Select.Option value={1}>Символьный</Select.Option>
                    <Select.Option value={2}>Числовой</Select.Option>
                    <Select.Option value={3}>Нечеткий</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="Комментарий" name="comment">
                <Input.TextArea />
            </Form.Item>
        </Form>
    );
};
