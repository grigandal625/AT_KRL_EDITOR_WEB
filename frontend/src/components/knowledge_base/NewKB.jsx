import { Button, Col, Form, Row, Typography } from "antd";
import ThemedContainer from "../../utils/ThemedContainer";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createKb } from "../../redux/stores/kbSlicer";
import KBForm from "./KBForm";
import { UploadOutlined } from "@ant-design/icons";

export default () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return (
        <ThemedContainer>
            <Row wrap={false}>
                <Col flex="auto">
                    <Typography.Title level={3} className="kb-title">
                        Создание базы знаний
                    </Typography.Title>
                </Col>
                <Col>
                    <Link to="/knowledge_bases/upload">
                        <Button type="dashed" icon={<UploadOutlined />}>
                            Загрузить из файла
                        </Button>
                    </Link>
                </Col>
            </Row>
            <KBForm form={form} />
            <Button
                type="primary"
                onClick={async () => {
                    try {
                        const data = await form.validateFields();
                        dispatch(createKb({ data, navigate }));
                    } catch (e) {}
                }}
            >
                Создать
            </Button>
        </ThemedContainer>
    );
};
