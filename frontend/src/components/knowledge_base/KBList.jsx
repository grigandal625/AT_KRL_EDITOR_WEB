import { useSelector, useDispatch } from "react-redux";
import { getKbList } from "../../redux/stores/kbListSlicer";
import { useEffect } from "react";
import ThemedContainer from "../../utils/ThemedContainer";
import { Table, Skeleton, Typography } from "antd";
import { loadStatuses } from "../../GLOBAL";
import { Link } from "react-router-dom";
import "./KBList.css";

export default () => {
    const dispatch = useDispatch();
    const kbListStore = useSelector((state) => state.kbList);
    useEffect(() => {
        dispatch(getKbList());
    }, []);
    const columns = [
        { title: "Название", dataIndex: "name", key: "name" },
        { title: "Действия", render: (kb) => <Link to={`/knowledge_bases/${kb.id}`}>Редактировать</Link> },
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
