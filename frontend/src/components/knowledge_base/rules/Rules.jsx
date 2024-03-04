import { useState } from "react";
import ThemedContainer from "../../../utils/ThemedContainer";
import NFFormulaEditor from "../../../utils/formula_editor/NFFormulaEditor";

export default () => {
    const [v, setV] = useState();
    return <NFFormulaEditor value={v} onChange={setV} />;
};
