const apiPort = process.env.REACT_APP_API_PORT || window.location.port;
const apiLocation = `${process.env.REACT_APP_API_PROTOCOL || window.location.protocol}//${process.env.REACT_APP_API_HOST || window.location.hostname}${
    apiPort ? ":" + apiPort : ""
}`;
const loadStatuses = { initial: "initial", loading: "loading", error: "error", loaded: "loaded" };

const operations = {
    eq: { label: "==", values: ["=", "==", "eq"], is_binary: true, convert_non_factor: true, meta: "eq" },
    gt: { values: [">", "gt"], is_binary: true, convert_non_factor: true, meta: "eq" },
    ge: { values: [">=", "ge"], is_binary: true, convert_non_factor: true, meta: "eq" },
    lt: { values: ["<", "lt"], is_binary: true, convert_non_factor: true, meta: "eq" },
    le: { values: ["<=", "le"], is_binary: true, convert_non_factor: true, meta: "eq" },
    ne: { label: "!=", values: ["<>", "!=", "ne"], is_binary: true, convert_non_factor: true, meta: "eq" },
    and: { label: "&&", values: ["&", "&&", "and"], is_binary: true, meta: "log" },
    or: { label: "||", values: ["|", "||", "or"], is_binary: true, meta: "log" },
    not: { label: "not", values: ["~", "!", "not"], is_binary: false, meta: "log" },
    xor: { values: ["xor"], is_binary: true, meta: "log" },
    neg: { values: ["-", "neg"], is_binary: false, meta: "super_math" },
    add: { values: ["+", "add"], is_binary: true, meta: "math" },
    sub: { values: ["-", "sub"], is_binary: true, meta: "math" },
    mul: { values: ["*", "mul"], is_binary: true, meta: "math" },
    div: { values: ["/", "div"], is_binary: true, meta: "math" },
    mod: { label: "mod", values: ["%", "mod"], is_binary: true, meta: "super_math" },
    pow: { values: ["^", "**", "pow"], is_binary: true, meta: "super_math" },
};

const temporal = {
    formula: {
        itemTypeOptions: [
            { value: "value", title: "Простое значение" },
            { value: "ref", title: "Ссылка на атрибут объекта" },
            {
                value: "operation",
                title: "Операция",
                selectable: false,
                children: [
                    {
                        value: "equatation",
                        title: "Операция сравнения",
                        selectable: false,
                        children: Object.entries(operations)
                            .filter(([_, op]) => op.meta === "eq")
                            .map(([value, op]) => Object({ value, title: op.label || op.values[0] })),
                    },
                    {
                        value: "mathematics",
                        title: "Арифметическая операция",
                        selectable: false,
                        children: Object.entries(operations)
                            .filter(([_, op]) => op.meta === "math")
                            .map(([value, op]) => Object({ value, title: op.label || op.values[0] })),
                    },
                    {
                        value: "logics",
                        title: "Логическая операция",
                        selectable: false,
                        children: Object.entries(operations)
                            .filter(([_, op]) => op.meta === "log")
                            .map(([value, op]) => Object({ value, title: op.label || op.values[0] })),
                    },
                ],
            },
        ],
    },
};

export { apiLocation, loadStatuses, operations, temporal };
