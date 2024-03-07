import { Tree, Select, Space, Input, InputNumber, Checkbox, TreeSelect, Button, Tooltip, Typography, Dropdown, AutoComplete } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getKbObjects, selectKbObjects } from "../../redux/stores/kbObjectsSlicer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CloseCircleOutlined, DownOutlined } from "@ant-design/icons";
import { ExpressionJSONToTreeItem, getAllKeys, getItemByKey, treeItemToExpressionJSON } from "./TreeTools";
import { operations, temporal } from "../../GLOBAL";
import { getKbTypes, selectKbTypes } from "../../redux/stores/kbTypesSlicer";

export const ReferenceInput = ({ value, onChange, simpleMode }) => {
    const dispatch = useDispatch();
    const kbObjectsStore = useSelector(selectKbObjects);
    const { id } = useParams();

    useEffect(() => {
        if (!kbObjectsStore.items.length || parseInt(id) !== parseInt(kbObjectsStore.kbId)) {
            dispatch(getKbObjects(id));
        }
    }, [id]);

    let currentObjectKbId, currentAttrKbId;
    if (simpleMode) {
        const Attribute = { ...value, tag: "Attribute" };
        const objectAndAttrStr = Attribute.Value;
        if (objectAndAttrStr) {
            [currentObjectKbId, currentAttrKbId] = objectAndAttrStr.split(".");
        }
    } else {
        const ref = { ...value, tag: "ref" };
        currentObjectKbId = ref.id;
        currentAttrKbId = (ref.ref && ref.ref.id) || undefined;
    }

    const objectData = kbObjectsStore.items.find((obj) => obj.kb_id === currentObjectKbId);
    const attrData = objectData && objectData.ko_attributes.find((attr) => attr.kb_id === currentAttrKbId);

    const objectOptions = kbObjectsStore.items.map((obj) => Object({ value: obj.id, key: obj.id, label: obj.kb_id }));
    const attrOptions = (objectData && objectData.ko_attributes.map((attr) => Object({ value: attr.id, label: attr.kb_id }))) || [];

    const selectedObject = objectData && objectData.id;
    const selectedAttr = attrData && attrData.id;

    const onRefChange = (objectId, attrId) => {
        const ref = simpleMode ? { ...value, tag: "Attribute" } : { ...value, tag: "ref" };
        const currentObjectKbId = simpleMode ? ref.Value && ref.Value.split(".")[0] : ref.id;
        const currentAttrKbId = simpleMode ? ref.Value && ref.Value.split(".")[1] : (ref.ref && ref.ref.id) || undefined;

        const newObjectData = kbObjectsStore.items.find((obj) => obj.id === objectId);
        const newAttrData = newObjectData && newObjectData.ko_attributes.find((attr) => attr.id === attrId);

        const newObjectKbId = newObjectData && newObjectData.kb_id;
        const newAttrKbId = newAttrData && newAttrData.kb_id;

        if (newObjectData) {
            if (newAttrData) {
                if (currentObjectKbId !== newObjectKbId || currentAttrKbId !== newAttrKbId) {
                    const newValue = simpleMode ? { ...ref, Value: `${newObjectKbId}.${newAttrKbId}` } : { ...ref, id: newObjectKbId, ref: { id: newAttrKbId, tag: "ref" } };
                    onChange(newValue);
                }
            } else {
                if (currentObjectKbId !== newObjectKbId) {
                    const newValue = simpleMode ? { ...ref, Value: newObjectKbId } : { ...ref, id: newObjectKbId, ref: undefined };
                    onChange(newValue);
                }
            }
        }
    };

    return (
        <Space wrap={false}>
            <div style={{ whiteSpace: "nowrap" }}>
                {objectData ? (
                    <a target="_blank" href={`/knowledge_bases/${id}/objects/base_objects/${objectData.id}`}>
                        {objectData.kb_id}
                    </a>
                ) : (
                    <Typography.Text type="secondary" style={{ whiteSpace: "nowrap" }}>
                        (Выберите объект)
                    </Typography.Text>
                )}
                <Dropdown
                    trigger="click"
                    menu={{
                        selectedKeys: selectedObject && [selectedObject],
                        items: objectOptions,
                        onClick: ({ key }) => onRefChange(parseInt(key), selectedAttr),
                    }}
                >
                    <Button type="link" size="small" icon={<DownOutlined />} />
                </Dropdown>
            </div>
            <Select
                size="small"
                placeholder="Выберите атрибут"
                value={attrData && selectedAttr}
                onChange={(attrId) => onRefChange(selectedObject, parseInt(attrId))}
                options={attrOptions}
            />
        </Space>
    );
};

export const ValueInput = ({ value, onChange, simpleMode }) => {
    const valueGetters = {
        string: String,
        number: Number,
        boolean: Boolean,
    };

    const simpleTags = {
        string: "String",
        number: "Number",
        boolean: "TruthVal",
    };
    const dispatch = useDispatch();

    const simpleTagTypes = Object.fromEntries(Object.entries(simpleTags).map(([k, v]) => [v, k]));

    const kbTypesStore = useSelector(selectKbTypes);
    const { id } = useParams();

    useEffect(() => {
        if (!kbTypesStore.kbId || parseInt(id) !== parseInt(kbTypesStore.kbId)) {
            dispatch(getKbTypes(id));
        }
    }, [id]);

    let inputValue = undefined;
    let valueType = "string";

    const stringValueOptions = kbTypesStore.items
        .filter((t) => t.meta === 1 || t.meta === 3)
        .reduce(
            (accum, t) => [
                ...accum,
                ...t.kt_values.map((v) => ({
                    value: v.data.name || v.data,
                    type: t.kb_id,
                })),
            ],
            []
        )
        .map((v) => ({
            value: v.value,
            label: (
                <Space>
                    <b>{v.value}</b>
                    <Typography.Text type="secondary">{v.type}</Typography.Text>
                </Space>
            ),
        }))
        .filter((value, i, arr) => arr.map((v) => v.value).indexOf(value.value) === i);

    if (value) {
        if (simpleMode) {
            valueType = simpleTagTypes[value.tag] || "string";
            inputValue = valueGetters[valueType](value.Value);
        } else {
            inputValue = value.content;
            valueType = typeof inputValue;
        }
    }

    const options = [
        { value: "string", label: "Символьное" },
        { value: "number", label: "Числовое" },
        { value: "boolean", label: "Логическое" },
    ];

    const updateValue = (type, v) => {
        const newValue = simpleMode ? { ...value, tag: simpleTags[type], Value: v } : { ...value, content: v };
        onChange(newValue);
    };

    const valueInputs = {
        string: (
            <AutoComplete
                dropdownStyle={{ minWidth: 200 }}
                size="small"
                style={{ minWidth: 100 }}
                placeholder="Введите символьное значение"
                value={inputValue}
                options={inputValue ? stringValueOptions.filter((v) => v.value.toLowerCase().includes(String(inputValue).toLowerCase())) : stringValueOptions}
                onChange={(e) => updateValue(valueType, e)}
            />
        ),
        number: (
            <InputNumber
                size="small"
                style={{ width: "100%", minWidth: 100 }}
                placeholder="Введите числовое значение"
                value={inputValue}
                onChange={(v) => updateValue(valueType, v)}
            />
        ),
        boolean: (
            <Checkbox checked={inputValue} onChange={(e) => updateValue(valueType, e.target.checked)}>
                Логическое значение
            </Checkbox>
        ),
    };

    return (
        <Space wrap={false}>
            <Select
                size="small"
                options={options}
                value={valueType}
                onChange={(newType) => {
                    let newValue = inputValue !== undefined ? valueGetters[newType](inputValue) : inputValue;
                    if (Number.isNaN(newValue)) {
                        newValue = undefined;
                    }
                    updateValue(newType, newValue);
                }}
                optionType="button"
            />
            {valueInputs[valueType]}
        </Space>
    );
};

const FormulaTreeItem = ({ item, updateItem }) => {
    const data = item.data || {};
    const itemType = data.itemType;
    const itemValue = data.value;

    const onVChange = (itemType, value) => {
        const newItem = { ...item };
        const newData = { ...data, itemType, value };
        if (itemType !== data.itemType || data.value !== value) {
            if (Object.keys(operations).includes(itemType)) {
                const oldOperation = operations[data.itemType];
                const newOperation = operations[itemType];
                if (!newItem.children) {
                    newItem.children = newOperation.is_binary ? [{ key: item.key + "-0" }, { key: item.key + "-1" }] : [{ key: item.key + "-0" }];
                } else if (oldOperation && oldOperation.is_binary && !newOperation.is_binary) {
                    newItem.children = [newItem.children[0]];
                } else if (oldOperation && !oldOperation.is_binary && newOperation.is_binary) {
                    newItem.children = [...newItem.children, { key: item.key + "-1" }];
                }
                delete newData.value;
                newItem.data = newData;
                newItem.isLeaf = false;
            } else {
                if (!itemType) {
                    delete newData.value;
                    delete newData.itemType;
                } else if (!value) {
                    newData.value = { value: { tag: "String", Value: "" }, ref: { tag: "Attribute" } }[itemType];
                }
                newItem.data = newData;
                newItem.children = undefined;
                newItem.isLeaf = true;
            }
        }
        updateItem(item.key, newItem);
    };

    const items = {
        ref: <ReferenceInput simpleMode value={itemValue} onChange={(v) => onVChange(itemType, v)} />,
        value: <ValueInput simpleMode value={itemValue} onChange={(v) => onVChange(itemType, v)} />,
    };

    return (
        <Space wrap={false}>
            {!itemType || Object.keys(operations).includes(itemType) ? (
                <TreeSelect
                    size="small"
                    value={itemType}
                    onChange={(t) => onVChange(t, itemValue)}
                    placeholder="Выберите"
                    treeExpandAction="click"
                    dropdownStyle={{ overflow: "auto" }}
                    popupMatchSelectWidth={false}
                    treeData={temporal.formula.itemTypeOptions}
                />
            ) : (
                <Tooltip title="Сбросить">
                    <Button onClick={() => onVChange(undefined, itemValue)} size="small" icon={<CloseCircleOutlined />} type="link" />
                </Tooltip>
            )}
            {items[itemType]}
        </Space>
    );
};

export default ({ value, onChange, noScrollOverflow, minHeight }) => {
    let formulaTree = ExpressionJSONToTreeItem(value, true);
    const allKeys = getAllKeys(formulaTree);
    const [expandedKeys, setExpandedKeys] = useState(allKeys);
    const [allow, setAllow] = useState(true);

    const updateItem = (key, newItem) => {
        const newTree = { ...formulaTree };
        const item = getItemByKey(newTree, key);
        for (let k in newItem) {
            item[k] = newItem[k];
        }
        const newValue = treeItemToExpressionJSON(newTree, true);
        onChange(newValue);
    };

    useEffect(() => {
        if (value === undefined) {
            setAllow(true);
        }
        if (allow && value !== undefined) {
            setExpandedKeys(allKeys);
            setAllow(false);
        }
    }, [value]);

    return (
        <div
            style={{
                whiteSpace: "nowrap",
                height: "100%",
                ...(noScrollOverflow ? {} : { overflowX: "scroll", overflowY: "hidden" }),
            }}
        >
            <Tree
                style={{ minHeight: minHeight || 150 }}
                selectable={false}
                expandedKeys={expandedKeys}
                treeData={[formulaTree]}
                showLine
                switcherIcon={<DownOutlined />}
                onExpand={(expandedKeys, info) => {
                    setExpandedKeys(expandedKeys);
                }}
                titleRender={(item) => <FormulaTreeItem item={item} updateItem={updateItem} />}
            />
        </div>
    );
};
