import { Button, Modal, Form, ConfigProvider, theme, Tooltip } from "antd";
import { Provider, useDispatch } from "react-redux";
import MainTypeForm from "../components/knowledge_base/types/MainTypeForm";
import { useMatches, useNavigate, useParams } from "react-router-dom";
import { PlusCircleFilled } from "@ant-design/icons";
import { createType } from "../redux/stores/kbTypesSlicer";
import "./AddEntityButton.css";
import store from "../redux/store";

export default ({ kbTab, showTooltip, ...props }) => {
    const matches = useMatches();
    const kbTabMatch = matches.reverse().find((m) => m.data && m.data.kbTab);
    kbTab = kbTab || (kbTabMatch ? kbTabMatch.data.kbTab : undefined);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const {
        token: { borderRadius, colorPrimary },
    } = theme.useToken();

    const showAddTypeDialog = () => {
        const dialog = Modal.confirm({
            icon: <PlusCircleFilled style={{ color: colorPrimary }} />,
            title: "Добавление типа",
            className: "add-entity-dialog",
            content: (
                <Provider store={store}>
                    <ConfigProvider theme={{ cssVar: true, token: { borderRadius: 2 } }}>
                        <MainTypeForm forCreate form={form} />
                    </ConfigProvider>
                </Provider>
            ),
            okButtonProps: {
                style: { borderRadius },
                onClick: async () => {
                    try {
                        const data = await form.validateFields();
                        dispatch(createType({ id, data, navigate }));
                        dialog.destroy();
                    } catch (e) {
                        console.error(e);
                    }
                },
            },
            okText: "Добавить тип",
            cancelText: "Отмена",
            cancelButtonProps: {
                style: { borderRadius },
            },
        });
    };

    const showAddObjectDialog = () => {};
    const showAddRuleDialog = () => {};

    const handlers = {
        types: showAddTypeDialog,
        objects: showAddObjectDialog,
        rule: showAddRuleDialog,
    };

    const captions = {
        types: "Добавить тип",
        objects: "Добавить объект",
        rules: "Добавить правило",
    };

    return showTooltip ? (
        <Tooltip title={captions[kbTab]}>
            <Button {...props} onClick={handlers[kbTab]} />
        </Tooltip>
    ) : (
        <Button {...props} onClick={handlers[kbTab]} />
    );
};
