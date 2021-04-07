import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { printNumber, addComma } from "lib/common_fn";
import { GlobalContext } from "context/global_ctx";
import { getMyClipData } from "common/api";
import { MyClipArrowUpIcon, MyClipArrowDownIcon } from "../static";

export default function ClipMain({ setPopState }) {
  const history = useHistory();
  const { globalState, globalAction } = useContext(GlobalContext);
  // state
  const [myData, setMyData] = useState({
    regCnt: 0,
    playCnt: 0,
    goodCnt: 0,
    byeolCnt: 0,
  });
  const [visibleState, setVisibleState] = useState<boolean>(true);

  const fetchDataMyClip = async () => {
    const { result, data, message } = await getMyClipData({});

    if (result === "success") {
      setMyData({
        ...myData,
        ...data,
      });
    } else {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: `${message}`,
      });
    }
  };

  const toggleVisible = (e) => {
    e.stopPropagation();
    setVisibleState(!visibleState);
  };
  const goClip = (tabParam: number, subTabParam: number) => {
    history.push(`/myclip?subTab=${subTabParam}`);
  };
  const goClipMypageDefine = (idx) => {
    if (idx === 0) {
      return {
        tabParam: 0,
        subTabParam: 0,
      };
    } else if (idx === 1) {
      return {
        tabParam: 1,
        subTabParam: 1,
      };
    } else if (idx === 2) {
      return {
        tabParam: 1,
        subTabParam: 2,
      };
    } else {
      return {
        tabParam: 1,
        subTabParam: 3,
      };
    }
  };

  const unitTextChange = (txt: string) => {
    if (txt === "regCnt") {
      return "건";
    } else if (txt === "playCnt") {
      return "회";
    } else if (txt === "goodCnt") {
      return "개";
    } else {
      return "별";
    }
  };

  // SideEffect -------------------
  useEffect(() => {
    fetchDataMyClip();
  }, []);
  // render ------------------------
  return (
    <div className="my_clip_wrap">
      <header className="header">
        <h3>
          내 클립 현황
          <em
            onClick={() =>
              setPopState((prevState) => ({
                ...prevState,
                popClipInfo: true,
              }))
            }
          />
        </h3>
        <button onClick={(e) => toggleVisible(e)}>
          {visibleState ? "접기" : "더보기"}
          <img src={visibleState ? MyClipArrowUpIcon : MyClipArrowDownIcon} alt="마이클립 화살표 버튼" />
        </button>
      </header>

      {visibleState && (
        <ul className="my_clip_list">
          {Object.keys(myData).map((item, idx) => {
            if (typeof myData[item] === "number") {
              return (
                <li
                  key={idx + `myDataList`}
                  onClick={() => goClip(goClipMypageDefine(idx).tabParam, goClipMypageDefine(idx).subTabParam)}
                >
                  <span className={item}>
                    {myData[item] > 999 ? printNumber(myData[item]) : addComma(myData[item])} {unitTextChange(item)}
                  </span>
                </li>
              );
            }
          })}
        </ul>
      )}
    </div>
  );
}
