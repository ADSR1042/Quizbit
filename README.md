# ZJU刷题器

一个刷题用的小工具 基于React。禁止商业使用。

## 如何启动

In the project directory, you can run:

### `npm start`

开发环境启动 默认在3000端口开放

### `npm run build`

编译生产环境版本

## 题库

### 格式

在/src/data 下每个json文件都是一个字典，每个字典有四个列表，分别是子部分1、子部分2、子部分3、子部分4（按顺序），每个列表里的每个字典都是一道题，包含题目、答案和解析

示例:

```json
[
  [
    {
      "Description": "示例题目",
      "Answer": "D",
      "Choice": [
        "A、选项A",
        "B、选项B",
        "C、选项C",
        "D、选项D"
      ],
      "Analysis": "示例解析"
    }
  ],
  [],
  [],
  []
]
```

如果你需要新增题库,请同时修改data下的dataConfig.json,添加新的记录,用于前端渲染.

## TODO

1. 修改题库加载方式。目前四个子部分为硬编码
