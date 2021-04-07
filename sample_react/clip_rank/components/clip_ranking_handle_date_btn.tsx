import React, { useCallback, useContext, useMemo } from "react";

import { calcDateFormat, convertDateFormat } from "lib/dalbit_moment";
import { convertMonday } from "lib/rank_fn";
import { DATE_TYPE } from "../constant";
import { ClipRankContext } from "context/clip_rank_ctx";

export default function ClipRankHandleDateBtn() {
  const { clipRankState, clipRankAction } = useContext(ClipRankContext);

  const { formState } = clipRankState;
  const formDispatch = clipRankAction.formDispatch!;

  const isEqualDateFormat = useMemo(() => {
    if (formState.dateType === DATE_TYPE.DAY) {
      return (
        formState.rankingDate === convertDateFormat(new Date(), "YYYY-MM-DD")
      );
    } else {
      return (
        formState.rankingDate ===
        convertDateFormat(convertMonday(), "YYYY-MM-DD")
      );
    }
  }, [formState]);

  const isEqualChangeDate = useMemo(() => {
    if (formState.dateType === DATE_TYPE.DAY) {
      return formState.rankingDate === calcDateFormat(new Date(), -1);
    } else {
      return formState.rankingDate === calcDateFormat(convertMonday(), -7);
    }
  }, [formState]);

  const isLastPrev = useMemo(() => {
    const minDate = "2021-02-01";
    if (formState.rankingDate <= minDate) {
      return true;
    } else {
      return false;
    }
  }, [formState.rankingDate]);

  const changeDate = useCallback(
    (handle) => {
      const calcNumber = formState.dateType === DATE_TYPE.DAY ? 1 : 7;
      if (handle === "prev") {
        formDispatch({
          type: "CHANGE_DATE",
          val: calcDateFormat(
            formState.rankingDate,
            parseInt(`-${calcNumber}`)
          ),
        });
      } else {
        formDispatch({
          type: "CHANGE_DATE",
          val: calcDateFormat(formState.rankingDate, calcNumber),
        });
      }
    },
    [formState]
  );

  const dateTitle = useMemo(() => {
    if (formState.dateType === DATE_TYPE.DAY) {
      if (isEqualDateFormat) {
        return "오늘 실시간";
      } else if (isEqualChangeDate) {
        return "어제";
      } else {
        return convertDateFormat(formState.rankingDate, "YYYY.MM.DD");
      }
    } else {
      if (isEqualDateFormat) {
        return "이번주 실시간";
      } else if (isEqualChangeDate) {
        return "지난주";
      } else {
        let year = formState.rankingDate.slice(0, 4);
        let month = formState.rankingDate.slice(5, 7);
        let day = parseInt(formState.rankingDate.slice(8, 10));
        let date = `${year}.${month}.${Math.ceil(day / 7)}주`;
        return date;
      }
    }
  }, [formState]);

  return (
    <div className="dateHandleButtonBox">
      <button
        className={`btn Prev ${isLastPrev ? "" : " active"}`}
        disabled={isLastPrev}
        onClick={() => {
          changeDate("prev");
        }}
      >
        이전
      </button>

      <h3>{dateTitle}</h3>

      <button
        className={`btn Next ${isEqualDateFormat ? "" : " active"}`}
        disabled={isEqualDateFormat}
        onClick={() => {
          changeDate("next");
        }}
      >
        다음
      </button>
    </div>
  );
}
