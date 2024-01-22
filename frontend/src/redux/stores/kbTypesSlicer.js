import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiLocation, loadStatuses } from "../../GLOBAL";

export const getKbTypes = createAsyncThunk("kbTypes/get", async (id) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_types/`);
    const types = await fetchResult.json();
    return { types, id: parseInt(id) };
});

export const createType = createAsyncThunk("kbTypes/create", async ({ id, data, navigate }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_types/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const newType = await fetchResult.json();
    return { type: newType, navigate, kbId: id };
});

const kbTypesSlice = createSlice({
    name: "kbTypes",
    initialState: {
        types: [],
        kbId: undefined,
        status: loadStatuses.initial,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getKbTypes.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(getKbTypes.fulfilled, (state, action) => {
                state.types = action.payload.types;
                state.kbId = action.payload.id;
                state.status = loadStatuses.loaded;
            })
            .addCase(getKbTypes.rejected, (state) => {
                state.status = loadStatuses.error;
            })
            .addCase(createType.fulfilled, (state, action) => {
                state.types.push(action.payload.type);
                debugger;
                action.payload.navigate(`/knowledge_bases/${action.payload.kbId}/types/${action.payload.type.id}`);
            });
    },
});

export default kbTypesSlice.reducer;
