import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import KBList from "./components/knowledge_base/KBList";
import NotFound from "./components/NotFound";
import About from "./components/About";
import KBLayout from "./components/knowledge_base/KBLayout";
import Types from "./components/knowledge_base/types/Types";
import Objects from "./components/knowledge_base/objects/Objects";
import Rules from "./components/knowledge_base/rules/Rules";
import { Empty } from "antd";
import General from "./components/knowledge_base/general/General";
import TypeEditor from "./components/knowledge_base/types/TypeEditor";
import NewKB from "./components/knowledge_base/NewKB";
import BaseObjectEditor from "./components/knowledge_base/objects/base_objects/BaseObjectEditor";
import BaseObjects from "./components/knowledge_base/objects/base_objects/BaseObjects";
import Intervals from "./components/knowledge_base/objects/intervals/Intervals";
import Events from "./components/knowledge_base/objects/events/Events";
import EventEditor from "./components/knowledge_base/objects/events/EventEditor";
import IntervalEditor from "./components/knowledge_base/objects/intervals/IntervalEditor";
import RuleEditor from "./components/knowledge_base/rules/RuleEditor";
import Upload from "./components/knowledge_base/Upload";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="" element={<PageLayout />} errorElement={<NotFound />}>
            <Route path="" element={<About />} />
            <Route path="knowledge_bases">
                <Route loader={() => Object({ menuItem: "knowledge_bases" })} path="" element={<KBList />} />
                <Route loader={() => Object({ menuItem: "new" })} id="new" path="new" element={<NewKB />} />
                <Route path=":id" element={<KBLayout />} loader={() => Object({ menuItem: "knowledge_bases" })}>
                    <Route path="" element={<General />} loader={() => Object({ kbTab: "general" })} />
                    <Route element={<Types />} loader={() => Object({ kbTab: "types" })} path="types">
                        <Route path="" element={<Empty description="Выберите тип для редактирования" />}></Route>
                        <Route path=":typeId" element={<TypeEditor />} />
                    </Route>
                    <Route element={<Objects />} loader={() => Object({ kbTab: "objects" })} path="objects">
                        <Route path="base_objects" element={<BaseObjects />} loader={() => Object({ kbTab: "base_objects" })}>
                            <Route path="" element={<Empty description="Выберите объект для редактирования" />}></Route>
                            <Route path=":objectId" element={<BaseObjectEditor />} />
                        </Route>
                        <Route path="intervals" element={<Intervals />} loader={() => Object({ kbTab: "intervals" })}>
                            <Route path="" element={<Empty description="Выберите интервал для редактирования" />}></Route>
                            <Route path=":intervalId" element={<IntervalEditor />} />
                        </Route>
                        <Route path="events" element={<Events />} loader={() => Object({ kbTab: "events" })}>
                            <Route path="" element={<Empty description="Выберите событие для редактирования" />}></Route>
                            <Route path=":eventId" element={<EventEditor />} />
                        </Route>
                    </Route>
                    <Route element={<Rules />} loader={() => Object({ kbTab: "rules" })} path="rules">
                        <Route path="" element={<Empty description="Выберите правило для редактирования" />}></Route>
                        <Route path=":ruleId" element={<RuleEditor />} />
                    </Route>
                </Route>
                <Route loader={() => Object({ menuItem: "upload" })} path="upload" element={<Upload />} />
            </Route>
        </Route>
    )
);

export default () => <RouterProvider router={router} />;
