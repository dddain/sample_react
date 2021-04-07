import React, { useState, useEffect, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { SwiperSlide } from "swiper/react";

import { GlobalContext } from "context/global_ctx";
import { convertDateFormat } from "lib/dalbit_moment";
import { calcDate } from "lib/common_fn";
import { convertMonday } from "lib/rank_fn";
// api
import { getMarketingClipList } from "common/api";
import DalbitSwiper from "common/ui/dalbit_swiper";
import NoResult from "common/ui/no_result";

interface DataTypes {
  clipNo: string;
  memNo: string;
  nickNm: string;
  recDate: string;
  thumbUrl: string;
  time: string;
  title: string;
  titleMsg: string;
}

export default function ClipMakerting() {
  const history = useHistory();

  const { globalState, globalAction } = useContext(GlobalContext);
  const { dateState } = globalState;
  const [marketingClipList, setMarketingClipList] = useState<DataTypes[]>([]);
  const [tableSwiperIndex, setTableSwiperIndex] = useState<number>(0);
  const [minRecDate, setMinRecDate] = useState("");

  const swiperProps = {
    slidesPerView: "auto",
    centeredSlides: true,
    autoHeight: true,
    spaceBetween: 15,
    initialSlide: marketingClipList.length,
    navigation: {
      nextEl: ".swiperBtn-next",
      prevEl: ".swiperBtn-prev",
    },
  };

  const isLast = useMemo(() => {
    const currentDate = convertDateFormat(convertMonday(), "YYYY-MM-DD");
    if (dateState === currentDate) {
      return true;
    } else {
      return false;
    }
  }, [dateState]);

  const isFirst = useMemo(() => {
    if (dateState <= minRecDate) {
      return true;
    } else {
      return false;
    }
  }, [dateState]);

  const fetchMarketingClip = async () => {
    const { result, data, message } = await getMarketingClipList({
      recDate: convertDateFormat(convertMonday(), "YYYY-MM-DD"),
      isLogin: globalState.baseData.isLogin,
      isClick: false,
    });
    if (result === "success") {
      setMarketingClipList(data.leaderList);
      setTableSwiperIndex(data.leaderList.length - 1);
      setMinRecDate(data.minRecDate);
    } else {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: `${message}`,
        callback: () => {},
      });
    }
  };

  const goRecommend = () => {
    history.push("/clip_recommend");
    if (globalAction.setDateState) {
      globalAction.setDateState(dateState);
    }
  };

  const nextCalcDate = () => {
    const date = calcDate(new Date(dateState), 7);
    globalAction.setDateState!(convertDateFormat(date, "YYYY-MM-DD"));
  };

  const prevCalcDate = () => {
    const date = calcDate(new Date(dateState), -7);
    globalAction.setDateState!(convertDateFormat(date, "YYYY-MM-DD"));
  };

  useEffect(() => {
    fetchMarketingClip();
    if (globalAction.setDateState) {
      globalAction.setDateState(
        convertDateFormat(convertMonday(), "YYYY-MM-DD")
      );
    }
  }, []);

  useEffect(() => {
    if (marketingClipList.length > 0) {
      const date = marketingClipList[tableSwiperIndex].recDate;
      if (globalAction.setDateState) {
        globalAction.setDateState(convertDateFormat(date, "YYYY-MM-DD"));
      }
    }
  }, [tableSwiperIndex, marketingClipList]);

  return (
    <div className="week_clip_wrap">
      {marketingClipList.length > 0 && (
        <>
          <header className="header arrow">
            <h3
              onClick={() => {
                goRecommend();
                if (globalAction.setDateState) {
                  globalAction.setDateState(dateState);
                }
              }}
            >
              주간 클립테이블
            </h3>

            <div className="button_box">
              <button
                className="swiperBtn-prev"
                disabled={isFirst}
                onClick={prevCalcDate}
              >
                이전
              </button>
              <button
                className="swiperBtn-next"
                disabled={isLast}
                onClick={nextCalcDate}
              >
                다음
              </button>
            </div>
          </header>

          <ul>
            {marketingClipList.length > 0 ? (
              <DalbitSwiper {...swiperProps}>
                {marketingClipList.map((item: DataTypes, idx: number) => (
                  <SwiperSlide key={`marketing-${idx}`} onClick={goRecommend}>
                    {/* <li> */}
                    <div className="thumb">
                      {item.thumbUrl && (
                        <img src={item.thumbUrl} alt="썸네일" />
                      )}
                    </div>

                    <div className="text_box">
                      <h4>{item.titleMsg}</h4>
                      <h5>{item.nickNm}</h5>
                      <p>{item.title}</p>
                    </div>

                    <button>
                      <span className="blind">재생 버튼</span>
                    </button>
                    {/* </li> */}
                  </SwiperSlide>
                ))}
              </DalbitSwiper>
            ) : (
              <NoResult text="주간 클립 테이블이 없습니다." />
            )}
          </ul>
        </>
      )}
    </div>
  );
}
