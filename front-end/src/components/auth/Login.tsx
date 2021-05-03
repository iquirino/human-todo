import { Form, Input } from "antd";

export type LoginProps = {
  onChange?: (username: string, password: string) => void;
};

export const Login = ({ onChange }: LoginProps) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <Form
      {...layout}
      form={form}
      name="login"
      onFieldsChange={(_, fields) => {
        const element: any = {};
        fields.map((e) => {
          element[e.name.toString()] = e.value;
          return element;
        });

        if (onChange) onChange(element.username, element.password);
      }}
    >
      <Form.Item name="username" label="Username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password">
        <Input type="password" />
      </Form.Item>
    </Form>
  );
};
