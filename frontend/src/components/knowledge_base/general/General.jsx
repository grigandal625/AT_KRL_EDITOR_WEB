import { Form, Input, Button, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateKb } from "../../../redux/stores/kbSlicer";
import { useParams } from "react-router-dom";
import { loadStatuses } from "../../../GLOBAL";
import KBForm from "../KBForm";
import { useEffect } from "react";

export default () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [form] = Form.useForm();
    const kbStore = useSelector((state) => state.kb);
    const { knowledgeBase } = kbStore;
    useEffect(() => {
        if (knowledgeBase) {
            form.setFieldsValue(knowledgeBase);
        }
    }, [knowledgeBase]);

    return kbStore.status === loadStatuses.loaded ? (
        <>
            <KBForm form={form} />
            <Button
                onClick={async () => {
                    try {
                        const data = await form.validateFields();
                        dispatch(updateKb({ id, data }));
                    } catch (e) {}
                }}
                type="primary"
                htmlType="submit"
                loading={kbStore.status !== loadStatuses.loaded}
            >
                Сохранить
            </Button>
        </>
    ) : (
        <Skeleton active />
    );
};
