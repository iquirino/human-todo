import { useState } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  BarsOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import "./AdminLayout.css";
import logo from "../logo.png";
import { Link, useLocation } from "react-router-dom";
import { ProjectModel } from "../models/ProjectModel";
import { Location } from "history";

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

type AdminLayoutProps = {
  projects: Readonly<ProjectModel[]>;
  onLogout?: () => void;
  children: any;
};

export const AdminLayout = ({ children, projects, onLogout }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  let activeKey: string[] = getActiveKeys(location);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggle}>
        <div className={collapsed ? "logo collapsed" : "logo"}>
          <img src={logo} alt="My Todo App" />
          {collapsed ? "" : "My Todo App"}
        </div>
        <Menu
          openKeys={["todo"]}
          defaultOpenKeys={[activeKey[0]]}
          selectedKeys={[...activeKey]}
          theme="dark"
          mode="inline"
        >
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          {projects && projects.length > 0 && (
            <SubMenu key="todo" icon={<BarsOutlined />} title="Tasks">
              {projects.map((project) => (
                <Menu.Item key={"todo-" + project.key}>
                  <Link to={"/todo/" + project.key}>{project.name}</Link>
                </Menu.Item>
              ))}
            </SubMenu>
          )}
          {onLogout && (
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={onLogout}>
              Logout
            </Menu.Item>
          )}
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>{children}</Content>
        <Footer style={{ textAlign: "center" }}>
          My Todo List - By Igor Quirino da Silva
        </Footer>
      </Layout>
    </Layout>
  );
};

const getActiveKeys = (location: Location) => {
  let activeKey: string[] = [location.pathname.replaceAll("/", "-")];
  if (activeKey[0].startsWith("-")) activeKey[0] = activeKey[0].substr(1);
  if (activeKey[0] === "") activeKey[0] = "home";
  if (activeKey[0].startsWith("todo")) {
    activeKey[1] = activeKey[0];
    activeKey[0] = "todo";
  }
  return activeKey;
};
