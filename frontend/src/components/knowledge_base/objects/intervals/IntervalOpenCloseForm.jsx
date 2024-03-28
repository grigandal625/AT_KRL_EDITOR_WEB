import { Form } from "antd";
import SimpleFormulaEditor from "../../../../utils/formula_editor/SimpleFormulaEditor";

export default ({ form, onValuesChange, ...props }) => {
    return (
        <Form onValuesChange={onValuesChange} form={form} {...props}>
            <Form.Item
                name="open"
                label="Условие начала"
                rules={[
                    { required: true, message: "Укажите условие начала" },
                    { validator: (_, value) => (value?.tag ? Promise.resolve() : Promise.reject(new Error("Укажите условие начала"))) },
                ]}
            >
                <SimpleFormulaEditor />
            </Form.Item>
            <Form.Item
                name="close"
                label="Условие окончания"
                rules={[
                    { required: true, message: "Укажите условие окончания" },
                    { validator: (_, value) => (value?.tag ? Promise.resolve() : Promise.reject(new Error("Укажите условие окончания"))) },
                ]}
            >
                <SimpleFormulaEditor />
            </Form.Item>
        </Form>
    );
};
