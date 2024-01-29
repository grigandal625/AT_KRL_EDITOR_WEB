import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiLocation, loadStatuses } from "../../GLOBAL";

export const getKbEvents = createAsyncThunk("kbEvents/get", async (id) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_intervals/`);
    const items = await fetchResult.json();
    return { items, id: parseInt(id) };
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
    },
    reducers: {
        resetKrl: (state) => {
            state.krlStatus = loadStatuses.initial;
            state.previewKrl = undefined;
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
export const { resetKrl } = kbEventsSlice.actions;
