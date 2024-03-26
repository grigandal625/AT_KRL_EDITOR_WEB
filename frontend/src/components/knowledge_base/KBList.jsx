import { useSelector, useDispatch } from "react-redux";
import { getKbList, deleteKb } from "../../redux/stores/kbListSlicer";
import { useEffect } from "react";
import ThemedContainer from "../../utils/ThemedContainer";
import { Table, Skeleton, Typography, Button, Modal, theme, Tag, Space } from "antd";
import { loadStatuses } from "../../GLOBAL";
import { Link } from "react-router-dom";
import "./KBList.css";
import { DeleteOutlined, FolderOpenOutlined } from "@ant-design/icons";

export default () => {
    const dispatch = useDispatch();
    const kbListStore = useSelector((state) => state.kbList);
    const {
        token: { borderRadius, colorPrimary },
    } = theme.useToken();
    useEffect(() => {
        dispatch(getKbList());
    }, []);

    const confirmDelete = (kb) =>
        Modal.confirm({
            title: "Удаление базы знаний",
            content: (
                <>
                    Удалить базу знаний <b>{kb.name}</b> ?
                </>
            ),
            style: { borderRadius },
            onOk: () => {
                dispatch(deleteKb(kb));
            },
            okText: "Удалить",
            cancelText: "Отмена",
            okButtonProps: { style: { borderRadius } },
            cancelButtonProps: { style: { borderRadius } },
        });
    const columns = [
        {
            title: "Название",
            render: (kb) =>
                kb.status == 1 ? (
                    <>
                        <Button key={kb.id} type="link" loading>
                            <Space>
                                {kb.name}
                                <Tag>чтение из файла</Tag>
                            </Space>
                        </Button>
                    </>
                ) : kb.status == 2 ? (
                    <Link to={`/knowledge_bases/${kb.id}`}>
                        <Button type="link" icon={<FolderOpenOutlined />}>
                            {kb.name}
                        </Button>
                    </Link>
                ) : (
                    <Link to={`/knowledge_bases/${kb.id}`}>
                        <Button type="link" danger icon={<FolderOpenOutlined />}>
                            <Space>
                                {kb.name}
                                <Tag color="red">ошибка</Tag>
                            </Space>
                        </Button>
                    </Link>
                ),
        },
        { title: "Проблемная область", dataIndex: "problem_area", key: "problem_area" },
        { title: "Удалить", key: "delete", render: (kb) => <Button onClick={() => confirmDelete(kb)} type="text" danger icon={<DeleteOutlined />} /> },
    ];
    return (
        <ThemedContainer>
            {[loadStatuses.initial, loadStatuses.loading, undefined, null].includes(kbListStore.status) ? (
                <Skeleton active />
            ) : kbListStore.status == loadStatuses.error ? (
                <></>
            ) : (
                <Table
                    title={() => (
                        <Typography.Title className="kb-table-title" level={4}>
                            Базы знаний
                        </Typography.Title>
                    )}
                    columns={columns}
                    dataSource={kbListStore.knowledgeBases}
                />
            )}
        </ThemedContainer>
    );
};
