import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { convertDateFormat } from "lib/dalbit_moment";
import { usePlayerBtn } from "lib/hooks/usePlayerBtn";
import { addComma } from "lib/common_fn";
import NoResult from "common/ui/no_result";
import { GlobalContext } from "context/global_ctx";

type propType = {
  mainClip: any;
  clipList: Array<any>;
  clipNo: string;
};

function ClipRecommendList(props: propType) {
  const { mainClip, clipList, clipNo } = props;
  const history = useHistory();
  const { globalState, globalAction } = useContext(GlobalContext);
  const { onClipBtnClick } = usePlayerBtn();
  const dateState = convertDateFormat(globalState.dateState, "YYYY-MM-DD");

  return (
    <>
      {clipList.length > 0 ? (
        <>
          <div className="listTitle">
            <h3 className="titleBox">
              함께 듣기 좋은 클립
              <span className="subTitle">
                클립 듣고 좋아요 &#38; 댓글 남겨주시는 센스 😊
              </span>
            </h3>
            <button
              className="btnAllPlay"
              onClick={() => {
                let playListInfoData = {
                  recDate: dateState,
                  isLogin: globalState.baseData.isLogin,
                  isClick: true,
                };
                onClipBtnClick({
                  clipNo: clipNo,
                  playListInfoData: playListInfoData,
                  isFromRecommend: true,
                });
                if (globalAction.setDateState) {
                  globalAction.setDateState(mainClip.recDate);
                }
              }}
            >
              전체듣기
            </button>
          </div>

          <ul className="clipListWrap">
            {clipList.map((v, i) => {
              return (
                <li className="rankingItem" key={`list-${i}`}>
                  <div
                    className="thumbnail"
                    onClick={() => {
                      onClipBtnClick({
                        clipNo: v.clipNo,
                        type: "one",
                        isFromRecommend: true,
                      });
                      if (globalAction.setDateState) {
                        globalAction.setDateState(mainClip.recDate);
                      }
                    }}
                  >
                    <img src={v.bgImg.thumb150x150} alt="썸네일" />
                    <span className="playTime">{v.filePlayTime}</span>
                  </div>
                  <div
                    className="infoBox"
                    onClick={() => {
                      onClipBtnClick({
                        clipNo: v.clipNo,
                        type: "one",
                        isFromRecommend: true,
                      });
                      if (globalAction.setDateState) {
                        globalAction.setDateState(mainClip.recDate);
                      }
                    }}
                  >
                    <div className="titleBox">
                      <div className="category">{v.subjectName}</div>
                      <h4 className="title">{v.title}</h4>
                    </div>
                    <div className="nickName">
                      {v.gender !== "" && (
                        <em
                          className={`icon_wrap ${
                            v.gender === "m" ? "icon_male" : "icon_female"
                          }`}
                        >
                          성별
                        </em>
                      )}
                      <p>{v.nickName}</p>
                    </div>
                    <ul className="scoreList">
                      <li className="scoreItem">
                        <span className="icon message">
                          {addComma(v.replyCnt)}
                        </span>
                      </li>
                      <li className="scoreItem">
                        <span className="icon like">{addComma(v.goodCnt)}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="buttonBox">
                    <button
                      className="btn play"
                      onClick={() => {
                        onClipBtnClick({
                          clipNo: v.clipNo,
                          type: "one",
                          isFromRecommend: true,
                        });
                        if (globalAction.setDateState) {
                          globalAction.setDateState(mainClip.recDate);
                        }
                      }}
                    >
                      플레이 아이콘
                    </button>
                    <button
                      className="btn people"
                      onClick={() => {
                        history.push(`/mypage/${v.memNo}`);
                        if (globalAction.setDateState) {
                          globalAction.setDateState(mainClip.recDate);
                        }
                      }}
                    >
                      사람 아이콘
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <NoResult type="default" text="등록된 클립이 없습니다." />
      )}
    </>
  );
}

export default ClipRecommendList;
