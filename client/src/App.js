import React, { Component } from "react";
import "./App.css";
import { Router, Route, Switch } from "react-router-dom";
import history from "./history";
import Login from './components/Login';
import Registration from './components/Registration';
import { Routes } from "./constants/constants";
import Start from "./components/Start";
import Goals from "./components/Goals";
import CreateGoal from "./components/CreateGoal";
import GoalPage from "./components/GoalPage";
import NotFound from "./components/NotFound";
import UserProvider from "./contexts/UserProvider";
import Forgot from "./components/Forgot";
import Reset from "./components/Reset";


class App extends Component {

  render() {
    return (
      <Router history={history}>
        <div className="App">
          <Switch>
            <Route exact path={Routes.register} component={Registration} />
            <Route exact path={Routes.login} component={Login} />
            <Route exact path={Routes.base} component={Start} />
            <Route exact path={Routes.forgot} component={Forgot} />
            <Route path='/reset/:token' component={Reset} />
            <UserProvider>
              <Route exact path={Routes.goals} component={Goals} />
              <Route exact path={Routes.create} component={CreateGoal} />
              <Route path='/goal/:title' component={GoalPage} />
            </UserProvider>
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default App;
