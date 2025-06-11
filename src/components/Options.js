import { Radio, Checkbox, Typography, theme, Space } from "antd";
import React, { useState, useEffect } from "react";
const { Text } = Typography;
const { useToken } = theme;
const LongText = () => (
  <div style={{ visibility: "hidden", height: "1px" }}>
    超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长
  </div>
);
const [unset, select, success, fail] = [-1, 0, 1, 2];
export const SingleOptions = (props) => {
  const token = useToken();
  const defaultStyle = {
    // backgroundColor: token.token.colorFillQuaternary,
    border: `1px solid ${token.token.colorBorder}`,
  };
  const selectStyle = {
    backgroundColor: token.token.colorInfoBg,
    border: `1px solid ${token.token.colorInfoBorder}`,
  };
  const successStyle = {
    backgroundColor: token.token.colorSuccessBg,
    border: `1px solid ${token.token.colorSuccessBorder}`,
  };
  const errorStyle = {
    backgroundColor: token.token.colorErrorBg,
    border: `1px solid ${token.token.colorErrorBorder}`,
  };
  const RadioStyle = (state) => {
    return state === select
      ? selectStyle
      : state === success
      ? successStyle
      : state === fail
      ? errorStyle
      : defaultStyle;
  };

  return (
    <div
      style={{
        margin: 0,
        padding: "8px 12px",
        fontSize: "14px",
        lineHeight: 1.5714285714285714,
        listStyle: "none",
        position: "relative",
        display: "flex",
        alignItems: "center",
        wordWrap: "break-word",
        borderRadius: "8px",
        ...RadioStyle(props.state),
      }}
    >
      <Radio value={props.value}>
        <Text style={{ userSelect: "none" }}>{props.choice.trim() || "\\"}</Text>
      </Radio>
    </div>
  );
};

export const MultipleOptions = (props) => {
  const [value, setValue] = useState(-1);
  const handleChange = (e) => {
    if (e.target.checked === undefined) return; //防止点击时span事件重复触发
    if (value === -1) {
      setValue(props.value);
      props.onChange(props.value, "+");
    } else {
      setValue(-1);
      props.onChange(props.value, "-");
    }
  };

  const token = useToken();
  const defaultStyle = {
    // backgroundColor: token.token.colorFillQuaternary,
    border: `1px solid ${token.token.colorBorder}`,
  };
  const selectStyle = {
    backgroundColor: token.token.colorInfoBg,
    border: `1px solid ${token.token.colorInfoBorder}`,
  };
  const successStyle = {
    backgroundColor: token.token.colorSuccessBg,
    border: `1px solid ${token.token.colorSuccessBorder}`,
  };
  const errorStyle = {
    backgroundColor: token.token.colorErrorBg,
    border: `1px solid ${token.token.colorErrorBorder}`,
  };
  const RadioStyle =
    props.state === select
      ? selectStyle
      : props.state === success
      ? successStyle
      : props.state === fail
      ? errorStyle
      : defaultStyle;

  return (
    <div
      style={{
        margin: 0,
        padding: "8px 12px",
        fontSize: "14px",
        lineHeight: 1.5714285714285714,
        listStyle: "none",
        position: "relative",
        display: "flex",
        alignItems: "center",
        wordWrap: "break-word",
        borderRadius: "8px",
        ...RadioStyle,
      }}
      onClick={handleChange}
    >
      <div>
        <Radio.Group value={value}>
          <Radio value={props.value}>
            <Text style={{ userSelect: "none" }}></Text>
            {props.choice.trim() || "\\"}
          </Radio>
        </Radio.Group>
      </div>
    </div>
  );
};

export const SingleChoice = (props) => {
  const [value, setValue] = useState(-1);
  const handleChange = (e) => {
    setValue(e.target.value);
    props.setAnswer([e.target.value]);
  };
  const caclState = (index) => {
    const type = ["A", "B", "C", "D"];
    if (props.choiceState[index] === success) return success;
    if (props.choiceState[index] === fail) return fail;
    if (props.answer.includes(type[index])) return select;
    return unset;
  };
  useEffect(() => {
    setValue(-1);
    // console.log("reset");
  }, [props.choice]);
  useEffect(() => {
    console.log("choiceState changed", props.choiceState);
  }
  , [props.choiceState]);
  return (
    <Radio.Group
      style={{ margin: "auto" }}
      onChange={handleChange}
      value={value}
    >
      <Space direction="vertical">
        <SingleOptions
          value="A"
          choice={props.choice[0]}
          state={caclState(0)}
        />
        <SingleOptions
          value="B"
          choice={props.choice[1]}
          state={caclState(1)}
        />
        <SingleOptions
          value="C"
          choice={props.choice[2]}
          state={caclState(2)}
        />
        <SingleOptions
          value="D"
          choice={props.choice[3]}
          state={caclState(3)}
        />
        <LongText />
      </Space>
    </Radio.Group>
  );
};

export const MultipleChoice = (props) => {
  const handleChange = (value, operator) => {
    switch (operator) {
      case "+":
        // console.log(props)
        props.setAnswer([...props.answer, value]);
        break;
      case "-":
        props.setAnswer(props.answer.filter((item) => item !== value));
        break;
      default:
        console.error(
          "operator error in MultipleChoice value change:",
          value,
          "operator:",
          operator
        );
        break;
    }
  };
  const caclState = (index) => {
    const type = ["A", "B", "C", "D"];
    if (props.choiceState[index] === success) return success;
    if (props.choiceState[index] === fail) return fail;
    if (props.answer.includes(type[index])) return select;
    return unset;
  };

  return (
    <>
      <Checkbox.Group
        style={{ margin: "auto" }}
        onChange={(e) => console.log(e)}
      >
        <Space direction="vertical">
          <MultipleOptions
            value="A"
            choice={props.choice[0]}
            state={caclState(0)}
            onChange={handleChange}
          />
          <MultipleOptions
            value="B"
            choice={props.choice[1]}
            state={caclState(1)}
            onChange={handleChange}
          />
          <MultipleOptions
            value="C"
            choice={props.choice[2]}
            state={caclState(2)}
            onChange={handleChange}
          />
          <MultipleOptions
            value="D"
            choice={props.choice[3]}
            state={caclState(3)}
            onChange={handleChange}
          />
          <LongText />
        </Space>
      </Checkbox.Group>
    </>
  );
};
