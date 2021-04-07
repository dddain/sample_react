import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { SwiperSlide } from "swiper/react";

import { ClipContext } from "context/clip_ctx";
import { GlobalContext } from "context/global_ctx";
import { usePlayerBtn } from "lib/hooks/usePlayerBtn";
// api
import { getClipList } from "common/api";
// modules
import NoResult from "common/ui/no_result";
import DalbitSwiper from "common/ui/dalbit_swiper";

import { refreshClip, isHitBottom } from "../lib";
import { printNumber, addComma, debounceFn } from "lib/common_fn";
import { isHybrid } from "lib/mobile/hybrid";
import { HeartWhiteIcon, MessageWhiteIcon } from "../static";
import { sortArray } from "../constant";
// static
import {
  LiveCategoryIcon,
  LiveSimpleListicIcon,
  LiveDetailListicIcon,
  LiveDetailListicIconActive,
  LiveSimpleListicIconActive,
} from "../static";

interface LiveListType {
  bgImg: any;
  birthYear: number;
  byeolCnt: number;
  clipNo: string;
  entryType: number;
  filePlayTime: string;
  gender: string;
  goodCnt: number;
  isNew: false;
  isSpecial: false;
  memNo: string;
  nickName: string;
  os: number;
  playCnt: number;
  profImg: any;
  replyCnt: number;
  subjectType: string;
  title: string;
  total: number;
}

const swiperProps = {
  slidesPerView: "auto",
  autoHeight: true,
  spaceBetween: 6,
};

let totalPage = 1;

export default function ClipLiveList({ setPopState }) {
  const { onClipBtnClick } = usePlayerBtn();
  const { globalState, globalAction } = useContext(GlobalContext);
  const { clipState, clipAction } = useContext(ClipContext);
  const windowHalfWidth = (window.innerWidth - 32) / 2;

  const [liveList, setLiveList] = useState<LiveListType[]>([]);
  const [chartListType, setChartListType] = useState("listType");
  const [clipTypeActive, setClipTypeActive] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filterTxt = useMemo(() => {
    const result = sortArray.filter((item) => item.id === clipState.clipMainSort);
    return result[0].title;
  }, [clipState.clipMainSort]);

  const fetchDataLiveList = useCallback(async () => {
    const res = await getClipList({
      slctType: clipState.clipMainSort,
      subjectType: clipTypeActive,
      djType: 0,
      dateType: clipState.clipMainDate,
      page: currentPage,
      records: 30,
    });
    if (res.result === "success") {
      if (currentPage > 1) {
        setLiveList(liveList.concat(res.data.list));
      } else {
        setLiveList(res.data.list);
      }
      if (res.data.paging) {
        totalPage = res.data.paging.totalPage;
      }
    } else {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: res.message,
      });
    }
  }, [currentPage, liveList, clipTypeActive, clipState.clipMainSort, clipState.clipMainDate]);

  const getPageFormIdx = useCallback((idx) => {
    if (idx < 100) return 1;
    idx = String(idx);
    return Number(idx.substring(0, idx.length - 2)) + 1;
  }, []);

  const CategoryActiveFunc = (value: string) => {
    setCurrentPage(1);
    setClipTypeActive(value);
  };

  useEffect(() => {
    CategoryActiveFunc(clipState.clipTop3Category);
  }, [clipState.clipTop3Category]);

  useEffect(() => {
    let fetching = false;
    const scrollEvtHdr = (fetching: boolean) => {
      if (totalPage > currentPage && isHitBottom()) {
        if (!fetching) {
          setCurrentPage(currentPage + 1);
        }
      }
    };
    const debounce = debounceFn(() => scrollEvtHdr(fetching), 50);
    window.addEventListener("scroll", debounce);
    fetchDataLiveList();

    return () => {
      window.removeEventListener("scroll", debounce);
      fetching = true;
    };
  }, [currentPage, clipTypeActive, clipState.clipMainSort, clipState.clipMainDate]);

  useEffect(() => {
    if (clipState.clipRefresh?.liveList) {
      fetchDataLiveList();
    }
  }, [clipState.clipRefresh]);

  const renewedClipType = [...clipState.clipType];
  renewedClipType.splice(0, 0, { cd: "clip_type", cdNm: "전체", value: "" });

  return (
    <div className="live_clip_wrap">
      <div
        className={`sticky_area ${globalState.isMobile && !isHybrid() ? "mWeb" : ""} ${
          clipState.fixedScrollInfo?.fixedState ? "isFixed" : ""
        }`}
      >
        <header className="header">
          <h3>실시간 클립</h3>
          <button
            className="rand_button"
            onClick={() =>
              setPopState((prevState) => ({
                ...prevState,
                detailPopup: true,
              }))
            }
          >
            <span className="button_text">{filterTxt}</span>
            <img alt="라이브 카테고리 아이콘" src={LiveCategoryIcon} />
          </button>

          <div className="button_box">
            <button className="list_button" onClick={() => setChartListType("listType")}>
              <img
                src={chartListType === "listType" ? LiveDetailListicIconActive : LiveDetailListicIcon}
                alt="클립 카테고리 디테일 아이콘"
              />
            </button>
            <button className="grid_button" onClick={() => setChartListType("thumbType")}>
              <img
                src={chartListType === "thumbType" ? LiveSimpleListicIconActive : LiveSimpleListicIcon}
                alt="클립 카테고리 심플 아이콘"
              />
            </button>
            <button className="refresh_button" onClick={() => refreshClip(clipAction, "liveList")}>
              <img
                className={`icon_refresh${clipState.clipRefresh?.liveList ? " active" : ""}`}
                src={"https://image.dalbitlive.com/main/200714/ico-refresh-gray.png"}
                alt="클립 카테고리 Refresh 아이콘"
              />
            </button>
          </div>
        </header>

        {clipState.clipType?.length > 0 ? (
          <DalbitSwiper {...swiperProps}>
            {renewedClipType.map(({ value, cdNm }, idx: number) => (
              <SwiperSlide
                key={`categoryTab-${idx}`}
                className={`swiper_slide${clipTypeActive === value ? "--active" : ""}`}
                onClick={() => CategoryActiveFunc(value)}
              >
                {cdNm}
              </SwiperSlide>
            ))}
          </DalbitSwiper>
        ) : (
          <></>
        )}
      </div>

      {chartListType === "listType" ? (
        <ul
          className="commonList listType"
          style={clipState.fixedScrollInfo?.fixedState ? { paddingTop: "104px" } : { paddingTop: 0 }}
        >
          {liveList.length > 0 ? (
            liveList.map((item, idx) => {
              const {
                bgImg,
                gender,
                filePlayTime,
                nickName,
                playCnt,
                title,
                subjectType,
                goodCnt,
                replyCnt,
                isSpecial,
                clipNo,
              } = item;
              return (
                <li
                  className="commonItem"
                  key={idx + "list"}
                  onClick={() => {
                    const nowPage = getPageFormIdx(idx);
                    const playListInfoData = {
                      slctType: clipState.clipMainSort,
                      dateType: clipState.clipMainDate,
                      subjectType: clipTypeActive,
                      page: nowPage,
                      records: 100,
                    };
                    onClipBtnClick({ clipNo, playListInfoData });
                  }}
                >
                  <div className="thumbBox">
                    {isSpecial && <span className="icon_dj">스페셜DJ</span>}
                    <img src={bgImg[`thumb190x190`]} alt={title} />
                    <span className="playTime">{filePlayTime}</span>
                  </div>

                  <div className="infoBox">
                    <p className="titleBox">
                      <span className="category">
                        {clipState.clipType.map((ClipTypeItem, index) => {
                          if (ClipTypeItem.value === subjectType) {
                            return <React.Fragment key={idx + "typeList"}>{ClipTypeItem.cdNm}</React.Fragment>;
                          }
                        })}
                      </span>
                      <span className="title">{title}</span>
                    </p>

                    <p className="nickBox">
                      {gender !== "" ? (
                        <span className={gender === "m" ? "icon_wrap icon_male" : "icon_wrap icon_female"} />
                      ) : (
                        <></>
                      )}
                      <span className="nick">{nickName}</span>
                    </p>

                    <div className="countBox">
                      <span className="ico ico_message">
                        <span className="num">{playCnt > 999 ? printNumber(replyCnt) : addComma(replyCnt)}</span>
                      </span>
                      <span className="ico ico_like">
                        <span className="num">{goodCnt > 999 ? printNumber(goodCnt) : addComma(goodCnt)}</span>
                      </span>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <NoResult text="조회된 리스트가 없습니다." />
          )}
        </ul>
      ) : (
        <div>
          <ul
            className="commonList thumbType"
            style={clipState.fixedScrollInfo?.fixedState ? { paddingTop: "104px" } : { paddingTop: 0 }}
          >
            {liveList.map((item, idx) => {
              const { bgImg, gender, nickName, playCnt, title, replyCnt, goodCnt, isSpecial, clipNo } = item;
              return (
                <li
                  className="commonItem"
                  key={`commonItem` + idx}
                  onClick={() => {
                    const nowPage = getPageFormIdx(idx);
                    const playListInfoData = {
                      slctType: clipState.clipMainSort,
                      dateType: clipState.clipMainDate,
                      subjectType: clipTypeActive,
                      page: nowPage,
                      records: 100,
                    };
                    onClipBtnClick({ clipNo, playListInfoData });
                  }}
                >
                  <div className="thumbBox">
                    <img src={bgImg[`thumb190x190`]} alt={title} />
                  </div>
                  <section className="topBox">
                    <div className="statusBox">{isSpecial && <span className="specialIcon">S</span>}</div>

                    <div className="countBox">
                      <div className="item">
                        <img width={18} src={MessageWhiteIcon} />
                        <span>{playCnt > 999 ? printNumber(replyCnt) : addComma(replyCnt)}</span>
                      </div>
                      <div className="item">
                        <img width={18} src={HeartWhiteIcon} />
                        <span>{goodCnt > 999 ? printNumber(goodCnt) : addComma(goodCnt)}</span>
                      </div>
                    </div>
                  </section>

                  <section className="bottomBox">
                    <h3 className="subject">{title}</h3>
                    <p className="nickBox">
                      {gender !== "" && (
                        <em className={`icon_wrap ${gender === "m" ? "icon_male" : "icon_female"}`}>
                          <span className="blind">성별</span>
                        </em>
                      )}
                      <span className="nick">{nickName}</span>
                    </p>
                  </section>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
