import { selectkbIntervals } from "../../../../redux/stores/kbItervalsSlicer";
import KBItemMenuList from "../../../../utils/KBItemMenuList";

export default () => <KBItemMenuList storeSelector={selectkbIntervals} />;
