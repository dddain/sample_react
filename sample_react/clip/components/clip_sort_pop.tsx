import React, { useState, useContext, useEffect, useCallback } from "react";
import { ClipContext } from "context/clip_ctx";
import { mainStateArr, dateStateArr } from "../constant";

interface ClipSortType {
  sortMainState: number;
  sortDate: number;
}
export default function detailPopup({ setPopState }) {
  const { clipState, clipAction } = useContext(ClipContext);
  const [sortInfo, setSortInfo] = useState<ClipSortType>({ sortMainState: 0, sortDate: 0 });
  const sortChangeFunction = useCallback((sortType: string, sortNumber: number) => {
    if (sortType === "sortMain") {
      setSortInfo((prevState) => ({
        ...prevState,
        sortMainState: sortNumber,
      }));
    } else if (sortType === "sortDate") {
      setSortInfo((prevState) => ({
        ...prevState,
        sortDate: sortNumber,
      }));
    }
  }, []);

  const closePopup = () => {
    setPopState((prevState) => ({
      ...prevState,
      detailPopup: false,
    }));
  };

  const closePopupDim = (e) => {
    const target = e.target;
    if (target.className === "overlay") {
      closePopup();
    }
  };

  const applyClick = () => {
    setPopState((prevState) => ({
      ...prevState,
      detailPopup: false,
    }));
    clipAction.setClipMainSort!(sortInfo.sortMainState);
    clipAction.setClipMainDate!(sortInfo.sortDate);
  };

  useEffect(() => {
    setSortInfo((prevState) => ({
      ...prevState,
      sortMainState: clipState.clipMainSort,
      sortDate: clipState.clipMainDate,
    }));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <div className="overlay" onClick={closePopupDim}>
        <div id="clipDetailPopup" className="layerContainer">
          <div className="content_wrap">
            <header className="header_box">
              <h2 className="text">상세조건</h2>
            </header>

            <div className="inner_wrap">
              <section className="category_box">
                <h3>정렬 조건</h3>
                <div className="tab_box">
                  {mainStateArr.map((mainStateItem, idx) => {
                    return (
                      <button
                        type="button"
                        className={sortInfo?.sortMainState === mainStateItem.id ? "tab_button active" : "tab_button"}
                        onClick={() => sortChangeFunction(mainStateItem.type, mainStateItem.id)}
                        key={`idx` + mainStateItem.title}
                      >
                        {mainStateItem.title}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="category_box">
                <h3>
                  조회 기간
                  <span className="infoTxt">선택된 정렬의 데이터 조회기간</span>
                </h3>
                <div className="tab_box">
                  {dateStateArr.map((dateItem, idx) => {
                    return (
                      <button
                        type="button"
                        className={sortInfo?.sortDate === dateItem.id ? "tab_button active" : "tab_button"}
                        onClick={() => sortChangeFunction(dateItem.type, dateItem.id)}
                        key={`idx` + dateItem.title}
                      >
                        {dateItem.title}
                      </button>
                    );
                  })}
                </div>
              </section>

              <div className="button_box">
                <button onClick={applyClick}>적용 하기</button>
              </div>
            </div>
          </div>
          <button className="btnClose" onClick={closePopup}>
            닫기
          </button>
        </div>
      </div>
    </>
  );
}
