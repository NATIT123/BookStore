import { Button, Col, Form, Input, Row, theme } from "antd";

const InputSearch = (props) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values) => {
    let query = "";
    //build query
    if (values.fullName) {
      query += `&name=/${values.fullName}/i`;
    }
    if (values.email) {
      query += `&email=/${values.email}/i`;
    }

    if (values.phone) {
      query += `&phone=/${values.phone}/i`;
    }

    if (query) {
      props.handleSearch(query);
    }

    //remove undefined
    // https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object
    // Object.keys(values).forEach(key => {
    //     if (values[key] === undefined) {
    //         delete values[key];
    //     }
    // });

    // if (values && Object.keys(values).length > 0) {
    //     // https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
    //     const params = new URLSearchParams(values).toString();
    //     props.handleSearch(params);
    // }
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item labelCol={{ span: 24 }} name={`fullName`} label={`Name`}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item labelCol={{ span: 24 }} name={`email`} label={`Email`}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={`phone`}
            label={`Số điện thoại`}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => {
              form.resetFields();
              props.setFilter("");
            }}
          >
            Clear
          </Button>
          {/* <a
                        style={{ fontSize: 12 }}
                        onClick={() => {
                            setExpand(!expand);
                        }}
                    >
                        {expand ? <UpOutlined /> : <DownOutlined />} Collapse
                    </a> */}
        </Col>
      </Row>
    </Form>
  );
};

export default InputSearch;
