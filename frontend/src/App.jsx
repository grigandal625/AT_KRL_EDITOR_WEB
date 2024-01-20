import {
    createBrowserRouter,
    RouterProvider,
    Route,
    createRoutesFromElements,
    Navigate,
    useParams,
} from "react-router-dom";
import PageLayout from "./components/PageLayout";
import KBList from "./components/knowledge_base/KBList";
import NotFound from "./components/NotFound";
import About from "./components/About";
import KBLayout from "./components/knowledge_base/KBLayout";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="" element={<PageLayout />} errorElement={<NotFound />}>
            <Route path="" element={<About />} />
            <Route path="knowledge_bases">
                <Route loader={() => Object({ menuItem: "knowledge_bases" })} path="" element={<KBList />} />
                <Route loader={() => Object({ menuItem: "new" })} id="new" path="new" />
                <Route path=":id" element={<KBLayout />} loader={() => Object({ menuItem: "knowledge_bases" })}>
                    <Route loader={() => Object({ kbTab: "types" })} path="types" />
                    <Route loader={() => Object({ kbTab: "objects" })} path="objects" />
                    <Route loader={() => Object({ kbTab: "rules" })} path="rules" />
                </Route>
                <Route loader={() => Object({ menuItem: "upload" })} path="upload" />
            </Route>
        </Route>
    )
);

export default () => <RouterProvider router={router} />;
