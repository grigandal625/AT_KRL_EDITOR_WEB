import { selectkbEvents } from "../../../../redux/stores/kbEventsSlicer";
import KBItemMenuList from "../../../../utils/KBItemMenuList";

export default () => <KBItemMenuList storeSelector={selectkbEvents} />;
