import React, { useState } from "react";
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
            ITEM("new", <a href="#">Создать базу знаний</a>, <FileAddFilled />, undefined, extraMapping),
            ITEM("open", "Открыть базу знаний", <FolderOpenFilled />, undefined, extraMapping),
            ITEM("upload", "Загрузить базу знаний", <UploadOutlined />, undefined, extraMapping),
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
            ITEM("json", "Сохранить в формате XML", <FileTextFilled />, undefined, extraMapping),
        ],
        extraMapping
    ),
];

export default () => {
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
    };

    return (
        <Sider collapsed={collapsed} collapsible width={width} onCollapse={(value) => setCollapsed(value)}>
            <div style={{ margin: 20 }}>
                <Avatar style={{ background: "silver" }} shape="square" size="large" icon={<CodepenCircleOutlined />} />
                {nameVisible ? <></> : <span style={{ marginLeft: 20, color: "white" }}>Редактор базы знаний</span>}
            </div>
            <Menu theme="dark" mode="inline" items={items(extraMapping)} />
        </Sider>
    );
};
