import { selectkbIntervals } from "../../../../redux/stores/kbIntervalsSlicer";
import KBItemMenuList from "../../../../utils/KBItemMenuList";

export default () => <KBItemMenuList storeSelector={selectkbIntervals} />;
