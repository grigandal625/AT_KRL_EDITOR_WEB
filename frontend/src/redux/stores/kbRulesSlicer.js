import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiLocation, loadStatuses } from "../../GLOBAL";

export const getKbRules = createAsyncThunk("kbRules/get", async (id) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_rules/`);
    const items = await fetchResult.json();
    return { items, id: parseInt(id) };
});

export const createRule = createAsyncThunk("kbRules/create", async ({ id, data, navigate }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_rules/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const item = await fetchResult.json();
    return { item, navigate, kbId: id };
});

export const updateRule = createAsyncThunk("kbRules/update", async ({ id, ruleId, data }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_rules/${ruleId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const rule = await fetchResult.json();
    return rule;
});

export const updateRuleCondInstr = createAsyncThunk("kbRules/updateRuleCondInstr", async ({ id, ruleId, data }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_rules/${ruleId}/update_condition_and_instructions/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const rule = await fetchResult.json();
    return rule;
});

export const deleteRule = createAsyncThunk("kbRules/delete", async ({ id, ruleId, navigate }) => {
    await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_rules/${ruleId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return { id, itemId: parseInt(ruleId), navigate };
});

export const duplicateRule = createAsyncThunk("kbRules/duplicate", async ({ id, ruleId, navigate }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_rules/${ruleId}/duplicate/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const item = await fetchResult.json();
    return { item, navigate, id };
});

export const loadRuleKrl = createAsyncThunk("kbRules/krl", async ({ id, ruleId }) => {
    const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/${id}/k_rules/${ruleId}/krl/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const { krl } = await fetchResult.json();
    return krl;
});

const kbRulesSlice = createSlice({
    name: "kbRules",
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
            .addCase(getKbRules.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(getKbRules.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.kbId = action.payload.id;
                state.status = loadStatuses.loaded;
            })
            .addCase(getKbRules.rejected, (state) => {
                state.status = loadStatuses.error;
            })
            .addCase(createRule.fulfilled, (state, action) => {
                state.items.push(action.payload.item);
                action.payload.navigate(`/knowledge_bases/${action.payload.kbId}/rules/${action.payload.item.id}`);
            })
            .addCase(updateRule.pending, (state) => {
                state.saveStatus = loadStatuses.loading;
                state.autoSaveStatus = loadStatuses.loading;
            })
            .addCase(updateRule.fulfilled, (state, action) => {
                const index = state.items.map((t) => t.id).indexOf(action.payload.id);
                state.items[index] = action.payload;
                state.saveStatus = loadStatuses.loaded;
                state.autoSaveStatus = loadStatuses.loaded;
            })
            .addCase(updateRuleCondInstr.pending, (state) => {
                state.saveStatus = loadStatuses.loading;
            })
            .addCase(updateRuleCondInstr.fulfilled, (state, action) => {
                state.items = state.items.map((item) => (item.id === action.payload.id ? { ...item, ...action.payload } : item));
                state.saveStatus = loadStatuses.loaded;
            })
            .addCase(deleteRule.pending, (state) => {
                state.saveStatus = loadStatuses.loading;
            })
            .addCase(deleteRule.fulfilled, (state, action) => {
                action.payload.navigate(`/knowledge_bases/${action.payload.id}/rules`);
                state.items = state.items.filter((t) => t.id !== action.payload.itemId);
                state.saveStatus = loadStatuses.loaded;
            })
            .addCase(duplicateRule.pending, (state) => {
                state.status = loadStatuses.loading;
            })
            .addCase(duplicateRule.fulfilled, (state, action) => {
                state.items.push(action.payload.item);
                state.status = loadStatuses.loaded;
                action.payload.navigate(`/knowledge_bases/${action.payload.id}/rules/${action.payload.item.id}`);
            })
            .addCase(loadRuleKrl.pending, (state) => {
                state.krlStatus = loadStatuses.loading;
            })
            .addCase(loadRuleKrl.fulfilled, (state, action) => {
                state.previewKrl = action.payload;
                state.krlStatus = loadStatuses.loaded;
            });
    },
});

export const selectkbRules = (state) =>
    Object({
        ...state.kbRules,
        urlRenderer: ({ id, item }) => `/knowledge_bases/${id}/rules/${item.id}`,
        listTitle: "Список правил",
        itemParamKey: "ruleId",
        notCreatedLabel: "Правил не создано",
        createLabel: "Создать правило",
        kbTab: "rules",
        getAction: getKbRules,
    });

export default kbRulesSlice.reducer;
export const { resetKrl, setTimer, setAutoSaveStatus } = kbRulesSlice.actions;
