import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "context/global_ctx";
import { ClipRankContext } from "context/clip_rank_ctx";
import { DATE_TYPE } from "share/clip_rank/constant";
import { usePlayerBtn } from "lib/hooks/usePlayerBtn";
// api
import { getClipRankingList } from "common/api";

const clipRankingRecords = 100;
const clipRankingCheckIdx = 3;

export default function ClipRank() {
  const history = useHistory();
  const { globalAction } = useContext(GlobalContext);
  const { clipRankState, clipRankAction } = useContext(ClipRankContext);
  const { formState, clipRankList } = clipRankState;
  const { onClipBtnClick } = usePlayerBtn();

  const formDispatch = clipRankAction.formDispatch!;
  const setClipRankList = clipRankAction.setClipRankList!;

  const fetchClipRankingList = async () => {
    const { result, data, message } = await getClipRankingList({
      rankType: formState.dateType,
      rankingDate: formState.rankingDate,
      page: 1,
      records: clipRankingRecords,
    });
    if (result === "success") {
      setClipRankList(data.list.slice(0, clipRankingCheckIdx));
    } else {
      setClipRankList([]);
      globalAction.setAlertStatus!({
        status: true,
        content: `${message}`,
      });
    }
  };

  useEffect(() => {
    fetchClipRankingList();
  }, [formState.dateType]);

  return (
    <>
      {clipRankList.length > 0 ? (
        <div className="rank_clip_wrap">
          <header className="header arrow">
            <h3 onClick={() => history.push("/clip_rank")}>클립 랭킹</h3>
            <div className="button_box">
              <button
                className={`${formState.dateType === DATE_TYPE.DAY ? "active" : ""}`}
                onClick={() => {
                  formDispatch({
                    type: "DATE_TYPE",
                    val: DATE_TYPE.DAY,
                  });
                }}
              >
                일간
              </button>
              <button
                className={formState.dateType === DATE_TYPE.WEEK ? "active" : undefined}
                onClick={() => {
                  formDispatch({
                    type: "DATE_TYPE",
                    val: DATE_TYPE.WEEK,
                  });
                }}
              >
                주간
              </button>
            </div>
          </header>

          <ul>
            {clipRankList.map((v, i) => {
              return (
                <li
                  key={i}
                  onClick={() => {
                    onClipBtnClick({
                      clipNo: v.clipNo,
                      type: "one",
                    });
                  }}
                >
                  <div className="thumb">
                    <img className="rounded_border" src={v.bgImg.thumb336x336} alt="클립 랭킹 이미지" />
                  </div>

                  <p className="title">{v.title}</p>
                  <p className="nick">{v.nickNm}</p>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
