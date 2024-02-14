import { Form, Row, Col } from "antd";
import SimpleFormulaEditor from "../../../../utils/formula_editor/SimpleFormulaEditor";

export default ({ form, ...props }) => {
    return (
        <Form form={form} {...props}>
            <Row>
                <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                    <Form.Item name="open" label="Условие начала">
                        <SimpleFormulaEditor />
                    </Form.Item>
                </Col>
                <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                    <Form.Item name="close" label="Условие окончания">
                        <SimpleFormulaEditor />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};
