import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, PageHeader, Row } from "antd";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { loginAction } from "../../actions/AuthActions";
import { Login } from "../../components/auth/Login";
import { useAppDispatch } from "../../redux/hooks";

export const LoginScreen = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const [data, setData] = useState<{ username: string; password: string }>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleLoginClick = () => {
    if (data) {
      dispatch(loginAction(data))
        .then(unwrapResult)
        .then((result) => {
          history.push("/");
        })
        .catch((err) => {
          setErrorMessage(err);
        });
    }
  };
  return (
    <>
      <PageHeader title="Login" />
      <Row justify="center">
        <Col>
          <Row justify="center">{errorMessage}</Row>
          <Row justify="center">
            <Login
              onChange={(username, password) => setData({ username, password })}
            />
          </Row>
          <Row justify="end">
            <Button.Group>
              <Button>
                <Link to="/register">Register</Link>
              </Button>
              <Button onClick={handleLoginClick}>Login</Button>
            </Button.Group>
          </Row>
        </Col>
      </Row>
    </>
  );
};
