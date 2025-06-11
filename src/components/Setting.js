import {
  Drawer,
  Space,
  Button,
  theme,
  Form,
  Cascader,
  Checkbox,
  Radio,
  Switch,
  Modal,
  message,
  Tooltip,
} from "antd";
import datalist from "../data/dataConfig.json";
import { indexToBook } from "../utils/data";
const { useToken } = theme;
const formStyle = {
  labelCol: { span: 6 },
  wrapperCol: { span: 10 },
  style: { maxWidth: 600 },
};

const convertValue = (data) => {
  return { ...data, book: data.book[1] };
};
const loadLocalStore = () => {
  let setting = localStorage.getItem("setting");
  let list = localStorage.getItem("list");
  let record = localStorage.getItem("record");
  let current = localStorage.getItem("current");
  if (setting && list && record) {
    setting = JSON.parse(setting);
    list = JSON.parse(list);
    record = new Map(JSON.parse(record));
    current = JSON.parse(current);
    return { setting, list, record, current };
  } else {
    message.error("本地进度不存在或已损坏 ");
    return { setting: null, list: null, record: null, current: null };
  }
};

export const Setting = (props) => {
  const token = useToken();
  const displayRender = (labels) => labels[labels.length - 1]; // Just show the latest item.
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const infoConfig = {
    title: "提示",
    content: (
      <>
        <div>切换书本或章节会导致正在进行的任务中断</div>
        <div>是否继续？</div>
      </>
    ),
    onOk: () => {
      props.setSetting(convertValue(form.getFieldsValue()));
      props.setShowSetting(false);
      props.setIsRunning(false);
      props.setList([]);
    },
    onCancel: () => {
      form.setFieldsValue({
        ...props.setting,
        book: [indexToBook(props.setting.book), props.setting.book],
      });
    },
  };

  const onFinish = (values) => {
    values = convertValue(values);
    if (props.isRunning) {
      //比较新旧设置
      if (
        JSON.stringify(props.setting.book) !== JSON.stringify(values.book) ||
        JSON.stringify(props.setting.part.length) !==
          JSON.stringify(values.part.length) ||
        JSON.stringify(props.setting.mode) !== JSON.stringify(values.mode)
      ) {
        modal.confirm(infoConfig);
      } else {
        props.setShowSetting(false);
      }
    } else {
      console.log("apply new setting");
      props.setSetting(values);
      props.setShowSetting(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Drawer
      title="设置"
      placement="right"
      closable={false}
      maskClosable={false}
      open={props.showSetting}
      width={420}
      extra={
        <Space>
          <Button
            type="primary"
            onClick={() => {
              form.submit();
              // props.setShowSetting(false);
            }}
          >
            确定
          </Button>
        </Space>
      }
      style={{
        color: token.token.colorText,
      }}
    >
      <Form
        name="basic"
        form={form}
        {...formStyle}
        initialValues={props.setting}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="书本"
          name="book"
          rules={[
            {
              type: "array",
              required: true,
              message: "请选择书本",
            },
          ]}
        >
          <Cascader
            options={datalist}
            displayRender={displayRender}
            expandTrigger="hover"
            style={{ width: "16rem" }}
          />
        </Form.Item>
        <Form.Item
          label="部分"
          name="part"
          rules={[
            {
              required: true,
              message: "请选择部分",
            },
          ]}
        >
          <Checkbox.Group>
            <Space direction="vertical">
              <Checkbox value={0}>子部分1</Checkbox>
              <Checkbox value={1}>子部分2</Checkbox>
              <Checkbox value={2}>子部分3</Checkbox>
              <Checkbox value={3}>子部分4</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          label="模式"
          name="mode"
          rules={[
            {
              required: true,
              message: "请选择模式",
            },
          ]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={0}>顺序</Radio.Button>
            <Radio.Button value={1}>随机</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="自动保存"
          name="autoSave"
          valuePropName="checked"
          extra="自动保存进度"
          rules={[
            {
              required: true,
              message: "请选择是否需要自动保存",
            },
          ]}
        >
          <Switch></Switch>
        </Form.Item>
      </Form>
      <Tooltip placement="right" title="仅当未开始检测时可用">
        <Button
          disabled={props.isRunning}
          onClick={() => {
            let { setting, list, record, current } = loadLocalStore();
            console.log(setting, list, record, current);
            if (setting && list && record && current) {
              props.setSetting(setting);
              props.setList(list);
              props.setRecord(record);
              props.setCurrent(current);
              props.setShowSetting(false);
              props.setIsRunning(true);
              form.setFieldsValue({
                ...setting,
                book: [indexToBook(setting.book), setting.book],
              });
            }
          }}
        >
          加载之前的进度
        </Button>
      </Tooltip>
      <br />
      <br />
      <Button
        onClick={() => {
          localStorage.clear();
          message.success("清除成功");
        }}
      >
        删除保存的进度
      </Button>
      {contextHolder}
      <div
        style={{
          position: "absolute",
          bottom: "3%",
        }}
      >
        <span>刷题器框架 By </span>
        <a href="https://github.com/ADSR1042">
          ADSR
        </a>
      </div>
    </Drawer>
  );
};
