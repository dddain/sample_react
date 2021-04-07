export const sortArray = [
  { id: 1, title: "최신순" },
  { id: 3, title: "선물순" },
  { id: 4, title: "재생순" },
  { id: 2, title: "인기순" },
  { id: 6, title: "랜덤" },
  { id: 5, title: "스페셜DJ" },
];
export const mainStateArr = [
  {
    id: 6,
    title: "랜덤",
    type: "sortMain",
  },
  {
    id: 1,
    title: "최신순",
    type: "sortMain",
  },
  {
    id: 5,
    title: "스페셜DJ",
    type: "sortMain",
  },
  {
    id: 2,
    title: "인기순",
    type: "sortMain",
  },
  {
    id: 3,
    title: "선물순",
    type: "sortMain",
  },
  {
    id: 4,
    title: "재생순",
    type: "sortMain",
  },
];
export const dateStateArr = [
  {
    id: 1,
    title: "1일",
    type: "sortDate",
  },
  {
    id: 2,
    title: "1주일",
    type: "sortDate",
  },
  {
    id: 0,
    title: "전체",
    type: "sortDate",
  },
];
export default {
  sortArray,
  mainStateArr,
  dateStateArr,
};
