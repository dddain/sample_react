import React, { useState, useEffect, useContext } from "react";
// ctx
import { ClipContext } from "context/clip_ctx";
import { GlobalContext } from "context/global_ctx";
// api
import { getPopularList } from "common/api";
// modules
import { usePlayerBtn } from "lib/hooks/usePlayerBtn";
import { refreshClip } from "../lib";
import { RefreshIcon } from "../static";

interface PopularListType {
  bgImg: any;
  clipNo: string;
  filePlayTime: string;
  gender: string;
  goodCnt: number;
  isNew: boolean;
  isSpecial: boolean;
  nickName: string;
  playCnt: number;
  replyCnt: number;
  subjectType: string;
  title: string;
}
interface PopularSubInfo {
  type: number;
  totalCnt: string;
  checkDate: string;
}

export default function PopularRecommendClip() {
  const { globalAction } = useContext(GlobalContext);
  const { clipState, clipAction } = useContext(ClipContext);

  const { onClipBtnClick } = usePlayerBtn();
  const [popularList, setPopularList] = useState<PopularListType[]>([]);
  const [popularType, setPopularType] = useState<PopularSubInfo>();

  const fetchDataListPopular = async () => {
    const { result, data, message } = await getPopularList({});
    if (result === "success") {
      setPopularList(data.list.slice(0, 6));
      setPopularType((prevState) => ({
        ...prevState,
        type: data.type,
        totalCnt: data.totalCnt,
        checkDate: data.checkDate,
      }));
    } else {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: `${message}`,
      });
    }
  };
  // make contents
  const makePoupularList = () => {
    return popularList.map((item, idx) => {
      const { bgImg, clipNo, nickName, subjectType } = item;
      return (
        <li
          key={`popular-` + idx}
          onClick={() => {
            let playListInfoData = {
              listCnt: 20,
              playlist: true,
            };
            onClipBtnClick({ clipNo, playListInfoData });
          }}
        >
          <span className="category_text">
            {clipState.clipType.map((ClipTypeItem, idx) => {
              const { value, cdNm } = ClipTypeItem;
              if (value === subjectType) {
                return <React.Fragment key={idx + "typeList"}>{cdNm}</React.Fragment>;
              }
            })}
          </span>
          <div className="thumb">
            <img src={bgImg["thumb336x336"]} alt="thumb" />
          </div>
          <p className="nick">{nickName}</p>
        </li>
      );
    });
  };
  // sideEffect----------------------------
  useEffect(() => {
    fetchDataListPopular();
  }, []);
  useEffect(() => {
    if (clipState.clipRefresh?.popular === true) {
      fetchDataListPopular();
    }
  }, [clipState.clipRefresh?.popular]);
  // render -------------------------------
  return (
    <>
      {popularList.length > 0 && (
        <div className="recommend_clip_wrap">
          <header className="header">
            <h3>{popularType && popularType.type === 0 ? "인기 클립" : "당신을 위한 추천 클립"}</h3>

            <div className="time_box">
              <span>매일 00시, 12시 갱신</span>
              <button
                className={`btn_refresh${clipState.clipRefresh?.popular ? " active" : ""}`}
                onClick={() => refreshClip(clipAction, "popular")}
              >
                <img src={RefreshIcon} alt="인기클립 리프래시 아이콘 이미지" />
              </button>
            </div>
          </header>

          <ul>{makePoupularList()}</ul>
        </div>
      )}
    </>
  );
}
