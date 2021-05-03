import { BrowserRouter as Router } from "react-router-dom";
import { useNetwork } from "ahooks";
import { useAppSelector } from "./redux/hooks";
import { PublicScreen } from "./screens/public/PublicScreen";
import { AdminScreen } from "./screens/admin/AdminScreen";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { actions } from "./redux/slices";

function App() {
  const dispatch = useDispatch();
  const { online } = useNetwork();
  const auth = useAppSelector((state) => state.app.data.auth);

  useEffect(() => {
    if (online !== undefined) dispatch(actions.updateNetwork(online));
  }, [online, dispatch]);

  return (
    <>
      <Router>{auth.isLoggedIn ? <AdminScreen /> : <PublicScreen />}</Router>
    </>
  );
}

export default App;
