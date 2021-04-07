import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { DATE_TYPE } from "../constant";
import { GlobalContext } from "context/global_ctx";
import { ClipRankContext } from "context/clip_rank_ctx";
import { usePlayerBtn } from "lib/hooks/usePlayerBtn";

const liveDateCheckIdx = 3;

export default function ClipRankingListTop3() {
  const history = useHistory();
  const { globalState } = useContext(GlobalContext);
  const { clipRankState } = useContext(ClipRankContext);
  const { formState, clipRankList } = clipRankState;
  const { onClipBtnClick } = usePlayerBtn();

  const loginCheck = (memNo: string) => {
    if (!globalState.baseData.isLogin) {
      history.push({
        pathname: "/login",
        state: `/mypage/${memNo}`,
      });
    } else {
      history.push(`/mypage/${memNo}`);
    }
  };

  return (
    <ul className="top3List">
      {clipRankList.slice(0, liveDateCheckIdx).map((v, i) => {
        return (
          <div className="top3Item" key={i}>
            <div className="topBoxThumb">
              {formState.dateType === DATE_TYPE.DAY && (
                <div
                  className="dayThumbnail"
                  onClick={() => {
                    onClipBtnClick({ clipNo: v.clipNo, type: "one" });
                  }}
                >
                  <img src={v.bgImg.thumb120x120} alt="클립 썸네일" />
                </div>
              )}

              {formState.dateType === DATE_TYPE.WEEK && (
                <>
                  <div className="weekUser" onClick={() => loginCheck(v.memNo)}>
                    <img src={v.profImg.thumb190x190} alt="유저이미지" />

                    <p>{v.nickName}</p>
                  </div>

                  <div
                    className="weekThumbnail"
                    onClick={() => {
                      onClipBtnClick({ clipNo: v.clipNo, type: "one" });
                    }}
                  >
                    <img src={v.bgImg.thumb190x190} alt="클립 썸네일" />
                  </div>
                </>
              )}
            </div>

            <div
              className={`topTextBox ${
                formState.dateType === DATE_TYPE.WEEK ? " week" : ""
              }`}
            >
              <span
                className="category"
                onClick={() => {
                  onClipBtnClick({ clipNo: v.clipNo, type: "one" });
                }}
              >
                {v.subjectName}
              </span>
              <span
                className="subject"
                onClick={() => {
                  onClipBtnClick({ clipNo: v.clipNo, type: "one" });
                }}
              >
                {v.title}
              </span>
              <strong
                className="nickName"
                onClick={() => {
                  loginCheck(v.memNo);
                }}
              >
                {v.nickName}
              </strong>
            </div>
          </div>
        );
      })}
    </ul>
  );
}
