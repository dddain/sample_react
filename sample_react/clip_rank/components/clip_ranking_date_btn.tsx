import React, { useContext } from "react";

import { DATE_TYPE } from "../constant";
import { ClipRankContext } from "context/clip_rank_ctx";

export default function ClipRankDateBtn() {
  const { clipRankState, clipRankAction } = useContext(ClipRankContext);
  const { formState } = clipRankState;
  const formDispatch = clipRankAction.formDispatch!;

  return (
    <div className="dateButtonBox">
      <button
        className={`btn ${
          formState.dateType === DATE_TYPE.DAY ? "active" : ""
        }`}
        onClick={() => {
          formDispatch({ type: "DATE_TYPE", val: DATE_TYPE.DAY });
        }}
      >
        일간
      </button>

      <button
        className={`btn ${
          formState.dateType === DATE_TYPE.WEEK ? "active" : ""
        }`}
        onClick={() => {
          formDispatch({ type: "DATE_TYPE", val: DATE_TYPE.WEEK });
        }}
      >
        주간
      </button>
    </div>
  );
}
