import { HashRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";
import { FullSiteTranslator } from "@/utils/translator";

export default function App() {
  return (
    <HashRouter>
      <FullSiteTranslator />
      <AppRoutes />
    </HashRouter>
  );
}
