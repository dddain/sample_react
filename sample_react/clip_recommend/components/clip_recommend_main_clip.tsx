import React, { useState, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { usePlayerBtn } from "lib/hooks/usePlayerBtn";
import { addComma } from "lib/common_fn";
import DOMSanitizer from "common/html_sanitizer";
import { IMG_SERVER } from "constant/define";
import { GlobalContext } from "context/global_ctx";

type propType = {
  mainClip: any;
  isShowToggle: boolean;
};

function ClipRecommendMainClip(props: propType) {
  const { mainClip, isShowToggle } = props;
  const history = useHistory();
  const { globalAction } = useContext(GlobalContext);
  const { onClipBtnClick } = usePlayerBtn();
  const [isMoreText, setIsMoreText] = useState(false);
  const contentText = useRef<HTMLDivElement>(null);

  const onClickToggle = () => {
    if (isMoreText === false) {
      setIsMoreText(true);
      if (contentText.current !== null)
        contentText.current.style.height = "auto";
    } else {
      setIsMoreText(false);
      if (contentText.current !== null)
        contentText.current.style.height = "58px";
    }
  };

  return (
    <div className="playBox">
      <h3 className="title">{mainClip.titleMsg}</h3>

      <div
        className="video"
        onClick={() => {
          onClipBtnClick({
            clipNo: mainClip.clipNo,
            type: "one",
            isFromRecommend: true,
          });
          if (globalAction.setDateState) {
            globalAction.setDateState(mainClip.recDate);
          }
        }}
      >
        {mainClip.bannerUrl ? (
          <img
            src={mainClip.bannerUrl}
            width="360"
            height="208"
            alt="클립썸네일이미지"
          />
        ) : (
          <></>
        )}
      </div>

      <div className="videoItem">
        <ul
          className="scoreList"
          onClick={() => {
            onClipBtnClick({
              clipNo: mainClip.clipNo,
              type: "one",
              isFromRecommend: true,
            });
            if (globalAction.setDateState) {
              globalAction.setDateState(mainClip.recDate);
            }
          }}
        >
          <li className="scoreItem">
            <button className="scoreButton">
              <img src={`${IMG_SERVER}/svg/ic_gift.svg`} />
            </button>
            <p className="scoreCount">{addComma(mainClip.byeolCnt)}</p>
          </li>
          <li className="scoreItem">
            <button className="scoreButton">
              <img src={`${IMG_SERVER}/svg/ic_heart_g.svg`} />
            </button>
            <p className="scoreCount">{addComma(mainClip.goodCnt)}</p>
          </li>
          <li className="scoreItem">
            <button className="scoreButton">
              <img src={`${IMG_SERVER}/svg/ic_message_g.svg`} />
            </button>
            <p className="scoreCount">{addComma(mainClip.replyCnt)}</p>
          </li>
        </ul>
        <div className="snsBox">
          <h4 className="snsTitle">바로가기</h4>
          <div className="snsList">
            <button
              onClick={() => window.open(`${mainClip.fbookUrl}`, "_blank")}
            >
              <img
                src={`${IMG_SERVER}/svg/ic_facebook.svg`}
                alt="페이스북 바로가기"
              />
            </button>
            <button
              onClick={() => window.open(`${mainClip.instaUrl}`, "_blank")}
            >
              <img
                src={`${IMG_SERVER}/svg/ic_instagram.svg`}
                alt="인스타 그램 바로가기"
              />
            </button>
            <button
              onClick={() => window.open(`${mainClip.ytubeUrl}`, "_blank")}
            >
              <img
                src={`${IMG_SERVER}/svg/ic_youtube.svg`}
                alt="유튜브 바로가기"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="titleBox">
        <h4
          className="playName"
          onClick={() => {
            onClipBtnClick({
              clipNo: mainClip.clipNo,
              type: "one",
              isFromRecommend: true,
            });
            if (globalAction.setDateState) {
              globalAction.setDateState(mainClip.recDate);
            }
          }}
        >
          {mainClip.title}
        </h4>

        <div className="userItem">
          <p
            className="nickName"
            onClick={() => {
              history.push(`/mypage/${mainClip.clipMemNo}`);
              if (globalAction.setDateState) {
                globalAction.setDateState(mainClip.recDate);
              }
            }}
          >
            {mainClip.nickNm}
          </p>
          <button
            className="fileNumber"
            onClick={() => {
              history.push(`/mypage/${mainClip.clipMemNo}/clip`);
              if (globalAction.setDateState) {
                globalAction.setDateState(mainClip.recDate);
              }
            }}
          >
            {addComma(mainClip.regCnt)}
          </button>
        </div>
      </div>

      <div className="text">
        <div className="playInfo">
          <div className="playText" ref={contentText}>
            <DOMSanitizer customTag="div" innerHTMLContent={mainClip.descMsg} />
          </div>

          {isShowToggle && (
            <button
              className={`btn ${isMoreText ? "on" : ""}`}
              onClick={() => onClickToggle()}
            >
              <span>더보기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClipRecommendMainClip;
