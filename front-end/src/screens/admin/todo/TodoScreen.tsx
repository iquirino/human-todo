import {
  Button,
  Col,
  Divider,
  Empty,
  List,
  Modal,
  PageHeader,
  Popconfirm,
  Result,
  Row,
  Tooltip,
  Typography,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { TaskDetail } from "../../../components/tasks/TaskDetail";
import { Link, useHistory, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { CreateTaskModel, TaskModel } from "../../../models/TaskModel";
import moment from "moment";
import {
  addTaskAction,
  updateTaskAction,
  deleteTaskAction,
} from "../../../actions/TaskActions";
import {
  deleteProjectAction,
  updateProjectAction,
} from "../../../actions/ProjectActions";
import { CreateProjectModel, ProjectModel } from "../../../models/ProjectModel";
import { ProjectDetail } from "../../../components/projects/ProjectDetail";

export const TodoScreen = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { project: projectKey } = useParams<{ project: string }>();

  const project = useAppSelector((state) =>
    state.app.data.projects?.find((p) => p.key === projectKey)
  );
  const tasks = useAppSelector((state) =>
    state.app.data.tasks.filter(
      (p) =>
        (p.projectKey === projectKey || p.projectId === project?.id) &&
        !p.deleted
    )
  );

  const [editingProject, setEditingProject] = useState<CreateProjectModel>();
  const [isProjectValid, setIsProjectValid] = useState(false);
  const [isEditProjectModalVisible, setIsEditProjectModalVisible] = useState(
    false
  );

  const handleOpenEditProject = () => {
    setIsEditProjectModalVisible(true);
  };
  const handleCloseEditProject = () => {
    setIsEditProjectModalVisible(false);
  };

  const handleProjectChanged = ([data, isValid]: [
    CreateProjectModel,
    boolean
  ]) => {
    setEditingProject(data);
    setIsProjectValid(isValid);
  };

  const handleEditProject = (): boolean => {
    if (isProjectValid && project && editingProject) {
      dispatch(
        updateProjectAction({
          ...project,
          name: editingProject.name,
        })
      ).then((action: any) => {
        if (action.payload.key !== project.key) {
          history.push("/todo/" + action.payload.key);
        }
      });
      handleCloseEditProject();
      return true;
    }
    return false;
  };

  const addTask = (task: CreateTaskModel) => {
    const taskToAdd: TaskModel = {
      key: projectKey + "_" + Math.floor(Math.random() * 100000000),
      id: task.id,
      projectId: task.projectId,
      projectKey: projectKey,
      description: task.description,
      finishedDate: task.finishedDate,
      plannedFinishDate: task.plannedFinishDate,
      finished: task.finished,
      deleted: task.deleted,
      createdOn: task.createdOn,
      updatedOn: task.updatedOn,
      syncronized: false,
    };

    dispatch(addTaskAction(taskToAdd));
  };

  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [newTask, setNewTask] = useState<TaskModel>();
  const [isNewTaskValid, setIsNewTaskValid] = useState(false);

  const hanldeOpenAddTask = () => {
    setIsAddTaskModalVisible(true);
  };
  const handleCloseAddTask = () => {
    setIsAddTaskModalVisible(false);
  };

  const handleNewTaskChanged = ([data, isValid]: [
    { description: string; finishDate?: Date },
    boolean
  ]) => {
    setNewTask({
      key: "",
      projectKey: "",
      plannedFinishDate: data.finishDate,
      description: data.description,
      finished: false,
      syncronized: false,
      deleted: false,
      createdOn: new Date(),
    });
    setIsNewTaskValid(isValid);
  };

  const handleAddTask = (): boolean => {
    if (isNewTaskValid && newTask) {
      addTask(newTask);
      setNewTask(undefined);
      setIsAddTaskModalVisible(false);
      setIsNewTaskValid(false);
      return true;
    }
    return false;
  };

  const completeTask = (task: TaskModel) => {
    dispatch(
      updateTaskAction({ ...task, finished: true, finishedDate: new Date(), updatedOn: new Date() })
    );
  };

  const handleDeleteProject = () => {
    if (project) {
      dispatch(deleteProjectAction(project));
      history.push("/");
    }
  };

  const handleDeleteTask = (task: TaskModel) => {
    dispatch(deleteTaskAction(task));
  };

  if (!project)
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

  return (
    <>
      <PageHeader
        title="Project"
        subTitle={project.name}
        extra={[
          <Popconfirm
            key="confirm-delete-project"
            title="Are you sure to delete this project?"
            onConfirm={handleDeleteProject}
            //onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
              key="btn-delete-project"
              icon={<DeleteOutlined />}
              type="primary"
              danger
            >
              Delete
            </Button>
          </Popconfirm>,
          <Button
            key="btn-edit-project"
            icon={<EditOutlined />}
            type="primary"
            onClick={handleOpenEditProject}
          >
            Edit
          </Button>,
          <Button
            key="btn-add-task"
            icon={<PlusOutlined />}
            type="primary"
            onClick={hanldeOpenAddTask}
          >
            Task
          </Button>,
        ]}
      />
      <Divider orientation="left">Tasks</Divider>
      {tasks && tasks.length > 0 ? (
        <List bordered>
          {tasks.map((task) => (
            <List.Item
              key={"project-" + project.key + "-task-" + (task.id || task.key)}
              actions={
                task.finished
                  ? []
                  : [
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => completeTask(task)}
                      >
                        DONE
                      </Button>,
                      <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => handleDeleteTask(task)}
                      >
                        <Button
                          className="remove-todo-button"
                          type="primary"
                          danger
                          size="small"
                        >
                          X
                        </Button>
                      </Popconfirm>,
                    ]
              }
            >
              <Typography.Text delete={task.finished}>
                {task.description}
              </Typography.Text>
              {!task.finished ? (
                <Typography.Text>
                  {!task.finished &&
                    moment(task.plannedFinishDate || task.updatedOn || task.createdOn).fromNow()}
                </Typography.Text>
              ) : (
                <Tooltip title={moment(task.finishedDate).fromNow()}>
                  <Typography.Text>Completed</Typography.Text>
                </Tooltip>
              )}
            </List.Item>
          ))}
        </List>
      ) : (
        <Row justify="center">
          <Col>
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 60,
              }}
              description={<span>Looks like you don't have a Task</span>}
            >
              <Button type="primary" onClick={hanldeOpenAddTask}>
                Create Now
              </Button>
            </Empty>
          </Col>
        </Row>
      )}

      <Modal
        key="new-task-modal"
        title="Create new task"
        visible={isAddTaskModalVisible}
        destroyOnClose={true}
        okText="Add"
        onOk={handleAddTask}
        onCancel={handleCloseAddTask}
        okButtonProps={{ disabled: !isNewTaskValid }}
      >
        <TaskDetail
          projectKey={projectKey}
          onChange={handleNewTaskChanged}
          onSubmit={handleAddTask}
        />
      </Modal>

      <Modal
        key="edit-project-modal"
        title="Edit project"
        visible={isEditProjectModalVisible}
        destroyOnClose={true}
        okText="Update"
        onOk={handleEditProject}
        onCancel={handleCloseEditProject}
        okButtonProps={{ disabled: !isProjectValid }}
      >
        <ProjectDetail
          initial={project}
          onChange={handleProjectChanged}
          onSubmit={handleEditProject}
        />
      </Modal>
    </>
  );
};
