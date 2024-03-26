import { AutoComplete, Form, Input } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectKbObjects } from "../../../../redux/stores/kbObjectsSlicer";
import { kbIdFormatValidator, uniqueKbIdValidator } from "../../../../utils/Validators";

export default ({ form, onValuesChange, forCreate, ...props }) => {
    const kbObjectsStore = useSelector(selectKbObjects);
    const { objectId } = useParams();
    const objectNames = kbObjectsStore.items.filter((o) => (forCreate ? true : o.id !== parseInt(objectId))).map((o) => o.kb_id);

    const groups = kbObjectsStore.items
        .map((o) => o.group)
        .filter((g, i, arr) => arr.indexOf(g) === i)
        .map((value) => Object({ value }));

    return (
        <Form form={form} onValuesChange={onValuesChange} {...props}>
            <Form.Item
                name="kb_id"
                label="Имя объекта"
                rules={[{ required: true, message: "Укажите имя объекта" }, { validator: kbIdFormatValidator }, { validator: uniqueKbIdValidator(objectNames) }]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="group" label="Группа">
                <AutoComplete options={groups} placeholder="Выберите группу или укажите новую" />
            </Form.Item>
            <Form.Item name="comment" label="Комментарий">
                <Input.TextArea />
            </Form.Item>
        </Form>
    );
};
