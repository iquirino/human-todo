import { Switch, Route } from "react-router-dom";

import { HomeScreen } from "./HomeScreen";
import { LoginScreen } from "./LoginScreen";
import { RegisterScreen } from "./RegisterScreen";

export const PublicScreen = () => {
  return (
    <Switch>
      <Route path="/login">
        <LoginScreen />
      </Route>
      <Route path="/register">
        <RegisterScreen />
      </Route>
      <Route path="/about">About</Route>
      <Route>
        <HomeScreen />
      </Route>
    </Switch>
  );
};
