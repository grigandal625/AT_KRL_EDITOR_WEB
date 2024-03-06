import { selectkbEvents } from "../../redux/stores/kbEventsSlicer";
import { useDispatch, useSelector } from "react-redux";
import { selectkbIntervals } from "../../redux/stores/kbItervalsSlicer";
import { Button, Menu, Popover, Space, Typography } from "antd";
import { temporal } from "../../GLOBAL";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";

export const TemporalEntitySelect = ({ value, onChange, mode, allowedModes }) => {
    const dispatch = useDispatch();
    const kbEventsStore = useSelector(selectkbEvents);
    const kbIntervalsStore = useSelector(selectkbIntervals);
    const { id } = useParams();

    useEffect(() => {
        if (!kbEventsStore.kbId || parseInt(kbEventsStore.kbId) !== parseInt(id)) {
            dispatch(kbEventsStore.getAction(id));
        }
        if (!kbIntervalsStore.kbId || parseInt(kbIntervalsStore.kbId) !== parseInt(id)) {
            dispatch(kbIntervalsStore.getAction(id));
        }
    }, [id]);

    const tagStores = {
        Event: kbEventsStore,
        Interval: kbIntervalsStore,
    };

    const seletedEntity = tagStores[value?.tag]?.items.find((e) => e.kb_id === value?.Name);
    const selectedKey = seletedEntity ? `${value.tag}-${seletedEntity.id}` : undefined;

    const items = [];
    if (allowedModes.includes("event")) {
        items.push({
            key: "1",
            label: <b>События</b>,
            children: kbEventsStore.items.map((e) => ({ key: `Event-${e.id}`, label: e.kb_id })),
        });
    }
    if (allowedModes.includes("interval")) {
        items.push({
            key: "2",
            label: <b>Интервалы</b>,
            children: kbIntervalsStore.items.map((e) => ({ key: `Interval-${e.id}`, label: e.kb_id })),
        });
    }

    const onSelectItem = ({ key }) => {
        const [tag, itemIdStr] = key.split("-");
        const itemId = parseInt(itemIdStr);
        const item = tagStores[tag].items.find((e) => parseInt(e.id) === itemId);
        onChange({
            tag,
            Name: item.kb_id,
        });
    };

    return (
        <Space wrap={false}>
            {seletedEntity ? (
                <Link target="_blank" to={tagStores[value.tag].urlRenderer({ id, item: seletedEntity })}>
                    {value.Name}
                </Link>
            ) : (
                <Typography.Text style={{ whiteSpace: "nowrap" }} type="secondary">
                    (выберите)
                </Typography.Text>
            )}
            <Popover
                style={{ padding: 0 }}
                trigger="click"
                placement="bottomLeft"
                content={<Menu onClick={onSelectItem} selectedKeys={selectedKey ? [selectedKey] : []} items={items} mode={"inline"} />}
            >
                <Button size="small" type="link" icon={<DownOutlined />} />
            </Popover>
        </Space>
    );
};

export default ({ value, onChange, operation }) => {
    const dispatch = useDispatch();
    const kbEventsStore = useSelector(selectkbEvents);
    const kbIntervalsStore = useSelector(selectkbIntervals);
    const { id } = useParams();

    const op = temporal.operations[operation];

    useEffect(() => {
        if (!kbEventsStore.kbId || parseInt(kbEventsStore.kbId) !== parseInt(id)) {
            dispatch(kbEventsStore.getAction(id));
        }
        if (!kbIntervalsStore.kbId || parseInt(kbIntervalsStore.kbId) !== parseInt(id)) {
            dispatch(kbIntervalsStore.getAction(id));
        }
    }, [id]);

    const storeParts = {
        EvIntRel: { leftStore: kbEventsStore, rightStore: kbIntervalsStore, rightMode: "event", leftMode: "interval" },
        EvRel: { leftStore: kbEventsStore, rightStore: kbEventsStore, rightMode: "event", leftMode: "event" },
        IntRel: {
            leftStore: kbIntervalsStore,
            rightStore: kbIntervalsStore,
            rightMode: "interval",
            leftMode: "interval",
        },
    };

    const tag = value?.tag;
    const left = tag ? storeParts[tag].leftStore.items.find((e) => e.kb_id == value?.left?.Name) : undefined;
    const right = tag ? storeParts[tag].rightStore.items.find((e) => e.kb_id == value?.right?.Name) : undefined;

    const tags = {
        EventInterval: "EvIntRel",
        EventEvent: "EvRel",
        IntervalInterval: "IntRel",
    };

    const updateLeft = (newLeft) => {
        const leftTag = newLeft.tag;
        const rightTag = right?.tag || op.allowed_right[0][0].toUpperCase() + op.allowed_right[0].slice(1);
        const tag = tags[leftTag + rightTag];
        const v = { ...value, tag, left: newLeft };
        onChange(v);
    };
    const updateRight = (newRight) => {
        const leftTag = left?.tag || op.allowed_left[0][0].toUpperCase() + op.allowed_left[0].slice(1);
        const rightTag = newRight.tag;
        const tag = tags[leftTag + rightTag];
        const v = { ...value, tag, right: newRight };
        onChange(v);
    };

    return (
        <Space>
            <TemporalEntitySelect value={value?.left} onChange={updateLeft} allowedModes={op.allowed_left} />
            <Typography.Text>
                <b>{operation || ""}</b>
            </Typography.Text>
            <TemporalEntitySelect value={value?.right} onChange={updateRight} allowedModes={storeParts[tag]?.leftMode === "interval" ? ["interval"] : op.allowed_right} />
        </Space>
    );
};
