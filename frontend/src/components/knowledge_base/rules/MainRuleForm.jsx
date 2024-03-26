import { useSelector } from "react-redux";
import { selectkbRules } from "../../../redux/stores/kbRulesSlicer";
import { useParams } from "react-router-dom";
import { Form, Input } from "antd";
import { kbIdFormatValidator, uniqueKbIdValidator } from "../../../utils/Validators";

export default ({ form, onValuesChange, forCreate, ...props }) => {
    const kbRulesStore = useSelector(selectkbRules);
    const { ruleId } = useParams();
    const ruleNames = kbRulesStore.items.filter((e) => (forCreate ? true : e.id !== parseInt(ruleId))).map((e) => e.kb_id);

    return (
        <Form form={form} onValuesChange={onValuesChange} {...props}>
            <Form.Item
                name="kb_id"
                label="Имя правила"
                rules={[{ required: true, message: "Укажите имя правила" }, { validator: kbIdFormatValidator }, { validator: uniqueKbIdValidator(ruleNames) }]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="comment" label="Комментарий">
                <Input.TextArea />
            </Form.Item>
        </Form>
    );
};
