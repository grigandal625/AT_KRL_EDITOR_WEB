import KBItemMenuList from "../../../utils/KBItemMenuList";
import { selectKbTypes } from "../../../redux/stores/kbTypesSlicer";

export default () => <KBItemMenuList storeSelector={selectKbTypes} />;
