import { configureStore } from "@reduxjs/toolkit";

import kbListSlicer from "./stores/kbListSlicer";
import kbSlicer from "./stores/kbSlicer";
import kbTypesSlicer from "./stores/kbTypesSlicer";

export default configureStore({
    reducer: {
        kbList: kbListSlicer,
        kb: kbSlicer,
        kbTypes: kbTypesSlicer
    },
});
