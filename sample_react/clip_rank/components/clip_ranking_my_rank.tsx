import React, { useContext } from "react";
import { DATE_TYPE } from "../constant";
import { GlobalContext } from "context/global_ctx";
import { ClipRankContext } from "context/clip_rank_ctx";
import { addComma } from "lib/common_fn";
import { usePlayerBtn } from "lib/hooks/usePlayerBtn";

export default function ClipRankingMyRank() {
  const { globalState } = useContext(GlobalContext);
  const { clipRankState } = useContext(ClipRankContext);
  const { formState, myInfo } = clipRankState;
  const nickNm = globalState.userProfile && globalState.userProfile.nickNm;
  const { onClipBtnClick } = usePlayerBtn();

  return (
    <>
      {Object.keys(myInfo).length > 0 && myInfo.myRank != 0 && (
        <div
          className="rankingItem profile"
          onClick={() => {
            onClipBtnClick({ clipNo: myInfo.myClipNo, type: "one" });
          }}
        >
          <div className="rankBox">
            <p className="title">
              {formState.dateType === DATE_TYPE.DAY ? "일간" : "주간"}
              <br />
              클립랭킹
            </p>

            <p className="ranking">{myInfo.myRank}</p>

            <div className="rankChangeBox">
              {myInfo.myUpDown === "-" || myInfo.myUpDown === "" ? (
                <span className="stop"></span>
              ) : myInfo.myUpDown.includes("new") ? (
                <span className="new">{myInfo.myUpDown}</span>
              ) : myInfo.myUpDown.includes("+") ? (
                <span className="up">
                  {Math.abs(parseInt(myInfo.myUpDown))}
                </span>
              ) : (
                <span className="down">
                  {Math.abs(parseInt(myInfo.myUpDown))}
                </span>
              )}
            </div>
          </div>

          <div className="infoWrap">
            <div className="thumbBox">
              <img src={myInfo.bgImg.thumb120x120} alt="프로필 사진" />
            </div>

            <div className="textBox">
              <p className="titleBox">
                <span className="subject">{myInfo.subjectName}</span>
                <span className="title">{myInfo.title}</span>
              </p>
              <strong className="nick">{nickNm}</strong>
              <div className="detailBox">
                <span className="headsetIcon">
                  {addComma(myInfo.myListenPoint)}
                </span>
                <span className="giftIcon">{addComma(myInfo.myGiftPoint)}</span>
                <span className="heartIcon">
                  {addComma(myInfo.myGoodPoint)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
