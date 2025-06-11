import { message } from "antd";
import datalist from "../data/dataConfig.json";
let data = [];
export const loadData = async () => {
  //dynamic import
  data = await Promise.all(
    convertData(datalist).map((item) => {
      return import(`../data/${item.label}.json`);
    })
  ).catch((err) => {
    console.log(err);
    message.error("数据加载失败");
  });
  data = data.map((item) => {
    return item.default;
  });
};
const convertData = (data) => {
  let res = [];
  data.forEach((item) => {
    res.push(...item.children);
  });
  return res;
};

const defaultdata = {
  Description: "默认题干",
  Answer: "A",
  Choice: ["A、默认选项A", "B、默认选项B", "C、默认选项C", "D、默认选项D"],
  Analysis: "默认分析",
};

export const getData = (id, part, index) => {
  // console.log(data);
  if (data.length === 0) {
    console.error("数据未加载");
    message.error("数据未加载或格式错误");
    return defaultdata;
  }
  if (id === undefined || part === undefined || index === undefined) {
    console.error("getData Error!", "id", id, "part", part, "index", index);
    return defaultdata;
  }
  if (
    id >= data.length ||
    id < 0 ||
    part < 0 ||
    part > 4 ||
    data[id][part][index] === undefined
  ) {
    console.error("getData Error!", "id", id, "part", part, "index", index);
    return defaultdata;
  }
  return data[id][part][index];
};
export const getDataLength = (id, part) => {
  if (data.length === 0) {
    console.error("数据未加载");
    message.error("数据未加载或格式错误");
    return 0;
  }
  if (id === undefined || part === undefined) {
    console.error("getData Error!", "id", id, "part", part);
    return 0;
  }
  if (id >= data.length || id < 0 || part < 0 || part > 4) {
    console.error("getData Error!", "id", id, "part", part);
    return 0;
  }
  return data[id][part].length;
};
export const indexToBook = (index) => {
  if (index < 0 || index >= data.length) {
    console.error("indexToBook Error!", "index", index);
    return "未知书籍";
  }
  for (let i = 0; i < datalist.length; i++) {
    for (let j = 0; j < datalist[i].children.length; j++) {
      if (datalist[i].children[j].value === index) {
        return datalist[i].value;
      }
    }
  }
};
export const indexToBookName = (index) => {
  if (index < 0 || index >= data.length) {
    return "未知书籍";
  }
  for (let i = 0; i < datalist.length; i++) {
    for (let j = 0; j < datalist[i].children.length; j++) {
      if (datalist[i].children[j].value === index) {
        return datalist[i].children[j].label;
      }
    }
  }
};
// export const getDataList = () => {
//   let res = [
//     { value: "2022", label: "2022", children: [] },
//     { value: "2023", label: "2023", children: [] },
//   ];
//   dataList.dataList.forEach((item) => {
//     res[item.year - 2022].children.push({ value: item.id, label: item.name });
//   });
//   return res;
// };
