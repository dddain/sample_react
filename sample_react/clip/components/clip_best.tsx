import React, { useState, useEffect, useContext } from "react";
import { SwiperSlide } from "swiper/react";

import { ClipContext } from "context/clip_ctx";
import { GlobalContext } from "context/global_ctx";
import { usePlayerBtn } from "lib/hooks/usePlayerBtn";

import DalbitSwiper from "common/ui/dalbit_swiper";
import { getMainTop3List } from "common/api";
import { handleScroll } from "../lib";

const swiperProps = {
  slidesPerView: "auto",
  spaceBetween: 15,
  centeredSlides: true,
  autoHeight: true,
  loop: true,
};

export default function ClipBestSlider() {
  const { globalAction } = useContext(GlobalContext);
  const { clipState, clipAction } = useContext(ClipContext);

  const { onClipBtnClick } = usePlayerBtn();
  const [top3Lists, setTop3Lists] = useState<{ [key: string]: any }[]>([]);

  const fetchDataListTop3 = async () => {
    const { result, data, message } = await getMainTop3List({});
    if (result === "success") {
      const filteredTop3 = Object.keys(data)
        .filter((item) => data[item].length >= 3)
        .map((item) => data[item]);

      setTop3Lists(filteredTop3);
    } else {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: `${message}`,
      });
    }
  };

  useEffect(() => {
    fetchDataListTop3();
  }, []);

  return (
    <div className="top_category_wrap">
      {top3Lists && top3Lists.length !== 0 && (
        <DalbitSwiper {...swiperProps}>
          {top3Lists.map((item: any, idx) => {
            let subjectMap = item[0].subjectType;

            return (
              <SwiperSlide key={`dalbit-${idx}`}>
                <div className="slide_box">
                  {clipState.clipType.map((categoryItem, idx) => {
                    const { cdNm, value } = categoryItem;
                    if (subjectMap === value) {
                      return (
                        <header key={idx + "moreBtn"}>
                          <h3>{cdNm}</h3>
                          <div className="button_box">
                            <p>주제별 인기 클립 Top 3</p>
                            <button
                              value={value}
                              onClick={() => {
                                clipAction.setClipMainSort!(2);
                                clipAction.setClipTop3Category!(value);
                                handleScroll();
                              }}
                            >
                              더보기
                            </button>
                          </div>
                        </header>
                      );
                    }
                  })}

                  <ul>
                    {item.map((listItem, idx) => {
                      const { bgImg, title, nickName, rank, clipNo } = listItem;
                      return (
                        <li
                          key={`toplist-${idx}`}
                          className="top_item"
                          onClick={() => {
                            let playListInfoData = {
                              subjectType: subjectMap,
                              listCnt: 100,
                            };
                            onClipBtnClick({ clipNo, playListInfoData });
                          }}
                        >
                          <span className="rank_num">{rank}</span>

                          <div className="thumb">
                            <img src={bgImg["thumb336x336"]} alt="thumb" />
                          </div>

                          <div className="title_box">
                            <p className="title">{title}</p>
                            <p className="nick">{nickName}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </SwiperSlide>
            );
          })}
        </DalbitSwiper>
      )}
    </div>
  );
}
