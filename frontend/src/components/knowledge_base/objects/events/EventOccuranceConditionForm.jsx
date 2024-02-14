import { Form } from "antd";
import SimpleFormulaEditor from "../../../../utils/formula_editor/SimpleFormulaEditor";

export default ({ form, ...props }) => {
    return (
        <Form form={form} layout="vertical" {...props}>
            <Form.Item name="occurance_condition" label="Условие возникновения">
                <SimpleFormulaEditor />
            </Form.Item>
        </Form>
    );
};
