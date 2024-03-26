import { configureStore } from "@reduxjs/toolkit";

import kbEventsSlicer from "./stores/kbEventsSlicer";
import kbIntervalsSlicer from "./stores/kbIntervalsSlicer";
import kbListSlicer from "./stores/kbListSlicer";
import kbObjectsSlicer from "./stores/kbObjectsSlicer";
import kbSlicer from "./stores/kbSlicer";
import kbTypesSlicer from "./stores/kbTypesSlicer";
import kbRulesSlicer from "./stores/kbRulesSlicer";

export default configureStore({
    reducer: {
        kbList: kbListSlicer,
        kb: kbSlicer,
        kbTypes: kbTypesSlicer,
        kbObjects: kbObjectsSlicer,
        kbIntervals: kbIntervalsSlicer,
        kbEvents: kbEventsSlicer,
        kbRules: kbRulesSlicer,
    },
});
