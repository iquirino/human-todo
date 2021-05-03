import { Button, PageHeader } from "antd";
import { Link } from "react-router-dom";

export const HomeScreen = () => {
  return (
    <>
      <PageHeader title="Home" />
      <Button>
        <Link to="/login">Login</Link>
      </Button>
      <Button>
        <Link to="/register">Register</Link>
      </Button>
    </>
  );
};
