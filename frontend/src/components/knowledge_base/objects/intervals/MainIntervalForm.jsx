import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form, Input } from "antd";
import { kbIdFormatValidator, uniqueKbIdValidator } from "../../../../utils/Validators";
import { selectkbIntervals } from "../../../../redux/stores/kbItervalsSlicer";

export default ({ form, onValuesChange, forCreate, ...props }) => {
    const kbIntervalsStore = useSelector(selectkbIntervals);
    const { intervalId } = useParams();
    const intervalNames = kbIntervalsStore.items.filter((i) => (forCreate ? true : i.id !== parseInt(intervalId))).map((i) => i.kb_id);

    return (
        <Form form={form} onValuesChange={onValuesChange} {...props}>
            <Form.Item
                name="kb_id"
                label="Имя интервала"
                rules={[{ required: true, message: "Укажите имя интервала" }, { validator: kbIdFormatValidator }, { validator: uniqueKbIdValidator(intervalNames) }]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="comment" label="Комментарий">
                <Input.TextArea />
            </Form.Item>
        </Form>
    );
};
