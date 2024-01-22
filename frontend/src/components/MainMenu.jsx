import { useState } from "react";
import { Menu, Avatar, Layout } from "antd";
import { DatabaseFilled, FileAddFilled, FolderOpenFilled, UploadOutlined, SaveFilled, FileFilled, FileExcelFilled, FileTextFilled, CodepenCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useMatches, useParams } from "react-router-dom";
import "./MainMenu.css";

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
            ITEM("new", <Link to="/knowledge_bases/new">Создать базу знаний</Link>, <FileAddFilled />, undefined, extraMapping),
            ITEM("knowledge_bases", <Link to="/knowledge_bases">Открыть базу знаний</Link>, <FolderOpenFilled />, undefined, extraMapping),
            ITEM("upload", <Link to="/knowledge_bases/upload">Загрузить базу знаний</Link>, <UploadOutlined />, undefined, extraMapping),
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

export const PageMenu = () => {
    const matches = useMatches();
    const selectedMenuItemMatch = matches.find((m) => m.data && m.data.menuItem);
    const selectedMenuItem = selectedMenuItemMatch ? selectedMenuItemMatch.data.menuItem : undefined;
    const { id } = useParams();
    const extraMapping = {
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
    return <Menu mode="horizontal" selectedKeys={[selectedMenuItem]} items={items(extraMapping)} />;
};

export default ({ width, setWidth }) => {
    const matches = useMatches();
    const selectedMenuItemMatch = matches.find((m) => m.data && m.data.menuItem);
    const selectedMenuItem = selectedMenuItemMatch ? selectedMenuItemMatch.data.menuItem : undefined;
    const { id } = useParams();
    const [collapsed, setC] = useState(true);
    const [exportCollapsed, setExportCollapsed] = useState(false);
    const [nameVisible, setNameVisible] = useState(collapsed);
    const setCollapsed = (v) => {
        setC(v);
        if (!v) {
            setTimeout(setNameVisible, 200, v);
        } else {
            setNameVisible(v);
        }
        setWidth(v ? 80 : exportCollapsed ? 450 : 300);
    };

    const extraMapping = {
        export: {
            onTitleClick: () => {
                setWidth(collapsed ? 80 : exportCollapsed ? 300 : 450);
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
        <Sider className="page-sider" collapsed={collapsed} collapsible width={width} onCollapse={(value) => setCollapsed(value)}>
            <Link to="/">
                <div style={{ margin: 20 }}>
                    <Avatar style={{ background: "silver" }} shape="square" size="large" icon={<CodepenCircleOutlined />} />
                    {nameVisible ? <></> : <span style={{ marginLeft: 20, color: "white" }}>Редактор базы знаний</span>}
                </div>
            </Link>
            <Menu selectedKeys={[selectedMenuItem]} theme="dark" mode="inline" items={menuItems} />
        </Sider>
    );
};
