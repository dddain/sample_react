import React, { useContext, useEffect, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import { IMG_SERVER } from "constant/define";
import Layout from "common/layout";
import Header from "common/ui/header";
import NoResult from "common/ui/no_result";
import { getClipRankingList } from "common/api";
import ClipRankDateBtn from "./components/clip_ranking_date_btn";
import ClipRankHandleDateBtn from "./components/clip_ranking_handle_date_btn";
import ClipRankingList from "./components/clip_ranking_list";
import ClipRankingListTop3 from "./components/clip_ranking_list_top3";
import ClipRankingMyRank from "./components/clip_ranking_my_rank";
import { ClipRankContext } from "context/clip_rank_ctx";
import { GlobalContext } from "context/global_ctx";
import { isHybrid } from "lib/mobile/hybrid";
import "./index.scss";

const records = 100;
const HEADER_HEIGHT = 52;
const CilpRank = () => {
  const history = useHistory();
  const { clipRankState, clipRankAction } = useContext(ClipRankContext);
  const { globalState } = useContext(GlobalContext);
  const { formState, clipRankList } = clipRankState;
  const setClipRankList = clipRankAction.setClipRankList!;
  const setMyInfo = clipRankAction.setMyInfo!;
  const { isMobile } = globalState;
  const isApp = isHybrid();

  const fixedHeaderRef = useRef<HTMLDivElement>(null);
  const rankListRef = useRef<HTMLDivElement>(null);
  const rankWrapRef = useRef<HTMLDivElement>(null);

  let mobileWeb = isMobile && !isApp;

  const windowScrollEvent = useCallback(() => {
    let scroll = window.scrollY || window.pageYOffset;

    const headerNode = fixedHeaderRef.current;
    const rankListNode = rankListRef.current;
    const rankWrapNode = rankWrapRef.current;
    if (scroll >= HEADER_HEIGHT - 1) {
      if (headerNode && !Array.from(headerNode.classList).includes("isFixed")) {
        headerNode.classList.add("isFixed");
      }
      rankWrapNode?.classList.add("isFixed");

      if (rankListNode && headerNode) {
        rankListNode.style.marginTop =
          (rankWrapNode?.offsetHeight || 0) + headerNode.offsetHeight + "px";
      }
    } else {
      headerNode?.classList.remove("isFixed");
      rankWrapNode?.classList.remove("isFixed");
      if (rankListNode) rankListNode.style.marginTop = "0px";
    }
  }, [fixedHeaderRef, rankListRef, rankWrapRef]);

  useEffect(() => {
    async function fetchData() {
      const resParams = {
        rankType: formState.dateType,
        rankingDate: formState.rankingDate,
        page: 1,
        records,
      };
      localStorage.setItem("clipPlayListInfo", JSON.stringify(resParams));
      const res = await getClipRankingList({ ...resParams });
      if (res.result === "success") {
        if (res.data.list.length > 5) {
          setClipRankList(res.data.list);
        } else {
          setClipRankList([]);
        }
        setMyInfo(res.data);
      } else {
        setMyInfo({});
        setClipRankList([]);
      }
    }
    fetchData();
  }, [formState]);

  useEffect(() => {
    if (scrollY >= HEADER_HEIGHT - 1) {
      windowScrollEvent();
      if (scrollY > (rankListRef.current?.offsetHeight || 0) - 704) {
        window.scrollBy(
          0,
          scrollY - ((rankListRef.current?.offsetHeight || 0) - 704)
        );
      }
    }
    window.addEventListener("scroll", windowScrollEvent);
    return () => {
      window.removeEventListener("scroll", windowScrollEvent);
    };
  }, []);

  return (
    <Layout>
      <div id="clipRankingPage" className="subContent gray">
        <Header>
          <h2 className="headerTitle">클립 랭킹</h2>

          <div
            className="benefitButton"
            onClick={() => {
              history.push({
                pathname: `/clip_rank/guidance`,
              });
            }}
          >
            <img
              src={`${IMG_SERVER}/images/clip_rank/benefit@2x.png`}
              width={82}
              alt="혜택"
            />
          </div>
        </Header>

        <div
          className={`dateBtnBox ${isMobile ? "mWeb" : ""}`}
          ref={fixedHeaderRef}
        >
          <ClipRankDateBtn />
          <ClipRankHandleDateBtn />
        </div>

        {clipRankList.length > 0 ? (
          <>
            <div
              className={`rankTop3Wrap ${mobileWeb ? "mWeb" : ""}`}
              ref={rankWrapRef}
            >
              <ClipRankingMyRank />
              <ClipRankingListTop3 />
            </div>
            <div ref={rankListRef}>
              <ClipRankingList />
            </div>
          </>
        ) : (
          <NoResult type="default" text="조회 된 결과가 없습니다." />
        )}
      </div>
    </Layout>
  );
};

export default CilpRank;
