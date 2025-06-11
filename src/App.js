import { React, useState } from "react";
import { ConfigProvider, theme, FloatButton } from "antd";
import MoonOutLined from "./components/MoonOutLined";
import SunOutLined from "./components/SunOutLined";
import Main from "./Main";
const App = () => {
  const [isDark, setIsDark] = useState(false);
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Main isDark={isDark} />
      {/* <Test/> */}
      <FloatButton
        icon={isDark ? <MoonOutLined /> : <SunOutLined />}
        tooltip={<div>切换深色/浅色模式</div>}
        onClick={() => setIsDark(!isDark)}
        style={{
          userSelect:"none"
        }}
      />
    </ConfigProvider>
  );
};

export default App;
