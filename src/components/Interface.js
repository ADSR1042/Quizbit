import { Button, Result } from "antd";
import { LeftOutlined, RightOutlined, SmileOutlined } from "@ant-design/icons";
import { MultipleChoice, SingleChoice } from "./Options.js";
import { getData } from "../utils/data.js";
import { useEffect } from "react";
const [incomplete,] = [0, 1, 2];
const InitalInterface = (props) => {
  return (
    <>
      <Result
        icon={<SmileOutlined />}
        title="点击按钮开始测试"
        extra={
          <Button type="primary" onClick={props.start}>
            Go!
          </Button>
        }
      />
    </>
  );
};
const Interface = (props) => {
  //listen keyboard event
  useEffect(() => {
    window.addEventListener("keydown", onkeydown);
    return () => {
      window.removeEventListener("keydown", onkeydown);
    };
  });
  const onkeydown = (e) => {
    console.log(e.key);
    if (props.isRunning) {
      switch (e.key) {
        case "[":
          props.prev();
          break;
        case "]":
          props.next();
          break;
        default:
          break;
      }
    }
  };
  return !props.isRunning ? (
    <InitalInterface start={props.start} />
  ) : (
    <>
      <b>{getData(...props.index).Answer.length === 1 ? "单选" : "多选"}</b>
      <div
        style={{
          margin: "12px 2vw 20px",
          lineHeight: "1.3rem",
          height: "130px",
          overflow: "auto",
          fontSize: "medium",
        }}
      >
        {getData(...props.index).Description}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 2vw",
        }}
      >
        <Button
          size="large"
          icon={<LeftOutlined />}
          shape="circle"
          style={{ margin: "0 2vw 0 0" }}
          onClick={props.prev}
        />
        <div
          style={{
            display:
              getData(...props.index).Answer.length === 1 ? "none" : "block",
          }}
        >
          <MultipleChoice
            choice={getData(...props.index).Choice}
            answer={props.answer}
            setAnswer={props.setAnswer}
            key={getData(...props.index).Choice}
            choiceState={props.choiceState}
          />
        </div>
        <div
          style={{
            display:
              getData(...props.index).Answer.length === 1 ? "block" : "none",
          }}
        >
          <SingleChoice
            choice={getData(...props.index).Choice}
            answer={props.answer}
            setAnswer={props.setAnswer}
            choiceState={props.choiceState}
            key={getData(...props.index)}
          />
        </div>
        <Button
          size="large"
          icon={<RightOutlined />}
          shape="circle"
          style={{ margin: "0 0 0 2vw" }}
          onClick={props.next}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "4px 0",
        }}
      >
        <Button type="primary" onClick={props.handleCheck}>检查</Button>
      </div>

      <div
        style={{
          margin: "12px 2vw 48px",
          lineHeight: "1.3rem",
          height: "180px",
          overflow: "auto",
          visibility:
            props.record === incomplete || props.record === undefined
              ? "hidden"
              : "visible",
        }}
      >
        {getData(...props.index).Analysis}
      </div>
    </>
  );
};
export default Interface;
