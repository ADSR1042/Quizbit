import { PageHeader } from "@ant-design/pro-layout";
import { Breadcrumb, Button, Layout, message, theme } from "antd";
import { SettingOutlined, SaveOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Interface from "./components/Interface";
import { Setting } from "./components/Setting";
import { SiderCustom } from "./components/SiderCustom";
import { getData, loadData, getDataLength } from "./utils/data";
import { answerCheck } from "./utils/other";
import { indexToBookName } from "./utils/data";
const { Content, Footer } = Layout;
const defaultSetting = {
  book: [],
  part: [],
  mode: 0,
  autoSave: false,
};
const [incomplete, pass, error] = [0, 1, 2];
const [unset, , success, fail] = [-1, 0, 1, 2];
const LetterToNumber = (letter) => {
  return letter.charCodeAt() - 65;
};
const initalList = (setting) => {
  let list = [];
  let book = setting.book || 0;
  switch (setting.mode) {
    case 0:
      //顺序
      setting.part.forEach((item) => {
        for (let i = 0; i < getDataLength(book, item); i++) {
          list.push([book, item, i]);
        }
      });
      console.log(list);
      return list;
    case 1:
      //随机
      setting.part.forEach((item) => {
        let start = list.length;
        for (let i = 0; i < getDataLength(book, item); i++) {
          list.push([book, item, i]);
        }
        //打乱
        for (let i = start; i < list.length; i++) {
          let j = Math.floor(Math.random() * (list.length - start) + start);
          [list[i], list[j]] = [list[j], list[i]];
        }
      });
      return list;
    default:
      break;
  }
};

const Main = (props) => {
  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();
  const [showSetting, setShowSetting] = useState(true);
  const [setting, setSetting] = useState(defaultSetting);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState([]);
  const [choiceState, setChoiceState] = useState([unset, unset, unset, unset]);
  const [record, setRecord] = useState(new Map());
  // useEffect(() => {
  //   console.log("answer", answer);
  // }, [answer]);
  const inital = () => {
    if (!isDataReady) {
      message.error("先别着急，数据还没准备好");
      loadData()
        .then(() => {
          setIsDataReady(true);
          setList(initalList(setting));
          setCurrent(0);
          setIsRunning(true);
          setRecord(new Map());
        })
        .catch((err) => {
          message.error("数据加载失败");
        });
    } else {
      setList(initalList(setting));
      setCurrent(0);
      setIsRunning(true);
      setRecord(new Map());
      setChoiceState([unset, unset, unset, unset]);
      setAnswer([]);
    }
  };
  const next = () => {
    console.log("next");
    if (current < list.length - 1) {
      setCurrent(current + 1);
      // setAnswer([]);
    } else {
      message.error("已经是最后一题了");
      //TODO: 结束
      // setIsRunning(false);
    }
  };
  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setAnswer([]);
      setChoiceState([unset, unset, unset, unset]);
    } else {
      message.error("已经是第一题了");
    }
  };
  const handleCheck = () => {
    let rightAnswer = getData(...list[current]).Answer.split("");
    let tempstate = [unset, unset, unset, unset];
    if (answerCheck(answer, getData(...list[current]).Answer)) {
      message.success("回答正确");
      setRecord((record) => {
        record.set(current, pass);
        return record;
      });
      for (let i = 0; i < answer.length; i++) {
        tempstate[LetterToNumber(rightAnswer[i])] = success;
      }
      setChoiceState(tempstate);
      // next(); //如果正确直接下一题 这个地方需要一个setting
    } else {
      message.error("回答错误");
      setRecord((record) => {
        record.set(current, error);
        return record;
      });
      //这个地方父组件希望更新choiceState的值来更新子组件选择器的状态

      //测试代码 正常执行 就是有点丑
      for (let i = 0; i < answer.length; i++) {
        tempstate[LetterToNumber(answer[i])] = fail;
      }
      for (let i = 0; i < rightAnswer.length; i++) {
        tempstate[LetterToNumber(rightAnswer[i])] = success;
      }
      console.log(tempstate, "add fail");

      console.log(tempstate, "add success");
      setChoiceState(tempstate);
      // 原始代码
      // getData(...list[current])
      //   .Answer.split("")
      //   .forEach((item) => {
      //     setChoiceState((choiceState) => {
      //       choiceState[LetterToNumber(item)] = fail;
      //       return choiceState;
      //     });
      //   });
      //   console.log(choiceState);
      //   message.error("回答错误");
      // 这个地方的choiceState直接更新了 没有异步
      // 但是子组件props传入的choiceState直至dom更新才更新
    }
  };
  useEffect(() => {
    if (!isDataReady) {
      console.log("load data");
      message.loading("正在加载数据", 0);
      loadData().then((data) => {
        message.destroy();
        setIsDataReady(true);
        //数据加载失败也会报 success 之后修
        message.success("数据加载完成");
      });
    }
  });
  useEffect(() => {
    setChoiceState([unset, unset, unset, unset]);
    setAnswer([]);
    switch (record.get(current)) {
      case undefined:
        console.log("未作答");
        record.set(current, incomplete);
        break;
      case pass:
        console.log("已pass");
        break;
      case error:
        console.log("error");
        break;
      default:
        console.error("record error");
        break;
    }
    if (setting.autoSave) {
      console.log("auto save", record, list, setting);
      //record is map try convert to Json and save
      localStorage.setItem("record", JSON.stringify([...record]));
      localStorage.setItem("list", JSON.stringify(list));
      localStorage.setItem("setting", JSON.stringify(setting));
      localStorage.setItem("current", JSON.stringify(current));
    }
    console.log("current index is ", current);
  }, [current]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <PageHeader
        className="site-page-header"
        title={<div style={{ color: colorText }}>ZJU刷题器</div>}
        subTitle={<div style={{ color: colorText }}>仅供学习 请勿商用</div>}
        style={{ backgroundColor: colorBgContainer, color: colorText }}
        extra={
          <>
            <Button
              type="text"
              size="large"
              icon={<SaveOutlined />}
              onClick={() => {
                message.success("保存成功");
                localStorage.setItem("record", JSON.stringify([...record]));
                localStorage.setItem("list", JSON.stringify(list));
                localStorage.setItem("setting", JSON.stringify(setting));
                localStorage.setItem("current", JSON.stringify(current));
              }}
            />
            <Button
              type="text"
              size="large"
              icon={<SettingOutlined size="large" />}
              onClick={() => setShowSetting(true)}
            />
          </>
        }
      />
      <Setting
        showSetting={showSetting}
        setShowSetting={setShowSetting}
        setting={setting}
        setSetting={setSetting}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        setList={setList}
        setRecord={setRecord}
        setCurrent={setCurrent}
      />
      <Layout className="site-layout">
        <SiderCustom
          isDark={props.isDark}
          list={list}
          current={current}
          setCurrent={setCurrent}
          record={record}
        />
        <Content
          style={{
            margin: "0 26px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {/* {isRunning ? (
              <Breadcrumb
                style={{
                  margin: "16px 0",
                }}
              >
                <Breadcrumb.Item>某本书</Breadcrumb.Item>
                <Breadcrumb.Item>某某部分</Breadcrumb.Item>
              </Breadcrumb>
            ) : (
              <Breadcrumb
                style={{
                  margin: "16px 0",
                }}
              >
                <Breadcrumb.Item>某本书</Breadcrumb.Item>
                <Breadcrumb.Item>某某部分</Breadcrumb.Item>
              </Breadcrumb>
            )} */}
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              <Breadcrumb.Item>{indexToBookName(setting.book)}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div
            style={{
              padding: 24,
              minHeight: "70vh",
              maxHeight: "95vh",
              background: colorBgContainer,
              color: colorText,
            }}
          >
            <Interface
              start={inital}
              isRunning={isRunning}
              answer={answer}
              setAnswer={setAnswer}
              index={list[current]}
              next={next}
              prev={prev}
              choiceState={choiceState}
              record={record.get(current)}
              handleCheck={handleCheck}
            />
          </div>

          <Footer
            style={{ textAlign: "center", bottom: "2vh", position: "relative" }}
          >
            <span onClick={() => window.open("https://github.com/ADSR1042/Quizbit", "_blank")} style={{ cursor: "pointer" }}>Home</span>
          </Footer>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Main;
