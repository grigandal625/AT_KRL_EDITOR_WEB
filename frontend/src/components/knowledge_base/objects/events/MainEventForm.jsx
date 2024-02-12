import { useSelector } from "react-redux";
import { selectkbEvents } from "../../../../redux/stores/kbEventsSlicer";
import { useParams } from "react-router-dom";
import { Form, Input } from "antd";
import SimpleFormulaEditor from "../../../../utils/formula_editor/SimpleFormulaEditor";
import { kbIdFormatValidator, uniqueKbIdValidator } from "../../../../utils/Validators";

export default ({ form, forCreate, forcedKbId, ...props }) => {
    const kbEventsStore = useSelector(selectkbEvents);
    const { eventId } = useParams();
    const eventNames = kbEventsStore.items.filter((e) => (forCreate ? true : e.id !== parseInt(eventId))).map((e) => e.kb_id);

    return (
        <Form form={form} {...props}>
            <Form.Item
                name="kb_id"
                label="Имя события"
                rules={[{ required: true, message: "Укажите имя события" }, { validator: kbIdFormatValidator }, { validator: uniqueKbIdValidator(eventNames) }]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="Formula" label="Условие возникновения">
                <SimpleFormulaEditor forcedKbId={forcedKbId} />
            </Form.Item>
        </Form>
    );
};
