import { Switch, Route, useHistory } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";
import { notification } from "antd";
import { useDispatch } from "react-redux";

import { AdminLayout } from "../../components/AdminLayout";
import { AdminHomeScreen } from "../../screens/admin/AdminHomeScreen";
import { NotFoundScreen } from "../../screens/NotFoundScreen";
import { TodoScreen } from "../../screens/admin/todo/TodoScreen";
import { useAppSelector } from "../../redux/hooks";
import { syncProjectsAction } from "../../actions/ProjectActions";
import { actions } from "../../redux/slices";
import { syncTasksAction } from "../../actions/TaskActions";

export const AdminScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    data: { projects },
    online,
  } = useAppSelector((state) => state.app);
  const networkInitialized = useRef(false);

  const syncronizeData = useCallback(async () => {
    await dispatch(syncProjectsAction());
    await dispatch(syncTasksAction());
  }, [dispatch]);

  useEffect(() => {
    if (online && !networkInitialized.current) {
      // On page load
      if (online) {
        syncronizeData();
      }

      networkInitialized.current = true;
      return;
    }
    if (!online) {
      const args = {
        message: "You are offline",
        description:
          "You can continue working, we will sincronize when you get online.",
      };
      notification.open(args);
    } else {
      const args = {
        message: "You are online again",
        description: "Syncronizing all tasks",
      };
      notification.open(args);
      syncronizeData();
    }
  }, [online, dispatch, syncronizeData]);

  const handleLogout = () => {
    dispatch(actions.logout());
    history.push("/");
  };

  return (
    <AdminLayout projects={projects} onLogout={handleLogout}>
      <Switch>
        <Route path="/" exact>
          <AdminHomeScreen />
        </Route>
        <Route path="/todo/:project">
          <TodoScreen />
        </Route>
        <Route>
          <NotFoundScreen />
        </Route>
      </Switch>
    </AdminLayout>
  );
};
