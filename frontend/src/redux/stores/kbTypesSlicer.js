import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiLocation, loadStatuses } from "../../GLOBAL";

export const getKbTypes = createAsyncThunk("kbTypes/get", async (id) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_types/`);
    const items = await fetchResult.json();
    return { items, id: parseInt(id) };
});

export const createType = createAsyncThunk("kbTypes/create", async ({ id, data, navigate }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_types/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const item = await fetchResult.json();
    return { item, navigate, kbId: id };
});

export const updateType = createAsyncThunk("kbTypes/update", async ({ id, typeId, data }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_types/${typeId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const type = await fetchResult.json();
    return type;
});

export const setTypeValues = createAsyncThunk("kbTypes/setValues", async ({ id, typeId, values }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_types/${typeId}/set_values/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
    });
    const newValues = await fetchResult.json();
    return { id: parseInt(typeId), values: newValues };
});

export const deleteType = createAsyncThunk("kbTypes/delete", async ({ id, typeId, data, navigate }) => {
    await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_types/${typeId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return { id, itemId: parseInt(typeId), navigate };
});

export const duplicateType = createAsyncThunk("kbTypes/duplicate", async ({ id, typeId, navigate }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_types/${typeId}/duplicate/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const item = await fetchResult.json();
    return { item, navigate, id };
});

export const loadTypeKrl = createAsyncThunk("kbTypes/krl", async ({ id, typeId }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_types/${typeId}/krl/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const { krl } = await fetchResult.json();
    return krl;
});

const kbTypesSlice = createSlice({
    name: "kbTypes",
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
            state.timer = setTimeout(update, 1000)
        },
        setAutoSaveStatus: (state, action) => {
            state.autoSaveStatus = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getKbTypes.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(getKbTypes.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.kbId = action.payload.id;
                state.status = loadStatuses.loaded;
            })
            .addCase(getKbTypes.rejected, (state) => {
                state.status = loadStatuses.error;
            })
            .addCase(createType.fulfilled, (state, action) => {
                state.items.push(action.payload.item);
                action.payload.navigate(`/knowledge_bases/${action.payload.kbId}/types/${action.payload.item.id}`);
            })
            .addCase(updateType.pending, (state) => {
                state.saveStatus = loadStatuses.loading;
                state.autoSaveStatus = loadStatuses.loading;
            })
            .addCase(updateType.fulfilled, (state, action) => {
                const index = state.items.map((t) => t.id).indexOf(action.payload.id);
                state.items[index] = action.payload;
                state.saveStatus = loadStatuses.loaded;
                state.autoSaveStatus = loadStatuses.loaded;
            })
            .addCase(setTypeValues.pending, (state) => {
                state.saveStatus = loadStatuses.loading;
            })
            .addCase(setTypeValues.fulfilled, (state, action) => {
                const index = state.items.map((t) => t.id).indexOf(action.payload.id);
                const newType = {
                    ...state.items.find((t) => t.id === action.payload.id),
                    kt_values: action.payload.values,
                };
                state.items[index] = newType;
                state.saveStatus = loadStatuses.loaded;
            })
            .addCase(deleteType.pending, (state) => {
                state.saveStatus = loadStatuses.loading;
            })
            .addCase(deleteType.fulfilled, (state, action) => {
                action.payload.navigate(`/knowledge_bases/${action.payload.id}/types`);
                state.items = state.items.filter((t) => t.id !== action.payload.itemId);
                state.saveStatus = loadStatuses.loaded;
            })
            .addCase(duplicateType.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(duplicateType.fulfilled, (state, action) => {
                state.items.push(action.payload.item);
                state.status = loadStatuses.loaded;
                action.payload.navigate(`/knowledge_bases/${action.payload.id}/types/${action.payload.item.id}`);
            })
            .addCase(loadTypeKrl.pending, (state) => {
                state.krlStatus = loadStatuses.loading;
            })
            .addCase(loadTypeKrl.fulfilled, (state, action) => {
                state.previewKrl = action.payload;
                state.krlStatus = loadStatuses.loaded;
            });
    },
});

export const selectKbTypes = (state) =>
    Object({
        ...state.kbTypes,
        urlRenderer: ({ id, item }) => `/knowledge_bases/${id}/types/${item.id}`,
        listTitle: "Список типов",
        itemParamKey: "typeId",
        notCreatedLabel: "Типов не создано",
        createLabel: "Создать тип",
        kbTab: "types",
        getAction: getKbTypes,
    });

export default kbTypesSlice.reducer;
export const { resetKrl, setTimer, setAutoSaveStatus } = kbTypesSlice.actions;
