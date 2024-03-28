import { Form } from "antd";
import SimpleFormulaEditor from "../../../../utils/formula_editor/SimpleFormulaEditor";

export default ({ form, onValuesChange, ...props }) => {
    return (
        <Form form={form} onValuesChange={onValuesChange} layout="vertical" {...props}>
            <Form.Item
                name="occurance_condition"
                label="Условие возникновения"
                rules={[
                    { required: true, message: "Укажите условие возникновения" },
                    { validator: (_, value) => (value?.tag ? Promise.resolve() : Promise.reject(new Error("Укажите условие возникновения"))) },
                ]}
            >
                <SimpleFormulaEditor />
            </Form.Item>
        </Form>
    );
};
