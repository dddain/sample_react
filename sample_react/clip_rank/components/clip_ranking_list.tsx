import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { addComma } from "lib/common_fn";
import { GlobalContext } from "context/global_ctx";
import { ClipRankContext } from "context/clip_rank_ctx";
import { usePlayerBtn } from "lib/hooks/usePlayerBtn";

const liveDateCheckIdx = 3;
const records = 100;

export default function ClipRankingList() {
  const history = useHistory();
  const { globalState } = useContext(GlobalContext);
  const { clipRankState } = useContext(ClipRankContext);
  const { clipRankList, formState } = clipRankState;
  const { onClipBtnClick } = usePlayerBtn();

  function loginCheck(memNo: string) {
    if (!globalState.baseData.isLogin) {
      history.push({
        pathname: "/login",
        state: `/mypage/${memNo}`,
      });
    } else {
      history.push(`/mypage/${memNo}`);
    }
  }

  return (
    <ul className="rankListWrap common">
      <button
        className="allPlay"
        onClick={() => {
          let playListInfoData = {
            rankType: formState.dateType,
            rankingDate: formState.rankingDate,
            page: 1,
            records,
          };
          onClipBtnClick({
            clipNo: clipRankList[0].clipNo,
            playListInfoData: playListInfoData,
          });
        }}
      >
        전체듣기
      </button>
      {clipRankList.slice(liveDateCheckIdx).map((v, i) => {
        return (
          <li className="rankingItem" key={i}>
            <div className="rankBox">
              <div className="ranking">{v.rank}</div>
              <div className="rankChangeBox">
                {v.upDown === "-" || v.upDown === "" ? (
                  <span className="stop"></span>
                ) : v.upDown.includes("new") ? (
                  <span className="new">{v.upDown}</span>
                ) : v.upDown.includes("+") ? (
                  <span className="up">{Math.abs(parseInt(v.upDown))}</span>
                ) : (
                  <span className="down">{Math.abs(parseInt(v.upDown))}</span>
                )}
              </div>
            </div>

            <div className="infoWrap">
              <div
                className="thumbBox"
                onClick={() => {
                  onClipBtnClick({ clipNo: v.clipNo, type: "one" });
                }}
              >
                <img src={v.bgImg.thumb120x120} alt="프로필 사진" />
              </div>

              <div className="textBox">
                <p
                  className="titleBox"
                  onClick={() => {
                    onClipBtnClick({ clipNo: v.clipNo, type: "one" });
                  }}
                >
                  <span className="subject">{v.subjectName}</span>
                  <span className="title">{v.title}</span>
                </p>
                <strong
                  className="nick"
                  onClick={() => {
                    loginCheck(v.memNo);
                  }}
                >
                  {v.nickName}
                </strong>
                <div
                  className="detailBox"
                  onClick={() => {
                    onClipBtnClick({ clipNo: v.clipNo, type: "one" });
                  }}
                >
                  <span className="giftIcon">{addComma(v.giftPoint)}</span>
                  <span className="heartIcon">{addComma(v.goodPoint)}</span>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
