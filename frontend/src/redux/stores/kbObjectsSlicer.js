import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiLocation, loadStatuses } from "../../GLOBAL";

export const getKbObjects = createAsyncThunk("kbObjects/get", async (id) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_objects/`);
    const items = await fetchResult.json();
    return { items, id: parseInt(id) };
});

export const createObject = createAsyncThunk("kbObjects/create", async ({ id, data, navigate }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_objects/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const item = await fetchResult.json();
    return { item, navigate, kbId: id };
});

export const updateObject = createAsyncThunk("kbObjects/update", async ({ id, objectId, data }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_objects/${objectId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const object = await fetchResult.json();
    return object;
});

export const setObjectAttrs = createAsyncThunk("kbObjects/setAttrs", async ({ id, objectId, ko_attributes }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_objects/${objectId}/set_attributes/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ko_attributes),
    });
    const attrs = await fetchResult.json();
    return { id: parseInt(objectId), attrs };
});

export const duplicateObject = createAsyncThunk("kbObjects/duplicate", async ({ id, objectId, navigate }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_objects/${objectId}/duplicate/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const item = await fetchResult.json();
    return { item, navigate, id };
});

export const deleteObject = createAsyncThunk('kbObjects/delete', async ({ id, objectId, navigate }) => {
    await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_objects/${objectId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    });
    return { id, itemId: parseInt(objectId), navigate };
})

export const loadObjectKrl = createAsyncThunk("kbObjects/krl", async ({ id, objectId }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_objects/${objectId}/krl/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const { krl } = await fetchResult.json();
    return krl;
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
        builder
            .addCase(getKbObjects.pending, (state) => {
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
            .addCase(createObject.fulfilled, (state, action) => {
                state.items.push(action.payload.item);
                action.payload.navigate(`/knowledge_bases/${action.payload.kbId}/objects/base_objects/${action.payload.item.id}`);
            })
            .addCase(updateObject.pending, (state) => {
                state.saveStatus = loadStatuses.loading;
            })
            .addCase(updateObject.fulfilled, (state, action) => {
                const index = state.items.map((t) => t.id).indexOf(action.payload.id);
                state.items[index] = action.payload;
                state.saveStatus = loadStatuses.loaded;
            })
            .addCase(setObjectAttrs.pending, (state) => {
                state.saveStatus = loadStatuses.loading;
            })
            .addCase(setObjectAttrs.fulfilled, (state, action) => {
                const index = state.items.map((t) => t.id).indexOf(action.payload.id);
                const newObject = {
                    ...state.items.find((t) => t.id === action.payload.id),
                    ko_attributes: action.payload.attrs,
                };
                state.items[index] = newObject;
                state.saveStatus = loadStatuses.loaded;
            }).addCase(duplicateObject.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(duplicateObject.fulfilled, (state, action) => {
                state.items.push(action.payload.item);
                state.status = loadStatuses.loaded;
                action.payload.navigate(`/knowledge_bases/${action.payload.id}/objects/base_objects/${action.payload.object.id}`);
            }).addCase(deleteObject.pending, (state) => {
                state.saveStatus = loadStatuses.loading;
            })
            .addCase(deleteObject.fulfilled, (state, action) => {
                action.payload.navigate(`/knowledge_bases/${action.payload.id}/objects/base_objects`);
                state.items = state.items.filter((t) => t.id !== action.payload.itemId);
                state.saveStatus = loadStatuses.loaded;
            })
            .addCase(loadObjectKrl.pending, (state) => {
                state.krlStatus = loadStatuses.loading;
            })
            .addCase(loadObjectKrl.fulfilled, (state, action) => {
                state.previewKrl = action.payload;
                state.krlStatus = loadStatuses.loaded;
            });;
    },
});

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
