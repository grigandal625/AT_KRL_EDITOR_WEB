import { useState } from "react";
import { Menu, Avatar, Layout } from "antd";
import {
    DatabaseFilled,
    FileAddFilled,
    FolderOpenFilled,
    UploadOutlined,
    SaveFilled,
    FileFilled,
    FileExcelFilled,
    FileTextFilled,
    CodepenCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useMatches, useParams } from "react-router-dom";

const { Sider } = Layout;

const ITEM = (key, label, icon, children, extraMapping) =>
    extraMapping[key]
        ? {
              key,
              icon,
              children,
              label,
              ...extraMapping[key],
          }
        : {
              key,
              icon,
              children,
              label,
          };

const items = (extraMapping) => [
    ITEM(
        "kb",
        "Базы знаний",
        <DatabaseFilled />,
        [
            ITEM(
                "new",
                <Link to="/knowledge_bases/new">Создать базу знаний</Link>,
                <FileAddFilled />,
                undefined,
                extraMapping
            ),
            ITEM(
                "knowledge_bases",
                <Link to="/knowledge_bases">Открыть базу знаний</Link>,
                <FolderOpenFilled />,
                undefined,
                extraMapping
            ),
            ITEM(
                "upload",
                <Link to="/knowledge_bases/upload">Загрузить базу знаний</Link>,
                <UploadOutlined />,
                undefined,
                extraMapping
            ),
        ],
        extraMapping
    ),
    ITEM(
        "export",
        "Сохранение базы знаний",
        <SaveFilled />,
        [
            ITEM("krl", "Сохранить в формате базового/расширенного ЯПЗ", <FileFilled />, undefined, extraMapping),
            ITEM("xml", "Сохранить в формате XML", <FileExcelFilled />, undefined, extraMapping),
            ITEM("json", "Сохранить в формате JSON", <FileTextFilled />, undefined, extraMapping),
        ],
        extraMapping
    ),
];

export default () => {
    const matches = useMatches();
    const selectedMenuItemMatch = matches.find((m) => m.data && m.data.menuItem);
    const selectedMenuItem = selectedMenuItemMatch ? selectedMenuItemMatch.data.menuItem : undefined;
    const { id } = useParams();
    const [collapsed, setC] = useState(false);
    const [exportCollapsed, setExportCollapsed] = useState(false);
    const [width, setWidth] = useState(300);
    const [nameVisible, setNameVisible] = useState(collapsed);
    const setCollapsed = (v) => {
        setC(v);
        if (!v) {
            setTimeout(setNameVisible, 200, v);
        } else {
            setNameVisible(v);
        }
    };

    const extraMapping = {
        export: {
            onTitleClick: () => {
                setWidth(exportCollapsed ? 300 : 450);
                setExportCollapsed(!exportCollapsed);
            },
        },
        krl: {
            disabled: !Boolean(id),
        },
        xml: {
            disabled: !Boolean(id),
        },
        json: {
            disabled: !Boolean(id),
        },
    };
    const menuItems = items(extraMapping);
    return (
        <Sider collapsed={collapsed} collapsible width={width} onCollapse={(value) => setCollapsed(value)}>
            <Link to="/">
                <div style={{ margin: 20 }}>
                    <Avatar
                        style={{ background: "silver" }}
                        shape="square"
                        size="large"
                        icon={<CodepenCircleOutlined />}
                    />
                    {nameVisible ? <></> : <span style={{ marginLeft: 20, color: "white" }}>Редактор базы знаний</span>}
                </div>
            </Link>
            <Menu defaultSelectedKeys={[selectedMenuItem]} theme="dark" mode="inline" items={menuItems} />
        </Sider>
    );
};
