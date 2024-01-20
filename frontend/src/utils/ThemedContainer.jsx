import { theme } from "antd";

export default ({ children, style, ...props }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <div
            style={{
                marginTop: 24,
                height: "100%",
                padding: 24,
                background: colorBgContainer,
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export const ThemedBar = ({ children, style, ...props }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <div
            style={{
                marginTop: 24,
                padding: 24,
                background: colorBgContainer,
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    );
};
