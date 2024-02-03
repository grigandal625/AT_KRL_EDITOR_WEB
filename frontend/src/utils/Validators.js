export const kbIdFormatValidator = (_, value) => {
    if (!/^[\wа-яA-Я]+$/.test(value)) {
        return Promise.reject(new Error('Имя должно содержать только латинские или кириллические символы, цифры и символ "_" (нижнее подчеркивание)'));
    }
    return Promise.resolve();
};

export const uniqueKbIdValidator = (values) => (_, value) => {
    if (values.includes(value) && value) {
        return Promise.reject(new Error("Данное имя уже существует"));
    }
    return Promise.resolve();
};

export const symbolicTypeValuesValidator = (currentForm) => () => {
    const kt_values = currentForm.getFieldValue("kt_values");
    if (kt_values.length < 2) {
        return Promise.reject(new Error("Укажите как минимум 2 значения"));
    }
    if (kt_values.filter((v) => !v).length) {
        return Promise.reject(new Error("Не должно быть пустых значений"));
    }
    if (kt_values.map((v) => v.data).filter((v, i, arr) => arr.indexOf(v) === i).length !== kt_values.length) {
        return Promise.reject(new Error("Не должно быть повторяющихся значений"));
    }
    return Promise.resolve();
};

export const numericTypeValuesValidator = (currentForm) => () => {
    const kt_values = currentForm.getFieldValue("kt_values");
    if (kt_values && kt_values[0] && kt_values[1]) {
        const _from = kt_values[0].data;
        const _to = kt_values[1].data;
        if (_from >= _to) {
            return Promise.reject(new Error('Значение "От" не должно быть больше значения "До"'));
        }
    }
    return Promise.resolve();
};

export const baseObjectAttributesValidator = (currentForm) => () => {
    const ko_attributes = currentForm.getFieldValue("ko_attributes");
    if (ko_attributes && !ko_attributes.length) {
        return Promise.reject(new Error("Укажите как минимум 1 атрибут"));
    }
    return Promise.resolve();
};

export const attrUniqueValidator = (currentForm, index) => (_, value) => {
    const ko_attributes = currentForm.getFieldValue("ko_attributes");
    const attrNames = ko_attributes ? ko_attributes.filter((attr, i) => i !== index).map((attr) => attr && attr.kb_id) : [];
    if (attrNames.includes(value)) {
        return Promise.reject(new Error("Найдено повторяющееся имя"));
    }
    return Promise.resolve();
};
