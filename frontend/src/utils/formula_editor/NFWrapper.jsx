import React, { useEffect, useState } from "react";
import { Button, Form, InputNumber, Popover, Slider, Space, message, Tree, TreeSelect, Tooltip } from "antd";
import { SettingOutlined, DownOutlined, CloseCircleOutlined } from "@ant-design/icons";

export const NFInput = ({ value, onChange }) => {
    const [form] = Form.useForm();
    const [non_factor, set_non_factor] = useState();
    const [valid, setValid] = useState(true);
    useEffect(() => {
        const actual = { belief: 50, probability: 100, accuracy: 0, ...value };
        form.setFieldsValue(actual);
        set_non_factor(actual);
    }, [value]);

    const updateNF = async (field) => {
        let data,
            v = true;
        try {
            data = await form.validateFields();
        } catch (e) {
            if (e.errorFields && !e.errorFields.length) {
                data = e.values;
            } else {
                v = false;
                console.error(e);
            }
        }
        setValid(v);
        if (v) {
            if (data.belief > data.probability) {
                const f = Object.keys(field)[0];
                const upd = f === "belief" ? "probability" : "belief";
                const nf = { ...data };
                nf[upd] = nf[f];
                form.setFieldValue(upd, data[f]);
                set_non_factor(nf);
            } else {
                set_non_factor(data);
            }
        }
    };

    const save = () => {
        if (valid) {
            onChange(non_factor);
        } else {
            message.error("НЕ-факторы указаны некорректно");
        }
    };

    return (
        <Form onValuesChange={updateNF} size="small" form={form} layout="vertical">
            <Form.Item name="belief" label="Уверенность">
                <Slider min={0} max={100} step={1} />
            </Form.Item>
            <Form.Item name="probability" label="Максимальная уверенность">
                <Slider min={0} max={100} step={1} />
            </Form.Item>
            <Form.Item name="accuracy" label="Точность">
                <InputNumber min={0} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={save}>
                    Сохранить
                </Button>
            </Form.Item>
        </Form>
    );
};

export const NFValueInput = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const show = () => setOpen(true);
    const hide = () => setOpen(false);

    const updateNF = (value) => {
        hide();
        onChange(value);
    };

    return (
        <Popover open={open} title="НЕ-факторы" content={<NFInput value={value} onChange={updateNF} />}>
            <Button onClick={show} type="link" icon={<SettingOutlined />}>
                {value ? `УВЕРЕННОСТЬ [${value.belief}; ${value.probability}] ТОЧНОСТЬ ${value.accuracy || 0}` : ""}
            </Button>
        </Popover>
    );
};

export default ({ value, onChange, children }) => {
    const non_factor = value?.non_factor;
    const [open, setOpen] = useState(false);
    const show = () => setOpen(true);
    const hide = () => setOpen(false);

    const updateNF = (non_factor) => {
        hide();
        onChange({ ...value, non_factor });
    };

    const updateValue = (newValue) => {
        onChange({ ...newValue, non_factor });
    };

    return (
        <Space>
            {React.Children.map(children, (child) => (React.isValidElement(child) ? React.cloneElement(child, { value, onChange: updateValue, ...child.props }) : child))}
            <Popover open={open} title="НЕ-факторы" content={<NFInput value={non_factor} onChange={updateNF} />}>
                <Button onClick={show} type="link" icon={<SettingOutlined />}>
                    {non_factor ? `УВЕРЕННОСТЬ [${non_factor.belief}; ${non_factor.probability}] ТОЧНОСТЬ ${non_factor.accuracy || 0}` : ""}
                </Button>
            </Popover>
        </Space>
    );
};
