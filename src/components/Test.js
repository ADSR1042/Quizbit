import { Button, message } from "antd";
import { getData } from "../utils/data";
export const Test = () => {
  const handleClick = () => {
    // let list = [];
    // datalist.forEach((item) => {
    //   list.push(...item.children);
    // });
    // console.log(list);
    // loadData();
    // console.log(data)
    getData(0,0,0)
  };
  return <Button onClick={handleClick}>123</Button>;
};
