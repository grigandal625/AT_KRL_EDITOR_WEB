import { Tree, Select, Space, Input, InputNumber, Checkbox, Radio, TreeSelect, Button, Tooltip, Typography, Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getKbObjects, selectKbObjects } from "../../redux/stores/kbObjectsSlicer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CloseCircleOutlined, DownOutlined, SettingOutlined } from "@ant-design/icons";
import { getItemByKey } from "./TreeTools";
import { operations, temporal } from "../../GLOBAL";

export const ReferenceInput = ({ value, onChange, simpleMode, forcedKbId }) => {
    const dispatch = useDispatch();
    const kbObjectsStore = useSelector(selectKbObjects);
    let { id } = useParams();
    id = forcedKbId || id;

    useEffect(() => {
        if (!kbObjectsStore.items.length || parseInt(id) !== parseInt(kbObjectsStore.kbId)) {
            dispatch(getKbObjects(id));
        }
    }, [id]);

    const [selectedObject, setSelectedObject] = useState(null);
    const [selectedAttr, setSelectedAttr] = useState(null);
    const objectOptions = kbObjectsStore.items.map((obj) => Object({ value: obj.id, key: obj.id, label: obj.kb_id }));
    const objectData = kbObjectsStore.items.find((obj) => obj.id === selectedObject);
    const attrOptions = (objectData && objectData.ko_attributes.map((attr) => Object({ value: attr.id, label: attr.kb_id }))) || [];
    const attrData = objectData && objectData.ko_attributes.find((attr) => attr.id === selectedAttr);

    useEffect(() => {
        let [currentObjectKbId, currentAttrKbId] = [];
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
        const currentObjectData = kbObjectsStore.items.find((obj) => obj.kb_id === currentObjectKbId);
        const currentAttrData = currentObjectData && currentObjectData.ko_attributes.find((attr) => attr.kb_id === currentAttrKbId);
        if (currentObjectData && currentObjectData.id !== selectedObject) {
            setSelectedObject(currentObjectData.id);
        }
        if (currentAttrData && currentAttrData.id !== selectedAttr) {
            setSelectedAttr(currentAttrData.id);
        }
    }, []);

    useEffect(() => {
        const ref = simpleMode ? { ...value, tag: "Attribute" } : { ...value, tag: "ref" };
        const currentObjectKbId = ref.id;
        const currentAttrKbId = (ref.ref && ref.ref.id) || undefined;
        if (objectData) {
            if (attrData) {
                if (currentObjectKbId !== objectData.kb_id || currentAttrKbId !== attrData.kb_id) {
                    const newValue = simpleMode
                        ? { ...ref, value: `${objectData.kb_id}.${attrData.kb_id}` }
                        : { ...ref, id: objectData.kb_id, ref: { id: attrData.kbId, tag: "ref" } };
                    onChange(newValue);
                }
            } else {
                if (currentObjectKbId !== objectData.kb_id) {
                    const newValue = simpleMode ? { ...ref, value: objectData.kb_id } : { ...ref, id: objectData.kb_id, ref: undefined };
                    onChange(newValue);
                }
            }
        }
    }, [objectData, attrData]);
    return (
        <Space>
            <div>
                {objectData ? (
                    <a target="_blank" href={`/knowledge_bases/${id}/objects/base_objects/${objectData.id}`}>
                        {objectData.kb_id}
                    </a>
                ) : (
                    <Typography.Text type="secondary">(Выберите объект)</Typography.Text>
                )}
                <Dropdown trigger="click" menu={{ items: objectOptions, onClick: ({ key }) => setSelectedObject(parseInt(key)) }}>
                    <Button type="link" size="small" icon={<DownOutlined />} />
                </Dropdown>
            </div>
            <Select size="small" placeholder="Выберите атрибут" value={attrData && selectedAttr} onChange={setSelectedAttr} options={attrOptions} />
        </Space>
    );
};

export const ValueInput = ({ value, onChange, simpleMode }) => {
    const [valueType, setValueType] = useState();
    const [inputValue, setInputValue] = useState();

    const simpleTags = {
        string: "String",
        number: "Number",
        boolean: "TruthVal",
    };

    const simpleTagTypes = Object.fromEntries(Object.entries(simpleTags).map(([k, v]) => [v, k]));

    const options = [
        { value: "string", label: "Символьное" },
        { value: "number", label: "Численное" },
        { value: "boolean", label: "Логическое" },
    ];

    const valueInputs = {
        string: <Input size="small" style={{ minWidth: 100 }} placeholder="Введите символьное значение" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />,
        number: <InputNumber size="small" style={{ width: "100%", minWidth: 100 }} placeholder="Введите численное значение" value={inputValue} onChange={setInputValue} />,
        boolean: (
            <Checkbox checked={inputValue} onChange={(e) => setInputValue(e.target.checked)}>
                Логическое значение
            </Checkbox>
        ),
    };

    const valueGetters = {
        string: String,
        number: Number,
        boolean: Boolean,
    };

    useEffect(() => {
        let [currentValue, currentValueType] = [];
        if (simpleMode) {
            currentValueType = simpleTagTypes[value && value.tag] || "string";
            currentValue = value && value.Value !== undefined ? valueGetters[currentValueType](value && value.Value) : undefined;
        } else {
            currentValue = value !== undefined ? value.content : undefined;
            currentValueType = typeof currentValue;
        }
        if (!Object.keys(simpleTags).includes(currentValueType)) {
            currentValueType = "string";
        }
        if (currentValueType !== valueType) {
            setValueType(currentValueType);
        }
        if (currentValue !== inputValue) {
            setInputValue(currentValue);
        }
    }, []);

    useEffect(() => {
        let [currentValue, currentValueType] = [];
        if (value) {
            if (simpleMode) {
                currentValueType = simpleTagTypes[value.tag] || "string";
                currentValue = valueGetters[currentValueType](value.Value);
            } else {
                currentValue = value.content;
                currentValueType = typeof currentValue;
            }
        }
        if (currentValue !== undefined) {
            if (currentValue !== inputValue || currentValueType !== valueType) {
                const newValue = simpleMode ? { ...value, tag: simpleTags[valueType], Value: inputValue } : { ...value, content: inputValue };
                onChange(newValue);
            }
        }
    }, [inputValue, valueType]);

    return (
        <Space wrap={false}>
            <Radio.Group
                style={{ whiteSpace: "nowrap" }}
                size="small"
                options={options}
                value={valueType}
                onChange={(e) => {
                    const newType = e.target.value;
                    let newValue = inputValue !== undefined ? valueGetters[newType](inputValue) : inputValue;
                    if (Number.isNaN(newValue)) {
                        newValue = undefined;
                    }
                    setValueType(newType);
                    setInputValue(newValue);
                }}
                optionType="button"
            />
            {valueInputs[valueType]}
        </Space>
    );
};

const FormulaTreeItem = ({ item, updateItem, forcedKbId }) => {
    const data = item.data || {};
    const itemType = data.itemType;
    const itemValue = data.value;
    const [selectedItemType, setSelectedItemType] = useState();
    const [currentItemValue, setCurrentItemValue] = useState();

    useEffect(() => {
        setSelectedItemType(itemType);
        setCurrentItemValue(itemValue);
    }, [item]);

    const onVChange = (value) => {
        const newItem = { ...item, data: { ...data, value } };
        setCurrentItemValue(value);
        updateItem(item.key, newItem);
    };

    const items = {
        ref: <ReferenceInput forcedKbId={forcedKbId} simpleMode value={currentItemValue} onChange={onVChange} />,
        value: <ValueInput simpleMode value={currentItemValue} onChange={onVChange} />,
    };

    const onChange = (itemType) => {
        const newItem = { ...item };
        const newData = { ...data, itemType };
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
            newItem.children = undefined;
            newItem.isLeaf = true;
        }
        setSelectedItemType(itemType);
        updateItem(item.key, newItem);
    };

    return (
        <Space wrap={false}>
            {!selectedItemType || Object.keys(operations).includes(selectedItemType) ? (
                <TreeSelect
                    size="small"
                    value={selectedItemType}
                    onChange={onChange}
                    placeholder="Выберите"
                    treeExpandAction="click"
                    dropdownStyle={{ minWidth: 300, overflow: "scroll" }}
                    treeData={temporal.formula.itemTypeOptions}
                />
            ) : (
                <Tooltip title="Сбросить">
                    <Button onClick={() => setSelectedItemType()} size="small" icon={<CloseCircleOutlined />} type="link" />
                </Tooltip>
            )}
            {items[selectedItemType]}
        </Space>
    );
};

export default ({ value, onChange, forcedKbId }) => {
    const [formulaTree, setFormulaTree] = useState([{ key: "0" }]);

    const updateItem = (key, newItem) => {
        const newTree = [...formulaTree];
        const item = getItemByKey(newTree, key);
        for (let k in newItem) {
            item[k] = newItem[k];
        }
        setFormulaTree(newTree);
    };

    return (
        <div style={{ whiteSpace: "nowrap", overflowX: "scroll", height: "100%" }}>
            <Tree
                selectable={false}
                defaultExpandAll={true}
                treeData={formulaTree}
                showLine
                switcherIcon={<DownOutlined />}
                titleRender={(item) => <FormulaTreeItem forcedKbId={forcedKbId} item={item} updateItem={updateItem} />}
            />
        </div>
    );
};
