import { ReferenceInput, ValueInput } from "./SimpleFormulaEditor";
import { useEffect, useState } from "react";
import { Button, Form, InputNumber, Popover, Slider, Space, message, Tree, TreeSelect, Tooltip } from "antd";
import { SettingOutlined, DownOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { ExpressionJSONToTreeItem, getAllKeys, getItemByKey, treeItemToExpressionJSON } from "./TreeTools";
import { evaluatable, operations, temporal } from "../../GLOBAL";
import NFWrapper from "./NFWrapper";
import { selectkbEvents } from "../../redux/stores/kbEventsSlicer";
import { useSelector } from "react-redux";
import { selectkbIntervals } from "../../redux/stores/kbItervalsSlicer";
import AllenOperationInput from "./AllenOperationInput";

export const NFReferenceInput = ({ value, onChange }) => (
    <NFWrapper value={value} onChange={onChange}>
        <ReferenceInput />
    </NFWrapper>
);

export const NFValueInput = ({ value, onChange }) => (
    <NFWrapper value={value} onChange={onChange}>
        <ValueInput />
    </NFWrapper>
);

const NFFormulaTreeItem = ({ item, updateItem }) => {
    const data = item.data || {};
    const itemType = data.itemType;
    const itemValue = data.value;

    const kbEventsStore = useSelector(selectkbEvents);
    const kbIntervalsStore = useSelector(selectkbIntervals);
    const storeParts = {
        EvIntRel: { leftStore: kbEventsStore, rightStore: kbIntervalsStore },
        EvRel: { leftStore: kbEventsStore, rightStore: kbEventsStore },
        IntRel: { leftStore: kbIntervalsStore, rightStore: kbIntervalsStore },
    };

    const allOperations = { ...operations, ...temporal.operations };

    const onVChange = (itemType, value) => {
        const newItem = { ...item };
        const newData = { ...data, itemType, value };
        if (itemType !== data.itemType || data.value !== value) {
            if (Object.keys(operations).includes(itemType)) {
                const oldOperation = operations[data.itemType];
                const newOperation = operations[itemType];
                if (!newItem.children) {
                    newItem.children = newOperation.is_binary
                        ? [{ key: item.key + "-0" }, { key: item.key + "-1" }]
                        : [{ key: item.key + "-0" }];
                } else if (oldOperation && oldOperation.is_binary && !newOperation.is_binary) {
                    newItem.children = [newItem.children[0]];
                } else if (oldOperation && !oldOperation.is_binary && newOperation.is_binary) {
                    newItem.children = [...newItem.children, { key: item.key + "-1" }];
                }
                if (newData.value?.non_factor) {
                    newData.value = { non_factor: newData.value.non_factor };
                } else {
                    delete newData.value;
                }
                newItem.data = newData;
                newItem.isLeaf = false;
            } else if (Object.keys(temporal.operations).includes(itemType)) {
                const oldOperation = temporal.operations[data.itemType];
                const newOperation = temporal.operations[itemType];
                const newTag = newData.value?.tag || newOperation.default_tag;
                newData.value = { ...newData.value, tag: newTag, Value: itemType };

                if (oldOperation) {
                    let oldLeft, oldRight;
                    const oldTag = data?.value?.tag;
                    if (oldTag) {
                        oldLeft = storeParts[oldTag].leftStore.items.find((e) => e.kb_id == data?.value?.left?.Name);
                        oldRight = storeParts[oldTag].rightStore.items.find((e) => e.kb_id == data?.value?.right?.Name);
                    }

                    if (newTag && newData.value) {
                        if (!newData.value.left && storeParts[oldTag].leftStore === storeParts[newTag].leftStore) {
                            newData.value.left = data.value.left;
                        }
                        if (!newData.value.right && storeParts[oldTag].rightStore === storeParts[newTag].rightStore) {
                            newData.value.right = data.value.right;
                        }
                    }
                }
                newItem.data = newData;
                newItem.children = undefined;
                newItem.isLeaf = true;
            } else {
                if (!itemType) {
                    newData.value = { non_factor: newData?.value?.non_factor };
                    delete newData.itemType;
                } else if (!value) {
                    newData.value = { value: { tag: "value", content: "" }, ref: { tag: "ref" } }[itemType];
                }
                newItem.data = newData;
                newItem.children = undefined;
                newItem.isLeaf = true;
            }
        }
        updateItem(item.key, newItem);
    };

    const items = {
        ref: <NFReferenceInput value={itemValue} onChange={(v) => onVChange(itemType, v)} />,
        value: <NFValueInput value={itemValue} onChange={(v) => onVChange(itemType, v)} />,
    };

    return (
        <Space wrap={false}>
            {!itemType || Object.keys(temporal.operations).includes(itemType) ? (
                <TreeSelect
                    size="small"
                    value={itemType}
                    onChange={(t) => onVChange(t, itemValue)}
                    placeholder="Выберите"
                    treeExpandAction="click"
                    dropdownStyle={{ overflow: "auto" }}
                    popupMatchSelectWidth={false}
                    treeData={evaluatable.itemTypeOptions}
                />
            ) : Object.keys(operations).includes(itemType) ? (
                <NFWrapper value={itemValue} onChange={(v) => onVChange(itemType, v)}>
                    <TreeSelect
                        size="small"
                        value={itemType}
                        onChange={(t) => onVChange(t, itemValue)}
                        placeholder="Выберите"
                        treeExpandAction="click"
                        dropdownStyle={{ overflow: "auto" }}
                        popupMatchSelectWidth={false}
                        treeData={evaluatable.itemTypeOptions}
                    />
                </NFWrapper>
            ) : (
                <Tooltip title="Сбросить">
                    <Button
                        onClick={() => onVChange(undefined, itemValue)}
                        size="small"
                        icon={<CloseCircleOutlined />}
                        type="link"
                    />
                </Tooltip>
            )}
            {Object.keys(temporal.operations).includes(itemType) ? (
                <AllenOperationInput value={itemValue} onChange={(v) => onVChange(itemType, v)} operation={itemType} />
            ) : (
                <></>
            )}
            {items[itemType]}
        </Space>
    );
};

export default ({ value, onChange }) => {
    let formulaTree = ExpressionJSONToTreeItem(value, false);
    const allKeys = getAllKeys(formulaTree);
    const [expandedKeys, setExpandedKeys] = useState(allKeys);
    const [allow, setAllow] = useState(true);

    const updateItem = (key, newItem) => {
        const newTree = { ...formulaTree };
        const item = getItemByKey(newTree, key);
        for (let k in newItem) {
            item[k] = newItem[k];
        }
        const newValue = treeItemToExpressionJSON(newTree, false);
        onChange({ ...newValue });
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
        <div style={{ whiteSpace: "nowrap", overflowX: "scroll", overflowY: "hidden", height: "100%" }}>
            <Tree
                style={{ minHeight: 150 }}
                selectable={false}
                expandedKeys={expandedKeys}
                treeData={[formulaTree]}
                showLine
                switcherIcon={<DownOutlined />}
                onExpand={(expandedKeys, info) => {
                    setExpandedKeys(expandedKeys);
                }}
                titleRender={(item) => <NFFormulaTreeItem item={item} updateItem={updateItem} />}
            />
        </div>
    );
};
