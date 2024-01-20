import ThemedContainer from "../utils/ThemedContainer";
import { Result } from "antd";
import { Link } from "react-router-dom";

export default () => (
    <ThemedContainer>
        <Result status="warning" title="Страница не найдена" extra={<Link to="/">На главную</Link>} />
    </ThemedContainer>
);
