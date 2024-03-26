import { Form, Upload, Button, Skeleton, message, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateKb, getKb } from "../../../redux/stores/kbSlicer";
import { useParams } from "react-router-dom";
import { apiLocation, loadStatuses } from "../../../GLOBAL";
import KBForm from "../KBForm";
import { useEffect, useState } from "react";
import { getKbTypes, selectKbTypes } from "../../../redux/stores/kbTypesSlicer";
import { getKbObjects, selectKbObjects } from "../../../redux/stores/kbObjectsSlicer";
import { getKbEvents, selectkbEvents } from "../../../redux/stores/kbEventsSlicer";
import { getKbIntervals, selectkbIntervals } from "../../../redux/stores/kbIntervalsSlicer";
import { getKbRules, selectkbRules } from "../../../redux/stores/kbRulesSlicer";
import mobileCheck from "../../../utils/mobileCheck";

export default () => {
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [form] = Form.useForm();
    const kbStore = useSelector((state) => state.kb);
    const kbTypesStore = useSelector(selectKbTypes);
    const kbObjectsStore = useSelector(selectKbObjects);
    const kbEventsStore = useSelector(selectkbEvents);
    const kbIntervalsStore = useSelector(selectkbIntervals);
    const kbRulesStore = useSelector(selectkbRules);
    const { knowledgeBase } = kbStore;
    useEffect(() => {
        if (knowledgeBase) {
            form.setFieldsValue(knowledgeBase);
        }
    }, [knowledgeBase]);

    const props = {
        name: "file",
        action: `${apiLocation}/api/knowledge_bases/${id}/add_upload/`,
        method: "post",
        onChange(info) {
            if (!["done", "error"].includes(info.file.status)) {
                setDisabled(true);
            } else {
                setDisabled(false);
            }
            if (info.file.status !== "uploading") {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === "done") {
                message.success(`Успешно дозагружено`);
                dispatch(getKb(id))
                if (parseInt(kbTypesStore.kbId) === parseInt(id) && kbTypesStore.status === loadStatuses.loaded) {
                    dispatch(getKbTypes(id));
                }
                if (parseInt(kbObjectsStore.kbId) === parseInt(id) && kbObjectsStore.status === loadStatuses.loaded) {
                    dispatch(getKbObjects(id));
                }
                if (parseInt(kbEventsStore.kbId) === parseInt(id) && kbEventsStore.status === loadStatuses.loaded) {
                    dispatch(getKbEvents(id));
                }
                if (parseInt(kbIntervalsStore.kbId) === parseInt(id) && kbIntervalsStore.status === loadStatuses.loaded) {
                    dispatch(getKbIntervals(id));
                }
                if (parseInt(kbRulesStore.kbId) === parseInt(id) && kbRulesStore.status === loadStatuses.loaded) {
                    dispatch(getKbRules(id));
                }
            } else if (info.file.status === "error") {
                message.error(`Ошибка загрузки`);
            }
        },
    };

    return kbStore.status === loadStatuses.loaded ? (
        <>
            <KBForm form={form} disabled={disabled} />
            <Space>
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
                    disabled={disabled}
                >
                    Сохранить
                </Button>
                <Upload {...props} disabled={disabled} showUploadList={disabled}>
                    <Button disabled={disabled} icon={<UploadOutlined />}>
                        Дозагрузить из файла {mobileCheck() ? <></> : <>(kbs, xml, json)</>}
                    </Button>
                </Upload>
            </Space>
        </>
    ) : (
        <Skeleton active />
    );
};
