import { Form, Input } from "antd";

export default ({ form, ...props }) => (
    <Form form={form} layout="vertical" {...props}>
        <Form.Item rules={[{ required: true, message: "Введите имя файла БЗ" }]} name="name" label="Имя файла БЗ">
            <Input addonAfter=".kbs" />
        </Form.Item>
        <Form.Item name="problem_area" label="Проблемная область">
            <Input />
        </Form.Item>
        <Form.Item name="description" label="Описание задач">
            <Input.TextArea style={{ minHeight: 100 }} />
        </Form.Item>
    </Form>
);
