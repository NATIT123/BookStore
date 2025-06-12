import {
  Button,
  Divider,
  Form,
  Input,
  message,
  notification,
  Select,
} from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { callRegister } from "../../services/api";
import "./register.scss";
import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";

const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values) => {
    const { name, email, password, phone, gender, address, age } = values;
    setIsSubmit(true);
    const res = await callRegister(
      name,
      email,
      password,
      phone,
      gender,
      address,
      age
    );
    setIsSubmit(false);
    if (res?.data?._id) {
      message.success("Đăng ký tài khoản thành công!");
      navigate("/login");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Tích hợp Google OAuth ở đây
    message.info("Google login chưa được tích hợp.");
  };

  const handleFacebookLogin = () => {
    // TODO: Tích hợp Facebook OAuth ở đây
    message.info("Facebook login chưa được tích hợp.");
  };

  return (
    <div className="register-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Đăng Ký Tài Khoản</h2>
              <Divider />
            </div>
            <Form name="basic" onFinish={onFinish} autoComplete="off">
              <Form.Item
                labelCol={{ span: 24 }}
                label="Họ tên"
                name="name"
                rules={[
                  { required: true, message: "Họ tên không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }}
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }}
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }}
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Số điện thoại không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }}
                label="Giới tính"
                name="gender"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }}
                label="Địa chỉ"
                name="address"
                rules={[
                  { required: true, message: "Địa chỉ không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }}
                label="Tuổi"
                name="age"
                rules={[
                  { required: true, message: "Tuổi không được để trống!" },
                ]}
              >
                <Input type="number" min={1} max={100} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                  Đăng ký
                </Button>
              </Form.Item>

              <Divider>Hoặc</Divider>

              <Button
                icon={<GoogleOutlined />}
                style={{ width: "100%", marginBottom: "10px" }}
                onClick={handleGoogleLogin}
              >
                Đăng nhập bằng Google
              </Button>

              <Button
                icon={<FacebookOutlined />}
                style={{
                  width: "100%",
                  backgroundColor: "#1877f2",
                  color: "#fff",
                }}
                onClick={handleFacebookLogin}
              >
                Đăng nhập bằng Facebook
              </Button>

              <Divider />
              <p className="text text-normal">
                Đã có tài khoản?
                <span>
                  <Link to="/login"> Đăng Nhập </Link>
                </span>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
