import React, { useState, useEffect, useContext } from "react";
import { SwiperSlide } from "swiper/react";

import { GlobalContext } from "context/global_ctx";
import { usePlayerBtn } from "lib/hooks/usePlayerBtn";
import { handleScroll } from "../lib";
import DalbitSwiper from "common/ui/dalbit_swiper";
// api
import { getLatestList } from "common/api";

interface RecentListType {
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

const swiperProps = {
  slidesPerView: "auto",
  autoHeight: true,
  spaceBetween: 20,
};

export default function ClipRecent() {
  const { globalAction } = useContext(GlobalContext);
  const { onClipBtnClick } = usePlayerBtn();
  const [recentList, setRecentList] = useState<RecentListType[]>([]);

  const fetchDataListLatest = async () => {
    const { result, data, message } = await getLatestList({});
    if (result === "success") {
      setRecentList(data.list);
    } else {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: message,
      });
    }
  };

  useEffect(() => {
    fetchDataListLatest();
  }, []);

  return (
    <div className="recent_clip_wrap">
      <header className="header arrow" onClick={handleScroll}>
        <h3>최신 클립</h3>
        <p>음원, MR 등 직접 제작하지 않은 클립은 삭제됩니다.</p>
      </header>

      {recentList && recentList.length > 0 ? (
        <DalbitSwiper {...swiperProps}>
          {recentList.map(({ bgImg, clipNo, nickName, title }, idx: number) => (
            <SwiperSlide key={`latest-${idx}`}>
              <div
                className="slide_box"
                onClick={() => {
                  const playListInfoData = {
                    slctType: 1,
                    dateType: 0,
                    page: 1,
                    records: 100,
                  };
                  onClipBtnClick({ clipNo, playListInfoData });
                }}
              >
                <div className="thumb">
                  <img src={bgImg["thumb336x336"]} alt={title} />
                </div>
                <p className="title">{title}</p>
                <p className="nick">{nickName}</p>
              </div>
            </SwiperSlide>
          ))}
        </DalbitSwiper>
      ) : (
        <></>
      )}
    </div>
  );
}
