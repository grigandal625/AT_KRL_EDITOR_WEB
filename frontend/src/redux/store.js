import { configureStore } from "@reduxjs/toolkit";

import kbListSlicer from "./stores/kbListSlicer";
import kbSlicer from "./stores/kbSlicer";

export default configureStore({
    reducer: {
        kbList: kbListSlicer,
        kb: kbSlicer,
    },
});
