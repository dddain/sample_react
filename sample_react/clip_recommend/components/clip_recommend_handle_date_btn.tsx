import React, { useMemo, useContext } from "react";
import { GlobalContext } from "context/global_ctx";
import { convertDateFormat } from "lib/dalbit_moment";
import { convertMonday } from "lib/rank_fn";
import { calcDate } from "lib/common_fn";

type PropType = {
  date: string;
};
function ClipRecommendHandleDateBtn(props: PropType) {
  const { globalState, globalAction } = useContext(GlobalContext);
  const { date } = props;
  const dateState = convertDateFormat(globalState.dateState, "YYYY-MM-DD");

  const isLast = useMemo(() => {
    const currentDate = convertDateFormat(convertMonday(), "YYYY-MM-DD");
    if (dateState >= currentDate) {
      return true;
    } else {
      return false;
    }
  }, [dateState]);

  const isFirst = useMemo(() => {
    const currentDate = convertDateFormat(new Date("2020-10-26"), "YYYY-MM-DD");
    if (dateState <= currentDate) {
      return true;
    } else {
      return false;
    }
  }, [dateState]);

  return (
    <div className="btnDateBox">
      <button
        className={`prev ${isFirst === true ? " active" : "on"}`}
        disabled={isFirst === true}
        onClick={() => {
          if (globalAction.setDateState) {
            const date = calcDate(new Date(dateState), -7);
            globalAction.setDateState(convertDateFormat(date, "YYYY-MM-DD"));
          }
        }}
      >
        이전
      </button>
      <h3 className="date">{date}</h3>
      <button
        className={`next ${isLast === true ? " active" : "on"}`}
        disabled={isLast === true}
        onClick={() => {
          if (globalAction.setDateState) {
            const date = calcDate(new Date(dateState), 7);
            globalAction.setDateState(convertDateFormat(date, "YYYY-MM-DD"));
          }
        }}
      >
        다음
      </button>
    </div>
  );
}

export default ClipRecommendHandleDateBtn;
