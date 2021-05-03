import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export const NotFoundScreen = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, page not found."
      extra={
        <Button type="primary">
          <Link to="/">Back Home</Link>
        </Button>
      }
    />
  );
};
