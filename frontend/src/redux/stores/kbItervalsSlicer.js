import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiLocation, loadStatuses } from "../../GLOBAL";

export const getKbIntervals = createAsyncThunk("kbIntervals/get", async (id) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_intervals/`);
    const items = await fetchResult.json();
    return { items, id: parseInt(id) };
});

export const createInterval = createAsyncThunk("kbIntervals/create", async ({ id, data, navigate }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_intervals/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const item = await fetchResult.json();
    return { item, navigate, kbId: id };
});

const kbIntervalsSlice = createSlice({
    name: "kbIntervals",
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
            .addCase(getKbIntervals.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(getKbIntervals.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.kbId = action.payload.id;
                state.status = loadStatuses.loaded;
            })
            .addCase(getKbIntervals.rejected, (state) => {
                state.status = loadStatuses.error;
            });
    },
});

export const selectkbIntervals = (state) =>
    Object({
        ...state.kbIntervals,
        urlRenderer: ({ id, item }) => `/knowledge_bases/${id}/objects/intervals/${item.id}`,
        listTitle: "Список интервалов",
        itemParamKey: "intervalId",
        notCreatedLabel: "Интервалов не создано",
        createLabel: "Создать интервал",
        kbTab: "intervals",
        getAction: getKbIntervals,
    });

export default kbIntervalsSlice.reducer;
export const { resetKrl } = kbIntervalsSlice.actions;
