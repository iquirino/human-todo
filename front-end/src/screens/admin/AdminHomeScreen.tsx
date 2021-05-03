import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Empty,
  Modal,
  PageHeader,
  Progress,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addProjectAction } from "../../actions/ProjectActions";
import { ProjectDetail } from "../../components/projects/ProjectDetail";
import { CreateProjectModel, ProjectModel } from "../../models/ProjectModel";
import { useAppSelector } from "../../redux/hooks";
import { sanitizeUrl } from "../../shared/utils";

export const AdminHomeScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    data: { projects, tasks },
  } = useAppSelector((state) => state.app);

  const addProject = (project: CreateProjectModel) => {
    const projectToAdd: ProjectModel = {
      ...project,
      key: sanitizeUrl(project.name),
    };

    dispatch(addProjectAction(projectToAdd));
    return projectToAdd;
  };

  const [isAddProjectModalVisible, setIsAddProjectModalVisible] = useState(
    false
  );
  const [newProject, setNewProject] = useState<CreateProjectModel>();
  const [isNewProjectValid, setIsNewProjectValid] = useState(false);

  const handleOpenAddProject = () => {
    setIsAddProjectModalVisible(true);
  };
  const handleCloseAddProject = () => {
    setIsAddProjectModalVisible(false);
  };

  const handleNewProjectChanged = ([data, isValid]: [
    CreateProjectModel,
    boolean
  ]) => {
    setNewProject(data);
    setIsNewProjectValid(isValid);
  };

  const handleAddProject = (): boolean => {
    if (isNewProjectValid && newProject) {
      const addedProject = addProject(newProject);
      history.push("/todo/" + addedProject.key);
      return true;
    }
    return false;
  };

  return (
    <>
      <PageHeader
        title="Home"
        extra={[
          <Button
            key="3"
            onClick={handleOpenAddProject}
            icon={<PlusOutlined />}
            type="primary"
          >
            Project
          </Button>,
        ]}
      />
      <Divider orientation="left">My Projects</Divider>
      {projects && projects.length > 0 ? (
        <Row justify="center" gutter={20}>
          {projects.map((project, ix) => {
            const projectTasks = tasks.filter(
              (t) => t.projectKey === project.key || t.projectId === project.id
            );
            return (
              <Col key={"project-" + project.key}>
                <Typography>{project.name}</Typography>
                <br />
                <Progress
                  type="circle"
                  percent={
                    (projectTasks.filter((t) => !!t.finished && !t.deleted)
                      .length /
                      projectTasks.filter((t) => !t.deleted).length) *
                    100
                  }
                  width={80}
                  format={() =>
                    projectTasks.filter((t) => !!t.finished && !t.deleted)
                      .length +
                    " / " +
                    projectTasks.filter((t) => !t.deleted).length
                  }
                />
              </Col>
            );
          })}
        </Row>
      ) : (
        <Row justify="center">
          <Col>
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 60,
              }}
              description={<span>Looks like you don't have a Project</span>}
            >
              <Button type="primary" onClick={handleOpenAddProject}>
                Create Now
              </Button>
            </Empty>
          </Col>
        </Row>
      )}

      <Modal
        title="Create new project"
        visible={isAddProjectModalVisible}
        destroyOnClose={true}
        okText="Add"
        onOk={handleAddProject}
        onCancel={handleCloseAddProject}
        okButtonProps={{ disabled: !isNewProjectValid }}
      >
        <ProjectDetail onChange={handleNewProjectChanged} onSubmit={handleAddProject} />
      </Modal>
    </>
  );
};
