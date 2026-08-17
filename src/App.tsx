import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Packages } from "./pages/Packages";
import { Watch } from "./pages/Watch";
import { Work } from "./pages/Work";
import { Capabilities } from "./pages/Capabilities";
import { Process } from "./pages/Process";
import { Questions } from "./pages/Questions";
import { Contact } from "./pages/Contact";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/watch" element={<Watch />} />
        <Route path="/work" element={<Work />} />
        <Route path="/capabilities" element={<Capabilities />} />
        <Route path="/process" element={<Process />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
