import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiLocation, loadStatuses } from "../../GLOBAL";

export const getKbObjects = createAsyncThunk("kbObjects/get", async (id) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_objects/`);
    const items = await fetchResult.json();
    return { items, id: parseInt(id) };
});

const kbObjectsSlice = createSlice({
    name: "kbObjects",
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
        builder.addCase(getKbObjects.pending, (state) => {
            state.status = loadStatuses.loading;
        })
        .addCase(getKbObjects.fulfilled, (state, action) => {
            state.items = action.payload.items;
            state.kbId = action.payload.id;
            state.status = loadStatuses.loaded;
        })
        .addCase(getKbObjects.rejected, (state) => {
            state.status = loadStatuses.error;
        })
    }
})

export const selectKbObjects = (state) =>
    Object({
        ...state.kbObjects,
        urlRenderer: ({ id, item }) => `/knowledge_bases/${id}/objects/base_objects/${item.id}`,
        listTitle: "Список объектов",
        itemParamKey: "objectId",
        notCreatedLabel: "Объектов не создано",
        createLabel: "Создать объект",
        kbTab: "base_objects",
        getAction: getKbObjects,
    });

export default kbObjectsSlice.reducer;
export const { resetKrl } = kbObjectsSlice.actions;