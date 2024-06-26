import { operations } from "../../GLOBAL";

export const getItemByKey = (tree, key) => {
    if (tree instanceof Array) {
        for (let i in tree) {
            let res = getItemByKey(tree[i], key);
            if (res) {
                return res;
            }
        }
    }
    if (tree.key === key) {
        return tree;
    }
    if (tree.children) {
        return getItemByKey(tree.children, key);
    }
};

export const treeItemToExpressionJSON = (treeItem, simpleMode) => {
    if (treeItem.data) {
        if (["ref", "value"].includes(treeItem.data.itemType)) {
            return treeItem.data.value;
        }
        if (Object.keys(operations).includes(treeItem.data.itemType)) {
            const operationDesc = operations[treeItem.data.itemType];
            const op = {};
            if (simpleMode) {
                const metaToTag = {
                    eq: "EqOp",
                    log: "LogOp",
                    math: "ArOp",
                };

                const operationValueAttrGetters = {
                    eq: (itemType) => itemType,
                    log: (itemType) => itemType.toUpperCase(),
                    math: (itemType) => operations[itemType].values[0],
                };

                op.tag = metaToTag[operationDesc.meta];
                op.Value = operationValueAttrGetters[operationDesc.meta](treeItem.data.itemType);
            } else {
                op.tag = treeItem.data.itemType;
                op.sign = treeItem.data.itemType;
                if (treeItem.data.value?.non_factor) {
                    op.non_factor = { belief: 50, probability: 100, accuracy: 0, ...treeItem.data.value?.non_factor };
                }
            }
            op.left = treeItemToExpressionJSON(treeItem.children[0], simpleMode);
            if (operationDesc.is_binary) {
                op.right = treeItemToExpressionJSON(treeItem.children[1], simpleMode);
            }

            return op;
        } else if (!simpleMode) {
            if (treeItem?.data?.value) {
                treeItem.data.value.non_factor = undefined;
            }
            return treeItem.data.value;
        }
    }
};

export const ExpressionJSONToTreeItem = (expression, simpleMode, previousKey = "", keyAdder = "0") => {
    const key = previousKey === "" ? keyAdder : previousKey + "-" + keyAdder;
    const treeItem = { key };
    if (expression) {
        if (simpleMode) {
            if (["String", "Number", "TruthVal"].includes(expression.tag)) {
                treeItem.data = { itemType: "value", value: expression };
                treeItem.isLeaf = true;
            } else if (expression.tag === "Attribute") {
                treeItem.data = { itemType: "ref", value: expression };
                treeItem.isLeaf = true;
            } else if (["EqOp", "LogOp", "ArOp"].includes(expression.tag)) {
                const sign = expression.Value.toLowerCase();
                const itemType = Object.keys(operations).find((k) => operations[k].values.includes(sign) && ["math", "log", "eq"].includes(operations[k].meta));
                const operationDesc = operations[itemType];
                treeItem.isLeaf = false;
                treeItem.data = { itemType };
                treeItem.children = [ExpressionJSONToTreeItem(expression.left, simpleMode, key)];
                if (operationDesc.is_binary) {
                    treeItem.children = [...treeItem.children, ExpressionJSONToTreeItem(expression.right, simpleMode, key, "1")];
                }
            }
        } else if (!["EvIntRel", "EvRel", "IntRel"].includes(expression.tag)) {
            treeItem.data = {
                itemType: expression.tag,
            };

            if (Object.keys(operations).includes(expression.tag || expression.sign)) {
                const operationDesc = operations[expression.tag || expression.sign];
                treeItem.isLeaf = false;
                treeItem.children = [ExpressionJSONToTreeItem(expression.left, simpleMode, key)];
                if (operationDesc.is_binary) {
                    treeItem.children = [...treeItem.children, ExpressionJSONToTreeItem(expression.right, simpleMode, key, "1")];
                }
            } else if (["ref", "value"].includes(expression.tag)) {
                treeItem.data.value = expression;
                treeItem.isLeaf = true;
            }

            if (expression.non_factor) {
                treeItem.data.value = { ...treeItem.data.value, non_factor: expression.non_factor };
            }
        } else {
            treeItem.data = {
                itemType: expression.Value,
                value: expression,
            };
        }
    }
    return treeItem;
};

export const getAllKeys = ({ key, children }) => [key, ...(children ? children.reduce((accumulator, child) => [...accumulator, ...getAllKeys(child)], []) : [])];
