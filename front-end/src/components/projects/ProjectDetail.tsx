import { Form, Input } from "antd";
import React, { useCallback, useEffect } from "react";
import { CreateProjectModel, ProjectModel } from "../../models/ProjectModel";

export type ProjectDetailProps = {
  initial?: ProjectModel;
  onChange?: (data: [CreateProjectModel, boolean]) => void;
  onSubmit?: () => void;
};

export const ProjectDetail = ({
  onChange,
  onSubmit,
  initial,
}: ProjectDetailProps) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const handleOnChange = useCallback((fields: any[]) => {
    const element: any = {};

    fields.map((e) => {
      element[e.name.toString()] = e.value;
      return element;
    });

    if (onChange) {
      onChange([
        {
          name: element.name,
          syncronized: false,
          deleted: false,
          createdOn: new Date(),
        },
        !fields.some((f) => f.errors && f.errors.length > 0),
      ]);
    }
  }, []);

  useEffect(() => {
    if (initial) {
      form.setFieldsValue({ name: initial.name });
      handleOnChange([{ name: "name", value: initial.name }]);
    }
    form.getFieldInstance("name").focus();
  }, []);

  const onPressEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (onSubmit) onSubmit();
    }
  };

  return (
    <Form
      {...layout}
      form={form}
      name="new-project"
      onFieldsChange={(_, fields) => {
        handleOnChange(fields);
      }}
      onKeyDown={onPressEnter}
    >
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </Form>
  );
};
