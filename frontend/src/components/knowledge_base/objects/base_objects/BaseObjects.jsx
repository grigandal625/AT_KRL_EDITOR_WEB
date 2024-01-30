import { selectKbObjects } from "../../../../redux/stores/kbObjectsSlicer";
import KBItemMenuList from "../../../../utils/KBItemMenuList";

export default () => <KBItemMenuList storeSelector={selectKbObjects} />