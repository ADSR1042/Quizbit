import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Layout, Button, theme, Collapse, Empty } from "antd";
import { useState } from "react";
const { Sider } = Layout;
const { useToken } = theme;
const [select, , pass, error] = [-1, 0, 1, 2];
const { Panel } = Collapse;
const ListButton = (props) => {
  const token = useToken();
  const defaultStyle = {
    border: "1px solid" + token.token.colorBorder,
    color: token.token.colorText,
    backgroundColor: token.token.colorFillTertiary,
  };
  const selectStyle = {
    border: "1px solid" + token.token.colorInfoBorder,
    color: token.token.colorInfo,
    backgroundColor: token.token.colorInfoBg,
  };
  const successStyle = {
    border: "1px solid" + token.token.colorSuccessBorder,
    color: token.token.colorSuccess,
    backgroundColor: token.token.colorSuccessBg,
  };
  const errorStyle = {
    border: "1px solid" + token.token.colorErrorBorder,
    color: token.token.colorError,
    backgroundColor: token.token.colorErrorBg,
  };
  const buttonStyle =
    props.state === select
      ? selectStyle
      : props.state === pass
        ? successStyle
        : props.state === error
          ? errorStyle
          : defaultStyle;
  return (
    <div
      style={{ display: "inline" }}
      onClick={() => {
        props.setCurrent(props.index);
      }}
    >
      <div
        style={{
          ...buttonStyle,
          width: "1.4rem",
          height: "1.4rem",
          margin: "0.2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "0.4rem",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
const spiltGroup = (list) => {
  let value = [
    { start: 0, end: 0 ,empty: true},
    { start: 0, end: 0 ,empty: true},
    { start: 0, end: 0 ,empty: true},
    { start: 0, end: 0 ,empty: true},
  ];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < list.length; j++) {
      if (list[j][1] === i) {
        value[i].start = j;
        value[i].empty = false
        break;
      }
    }
  }
  for (let i = 0; i < 4; i++) {
    for (let j = list.length - 1; j >= 0; j--) {
      if (list[j][1] === i) {
        value[i].end = j;
        break;
      }
    }
  }
  return value;
};
const ButtonList = (props) => {
  let group = spiltGroup(props.list);
  let start = group[props.id].start;
  let end = group[props.id].end;
  if (
    props.list === undefined ||
    props.list.length === 0 ||
    group[props.id].empty
  ) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="空 ~" />;
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {props.list.slice(start, end + 1).map((item, index) => (
        <ListButton
          state={
            props.list.indexOf(item) === props.current
              ? select
              : props.record.get(props.list.indexOf(item))
          }
          index={props.list.indexOf(item)}
          setCurrent={props.setCurrent}
          key={props.list.indexOf(item)}
          setChoiceState={props.setChoiceState}
        >
          {index + 1}
        </ListButton>
      ))}
    </div>
  );
};

export const SiderCustom = (props) => {
  const token = useToken();
  const [collapsed, setCollapsed] = useState(false);
  const pannelStyle = {
    backgroundColor: token.token.colorBgContainer,
    borderRadius: token.token.borderRadiusLG,
    marginBottom: "24px",
  };
  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme={props.isDark ? "dark" : "light"}
        collapsedWidth={0}
        width={300}
        trigger={null}
        style={{
          backgroundColor: token.token.colorFillQuaternary,
          height: "90vh",
          overflow: "auto",
        }}
      >
        <div style={{ visibility: collapsed ? "hidden" : null }}>
          <Collapse
            defaultActiveKey={[1, 2, 3, 4]}
            style={{
              margin: "10px",
              backgroundColor: "rgb(0,0,0,0)",
            }}
            bordered={false}
          >
            <Panel header="子部分1" key={1} style={pannelStyle}>
              <ButtonList
                list={props.list}
                record={props.record}
                id={0}
                current={props.current}
                setCurrent={props.setCurrent}
              />
            </Panel>
            <Panel header="子部分2" key={2} style={pannelStyle}>
              <ButtonList
                list={props.list}
                record={props.record}
                id={1}
                current={props.current}
                setCurrent={props.setCurrent}
              />
            </Panel>
            <Panel header="子部分3" key={3} style={pannelStyle}>
              <ButtonList
                list={props.list}
                record={props.record}
                id={2}
                current={props.current}
                setCurrent={props.setCurrent}
              />
            </Panel>
            <Panel header="子部分4" key={4} style={pannelStyle}>
              <ButtonList
                list={props.list}
                record={props.record}
                id={3}
                current={props.current}
                setCurrent={props.setCurrent}
              />
            </Panel>
          </Collapse>
        </div>
      </Sider>
      <Button
        shape="circle"
        style={{
          position: "absolute",
          top: "50%",
          left: collapsed ? 0 : 288,
        }}
        size="small"
        icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
        onClick={() => setCollapsed(!collapsed)}
      />
    </>
  );
};
