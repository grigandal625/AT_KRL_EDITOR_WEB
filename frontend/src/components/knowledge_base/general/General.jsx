import { Form, Input, Button, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateKb } from "../../../redux/stores/kbSlicer";
import { useParams } from "react-router-dom";
import { loadStatuses } from "../../../GLOBAL";

export default () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const kbStore = useSelector((state) => state.kb);
    return kbStore.status === loadStatuses.loaded ? (
        <Form
            onFinish={(data, ...args) => {
                dispatch(updateKb({ id, data }));
            }}
            layout="vertical"
        >
            <Form.Item rules={[{ required: true }]} initialValue={kbStore.knowledgeBase.name} name="name" label="Имя файла БЗ">
                <Input addonAfter=".kbs" />
            </Form.Item>
            <Form.Item initialValue={kbStore.knowledgeBase.problem_area} name="problem_area" label="Проблемная область">
                <Input />
            </Form.Item>
            <Form.Item initialValue={kbStore.knowledgeBase.description} name="description" label="Описание задач">
                <Input.TextArea style={{ minHeight: 100 }} />
            </Form.Item>
            <Form.Item colon={false}>
                <Button type="primary" htmlType="submit" loading={kbStore.status !== loadStatuses.loaded}>
                    Сохранить
                </Button>
            </Form.Item>
        </Form>
    ) : (
        <Skeleton />
    );
};
