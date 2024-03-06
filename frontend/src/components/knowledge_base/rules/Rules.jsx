import { useState } from "react";
import ThemedContainer from "../../../utils/ThemedContainer";
import NFFormulaEditor from "../../../utils/formula_editor/NFFormulaEditor";
import { selectkbRules } from "../../../redux/stores/kbRulesSlicer";
import KBItemMenuList from "../../../utils/KBItemMenuList";

export default () => <KBItemMenuList storeSelector={selectkbRules} />
