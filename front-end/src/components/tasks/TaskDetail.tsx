import { DatePicker, Form, Input } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { CreateTaskModel } from "../../models/TaskModel";

export type TaskDetailProps = {
  projectKey: string;
  onChange?: (data: [CreateTaskModel, boolean]) => void;
  onSubmit?: () => void;
};

export const TaskDetail = ({ projectKey, onChange, onSubmit }: TaskDetailProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.getFieldInstance("description").focus();
  }, []);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onPressEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (onSubmit) onSubmit();
    }
  };

  return (
    <Form
      {...layout}
      form={form}
      name="new-task"
      onFieldsChange={(_, fields) => {
        const element: any = {};
        fields.map((e) => {
          element[e.name.toString()] = e.value;
          return element;
        });

        if (onChange)
          onChange([
            {
              projectKey,
              projectId: undefined,
              description: element.description,
              plannedFinishDate: element.date,
              finished: false,
              syncronized: false,
              deleted: false,
              createdOn: new Date(),
            },
            !fields.some((f) => f.errors && f.errors.length > 0),
          ]);
      }}
    >
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input onKeyDown={onPressEnter} />
      </Form.Item>
      <Form.Item name="date" label="Finish date">
        <DatePicker
          disabledDate={(d) => !d || d.isBefore(moment().subtract(1, "day"))}
        />
      </Form.Item>
    </Form>
  );
};
