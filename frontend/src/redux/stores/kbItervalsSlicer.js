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

export const updateInterval = createAsyncThunk("kbIntervals/update", async ({ id, intervalId, data }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_intervals/${intervalId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const interval = await fetchResult.json();
    return interval;
});

export const deleteInterval = createAsyncThunk("kbIntervals/delete", async ({ id, intervalId, navigate }) => {
    await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_intervals/${intervalId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return { id, itemId: parseInt(intervalId), navigate };
});

export const duplicateInterval = createAsyncThunk("kbIntervals/duplicate", async ({ id, intervalId, navigate }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_intervals/${intervalId}/duplicate/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const item = await fetchResult.json();
    return { item, navigate, id };
});

export const loadIntervalKrl = createAsyncThunk("kbIntervals/krl", async ({ id, intervalId }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_intervals/${intervalId}/krl/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const { krl } = await fetchResult.json();
    return krl;
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
            }).addCase(updateInterval.pending, (state) => {
                state.saveStatus = loadStatuses.loading;
            })
            .addCase(createInterval.fulfilled, (state, action) => {
                state.items.push(action.payload.item);
                action.payload.navigate(`/knowledge_bases/${action.payload.kbId}/objects/intervals/${action.payload.item.id}`);
            })
            .addCase(updateInterval.fulfilled, (state, action) => {
                const index = state.items.map((t) => t.id).indexOf(action.payload.id);
                state.items[index] = action.payload;
                state.saveStatus = loadStatuses.loaded;
            }).addCase(deleteInterval.pending, (state) => {
                state.saveStatus = loadStatuses.loading;
            })
            .addCase(deleteInterval.fulfilled, (state, action) => {
                action.payload.navigate(`/knowledge_bases/${action.payload.id}/objects/intervals`);
                state.items = state.items.filter((t) => t.id !== action.payload.itemId);
                state.saveStatus = loadStatuses.loaded;
            })
            .addCase(duplicateInterval.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(duplicateInterval.fulfilled, (state, action) => {
                state.items.push(action.payload.item);
                state.status = loadStatuses.loaded;
                action.payload.navigate(`/knowledge_bases/${action.payload.id}/objects/intervals/${action.payload.item.id}`);
            })
            .addCase(loadIntervalKrl.pending, (state) => {
                state.krlStatus = loadStatuses.loading;
            })
            .addCase(loadIntervalKrl.fulfilled, (state, action) => {
                state.previewKrl = action.payload;
                state.krlStatus = loadStatuses.loaded;
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
