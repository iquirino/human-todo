import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, PageHeader, Row } from "antd";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { registerAction } from "../../actions/AuthActions";
import { Register } from "../../components/auth/Register";
import { CreateUserModel } from "../../models/UserModel";
import { useAppDispatch } from "../../redux/hooks";

export const RegisterScreen = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const [data, setData] = useState<CreateUserModel>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleRegisterClick = () => {
    if (data) {
      dispatch(registerAction(data))
        .then(unwrapResult)
        .then((result) => {
          history.push("/login");
        })
        .catch((err) => {
          setErrorMessage(err);
        });
    }
  };
  return (
    <>
      <PageHeader title="Register" />
      <Row justify="center">
        <Col>
          <Row justify="center">{errorMessage}</Row>
          <Row justify="center">
            <Register onChange={(user) => setData(user)} />
          </Row>
          <Row justify="end">
            <Button.Group>
              <Button>
                <Link to="/login">Login</Link>
              </Button>
              <Button onClick={handleRegisterClick}>Register</Button>
            </Button.Group>
          </Row>
        </Col>
      </Row>
    </>
  );
};
