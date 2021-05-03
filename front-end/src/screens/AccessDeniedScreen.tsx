import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export const AccessDeniedScreen = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you dont have permission to access this page."
      extra={
        <Button type="primary">
          <Link to="/">Back Home</Link>
        </Button>
      }
    />
  );
};
