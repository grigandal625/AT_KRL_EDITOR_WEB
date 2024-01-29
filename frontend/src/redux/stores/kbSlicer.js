import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiLocation, loadStatuses } from "../../GLOBAL";
import { message } from "antd";

export const getKb = createAsyncThunk("knowledgeBase/get", async (id) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/`);
    const response = await fetchResult.json();
    return response;
});

export const updateKb = createAsyncThunk("knowledgeBase/update", async ({ id, data }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const response = await fetchResult.json();
    return response;
});

export const createKb = createAsyncThunk("knowledgeBase/create", async ({ data, navigate }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const knowledgeBase = await fetchResult.json();
    return { knowledgeBase, navigate };
});

const kbSlice = createSlice({
    name: "knowledgeBase",
    initialState: {
        knowledgeBase: undefined,
        status: loadStatuses.initial,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getKb.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(getKb.fulfilled, (state, action) => {
                state.status = loadStatuses.loaded;
                state.knowledgeBase = action.payload;
            })
            .addCase(getKb.rejected, (state) => {
                state.status = loadStatuses.error;
            })
            .addCase(updateKb.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(updateKb.fulfilled, (state, action) => {
                state.status = loadStatuses.loaded;
                state.knowledgeBase = action.payload;
                message.success("Данные обновлены");
            })
            .addCase(updateKb.rejected, (state) => {
                state.status = loadStatuses.error;
            })
            .addCase(createKb.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(createKb.fulfilled, (state, action) => {
                state.knowledgeBase = action.payload.knowledgeBase;
                state.status = loadStatuses.loaded;
                action.payload.navigate(`/knowledge_bases/${action.payload.knowledgeBase.id}`);
            });
    },
});

export default kbSlice.reducer;
