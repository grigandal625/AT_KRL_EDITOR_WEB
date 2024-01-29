import { Card, Col, Row, Skeleton } from "antd";
import AddEntityButton from "../../../utils/AddEntityButton";
import { PlusOutlined } from "@ant-design/icons";
import { Link, Outlet, useMatches, useParams } from "react-router-dom";
import { ItemMenu } from "../../../utils/KBItemMenuList";
import { selectKbObjects } from "../../../redux/stores/kbObjectsSlicer";
import { selectkbIntervals } from "../../../redux/stores/kbItervalsSlicer";
import { selectkbEvents } from "../../../redux/stores/kbEventsSlicer";

export default () => {
    const matches = useMatches();
    const kbTabMatch = matches.reverse().find((m) => m.data && m.data.kbTab);
    const kbTab = kbTabMatch ? kbTabMatch.data.kbTab : undefined;
    const { id } = useParams();

    return "objects" === kbTab ? (
        <Row gutter={[15, 15]}>
            <Col xxl={8} xl={8} lg={8} md={8} sm={24} xs={24}>
                <Card
                    title={
                        <Row align="middle" wrap={false}>
                            <Col flex="auto">
                                <Link to={`/knowledge_bases/${id}/objects/base_objects`}>Базовые объекты</Link>
                            </Col>
                            <Col>
                                <AddEntityButton kbTab="base_objects" icon={<PlusOutlined />} />
                            </Col>
                        </Row>
                    }
                >
                    <ItemMenu storeSelector={selectKbObjects} />
                </Card>
            </Col>
            <Col xxl={8} xl={8} lg={8} md={8} sm={24} xs={24}>
                <Card
                    title={
                        <Row align="middle" wrap={false}>
                            <Col flex="auto">
                                <Link to={`/knowledge_bases/${id}/objects/intervals`}>Интервалы</Link>
                            </Col>
                            <Col>
                                <AddEntityButton kbTab="intervals" icon={<PlusOutlined />} />
                            </Col>
                        </Row>
                    }
                >
                    <ItemMenu storeSelector={selectkbIntervals} />
                </Card>
            </Col>
            <Col xxl={8} xl={8} lg={8} md={8} sm={24} xs={24}>
                <Card
                    title={
                        <Row align="middle" wrap={false}>
                            <Col flex="auto">
                                <Link to={`/knowledge_bases/${id}/objects/events`}>События</Link>
                            </Col>
                            <Col>
                                <AddEntityButton kbTab="events" icon={<PlusOutlined />} />
                            </Col>
                        </Row>
                    }
                >
                    <ItemMenu storeSelector={selectkbEvents} />
                </Card>
            </Col>
        </Row>
    ) : (
        <Outlet />
    );
};
