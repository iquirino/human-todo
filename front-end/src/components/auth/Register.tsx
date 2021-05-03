import { Form, Input } from "antd";
import { CreateUserModel } from "../../models/UserModel";

export type LoginProps = {
  onChange?: (user: CreateUserModel) => void;
};

export const Register = ({ onChange }: LoginProps) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <Form
      {...layout}
      form={form}
      name="register"
      onFieldsChange={(_, fields) => {
        const element: any = {};
        fields.map((e) => {
          element[e.name.toString()] = e.value;
          return element;
        });

        if (onChange)
          onChange({
            username: element.username,
            password: element.password,
            email: element.email,
          });
      }}
    >
      <Form.Item name="username" label="Username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input type="password" />
      </Form.Item>
    </Form>
  );
};
