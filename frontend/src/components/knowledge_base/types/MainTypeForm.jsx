import { WarningFilled } from "@ant-design/icons";
import { Form, Input, Select, Tooltip, theme } from "antd";
import { useState } from "react";
import { kbIdFormatValidator, uniqueKbIdValidator } from "../../../utils/Validators";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default ({ form, showSuffix, forCreate, ...props }) => {
    const {
        token: { colorWarningText },
    } = theme.useToken();
    const kbTypesStore = useSelector((state) => state.kbTypes);
    const { typeId } = useParams();

    const [open, setOpen] = useState();
    const typeNames = kbTypesStore.items.filter((t) => (forCreate ? true : t.id !== parseInt(typeId))).map((t) => t.kb_id)
    return (
        <Form form={form} {...props}>
            <Form.Item
                label="Имя типа"
                name="kb_id"
                rules={[
                    { required: true, message: "Укажите имя типа" },
                    { validator: kbIdFormatValidator },
                    { validator: uniqueKbIdValidator(typeNames) },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="Базовый тип" initialValue={1} name="meta" rules={[{ required: true, message: "Укажите базовый тип" }]}>
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
