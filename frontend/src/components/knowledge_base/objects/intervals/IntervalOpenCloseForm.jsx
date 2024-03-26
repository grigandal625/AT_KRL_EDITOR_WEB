import { Form } from "antd";
import SimpleFormulaEditor from "../../../../utils/formula_editor/SimpleFormulaEditor";

export default ({ form, onValuesChange, ...props }) => {
    return (
        <Form onValuesChange={onValuesChange} form={form} {...props}>
            <Form.Item name="open" label="Условие начала">
                <SimpleFormulaEditor />
            </Form.Item>
            <Form.Item name="close" label="Условие окончания">
                <SimpleFormulaEditor />
            </Form.Item>
        </Form>
    );
};
