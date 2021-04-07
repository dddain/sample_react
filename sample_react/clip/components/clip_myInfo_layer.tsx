import React, { useEffect } from "react";

export default (props) => {
  const closePopupDim = (e) => {
    const target = e.target;
    if (target.className === "overlay") {
      props.setPopState((prevState) => ({
        ...prevState,
        popClipInfo: false,
      }));
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div className="overlay" onClick={closePopupDim}>
      <div className="layerContainer">
        <h3>내 클립 현황</h3>
        <div className="layerMyClip">
          <ul className="my_clip_list">
            <li>
              <span className="regCnt">등록 클립 수</span>
              <p>등록한 클립 중 공개 설정된 클립의 수</p>
            </li>
            <li>
              <span className="playCnt">청취 횟수</span>
              <p>등록한 모든 클립의 청취 횟수</p>
            </li>
            <li>
              <span className="goodCnt">받은 좋아요</span>
              <p>등록한 모든 클립의 받은 좋아요 수</p>
            </li>
            <li>
              <span className="byeolCnt">받은 선물</span>
              <p>등록한 모든 클립의 받은 선물 수</p>
            </li>
          </ul>
        </div>

        <button
          className="btnClose"
          onClick={() =>
            props.setPopState((prevState) => ({
              ...prevState,
              popClipInfo: false,
            }))
          }
        >
          닫기
        </button>
      </div>
    </div>
  );
};
