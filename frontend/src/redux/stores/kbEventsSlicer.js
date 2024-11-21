import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createFrameActionAsyncThunk } from "../frameActor";
import { apiLocation, loadStatuses } from "../../GLOBAL";

export const getKbEvents = createFrameActionAsyncThunk("kbEvents/get", async (id) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_events/`);
    const items = await fetchResult.json();
    return { items, id: parseInt(id) };
});

export const createEvent = createFrameActionAsyncThunk("kbEvents/create", async ({ id, data, navigate }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_events/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const item = await fetchResult.json();
    return { item, navigate, kbId: id };
});

export const updateEvent = createFrameActionAsyncThunk("kbEvents/update", async ({ id, eventId, data }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_events/${eventId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const event = await fetchResult.json();
    return event;
});

export const deleteEvent = createFrameActionAsyncThunk("kbEvents/delete", async ({ id, eventId, navigate }) => {
    await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_events/${eventId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return { id, itemId: parseInt(eventId), navigate };
});

export const duplicateEvent = createFrameActionAsyncThunk("kbEvents/duplicate", async ({ id, eventId, navigate }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_events/${eventId}/duplicate/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const item = await fetchResult.json();
    return { item, navigate, id };
});

export const loadEventKrl = createAsyncThunk("kbEvents/krl", async ({ id, eventId }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_events/${eventId}/krl/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const { krl } = await fetchResult.json();
    return krl;
});

const kbEventsSlice = createSlice({
    name: "kbEvents",
    initialState: {
        items: [],
        kbId: undefined,
        status: loadStatuses.initial,
        saveStatus: loadStatuses.loaded,
        previewKrl: undefined,
        krlStatus: loadStatuses.initial,
        timer: undefined,
        autoSaveStatus: loadStatuses.initial,
    },
    reducers: {
        resetKrl: (state) => {
            state.krlStatus = loadStatuses.initial;
            state.previewKrl = undefined;
        },
        setTimer: (state, action) => {
            const update = action.payload;
            if (state.timer) {
                clearTimeout(state.timer);
            }
            state.timer = setTimeout(update, 1000);
        },
        setAutoSaveStatus: (state, action) => {
            state.autoSaveStatus = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getKbEvents.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(getKbEvents.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.kbId = action.payload.id;
                state.status = loadStatuses.loaded;
            })
            .addCase(getKbEvents.rejected, (state) => {
                state.status = loadStatuses.error;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.items.push(action.payload.item);
                action.payload.navigate(`/knowledge_bases/${action.payload.kbId}/objects/events/${action.payload.item.id}`);
            })
            .addCase(deleteEvent.pending, (state) => {
                state.saveStatus = loadStatuses.loading;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                action.payload.navigate(`/knowledge_bases/${action.payload.id}/objects/events`);
                state.items = state.items.filter((t) => t.id !== action.payload.itemId);
                state.saveStatus = loadStatuses.loaded;
            })
            .addCase(updateEvent.pending, (state) => {
                state.saveStatus = loadStatuses.loading;
                state.autoSaveStatus = loadStatuses.loading;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                const index = state.items.map((t) => t.id).indexOf(action.payload.id);
                state.items[index] = action.payload;
                state.saveStatus = loadStatuses.loaded;
                state.autoSaveStatus = loadStatuses.loaded;
            })
            .addCase(duplicateEvent.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(duplicateEvent.fulfilled, (state, action) => {
                state.items.push(action.payload.item);
                state.status = loadStatuses.loaded;
                action.payload.navigate(`/knowledge_bases/${action.payload.id}/objects/events/${action.payload.item.id}`);
            })
            .addCase(loadEventKrl.pending, (state) => {
                state.krlStatus = loadStatuses.loading;
            })
            .addCase(loadEventKrl.fulfilled, (state, action) => {
                state.previewKrl = action.payload;
                state.krlStatus = loadStatuses.loaded;
            });
    },
});

export const selectkbEvents = (state) =>
    Object({
        ...state.kbEvents,
        urlRenderer: ({ id, item }) => `/knowledge_bases/${id}/objects/events/${item.id}`,
        listTitle: "Список событий",
        itemParamKey: "eventId",
        notCreatedLabel: "Событий не создано",
        createLabel: "Создать событие",
        kbTab: "events",
        getAction: getKbEvents,
    });

export default kbEventsSlice.reducer;
export const { resetKrl, setTimer, setAutoSaveStatus } = kbEventsSlice.actions;
