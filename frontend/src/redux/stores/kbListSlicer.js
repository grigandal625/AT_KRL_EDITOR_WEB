import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiLocation, loadStatuses } from "../../GLOBAL";
import { updateKb } from "./kbSlicer";

export const getKbList = createAsyncThunk("kbList/get", async () => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/`);
    const response = await fetchResult.json();
    return response;
});

const kbListSlice = createSlice({
    name: "kbList",
    initialState: {
        knowledgeBases: [],
        status: loadStatuses.initial,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getKbList.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(getKbList.fulfilled, (state, action) => {
                state.status = loadStatuses.loaded;
                state.knowledgeBases = action.payload;
            })
            .addCase(getKbList.rejected, (state) => {
                state.status = loadStatuses.error;
            })
            .addCase(updateKb.fulfilled, (state, action) => {
                const newKb = action.payload;
                const oldKb = state.knowledgeBases.find((kb) => kb.id === newKb.id);
                if (!oldKb) {
                    state.knowledgeBases.push(newKb);
                } else {
                    const index = state.knowledgeBases.indexOf(oldKb);
                    state.knowledgeBases[index] = newKb;
                }
            });
    },
});

export default kbListSlice.reducer;
