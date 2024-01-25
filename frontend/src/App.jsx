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

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="" element={<PageLayout />} errorElement={<NotFound />}>
            <Route path="" element={<About />} />
            <Route path="knowledge_bases">
                <Route loader={() => Object({ menuItem: "knowledge_bases" })} path="" element={<KBList />} />
                <Route loader={() => Object({ menuItem: "new" })} id="new" path="new" />
                <Route path=":id" element={<KBLayout />} loader={() => Object({ menuItem: "knowledge_bases" })}>
                    <Route path="" element={<General />} loader={() => Object({ kbTab: "general" })} />
                    <Route element={<Types />} loader={() => Object({ kbTab: "types" })} path="types">
                        <Route path="" element={<Empty description="Выберите тип для редактирования" />}></Route>
                        <Route path=":typeId" element={<TypeEditor />} />
                    </Route>
                    <Route element={<Objects />} loader={() => Object({ kbTab: "objects" })} path="objects" />
                    <Route element={<Rules />} loader={() => Object({ kbTab: "rules" })} path="rules" />
                </Route>
                <Route loader={() => Object({ menuItem: "upload" })} path="upload" />
            </Route>
        </Route>
    )
);

export default () => <RouterProvider router={router} />;