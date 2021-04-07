import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { isHybrid } from "lib/mobile/hybrid";
import { ClipContext } from "context/clip_ctx";
import { GlobalContext } from "context/global_ctx";
import { fixedCategory } from "./lib";
import { getClipType } from "common/api";
import { getCookie } from "common/utility/cookie";
import { useClipMobileHelper } from "lib/mobile/clip";
import Layout from "common/layout";
import Header from "common/ui/header";

import MyClip from "./components/clip_my\clip";
import BannerContent from "./components/clip_banner";
import PopularRecommend from "./components/clip_popular_recommend";
import RecentClip from "./components/clip_recent";
import LiveClip from "./components/clip_liveList";
import SortPopUp from "./components/clip_sort_pop";
import BestSlider from "./components/clip_best";
import ClipRank from "./components/clip_rank";
import MarketingClip from "./components/clip_marketing";
import MyClipInfoPopUp from "./components/clip_myInfo_layer";
import LayerAdminPopup from "../main/component/layers/layer_admin";

export default function ClipMain() {
  const history = useHistory();
  const { clipReg } = useClipMobileHelper();
  // ref
  const liveRef = useRef<any>();

  // ctx
  const { globalState, globalAction } = useContext(GlobalContext);
  const { clipAction } = useContext(ClipContext);
  const { baseData } = globalState;

  const [popState, setPopState] = useState<{
    [key: string]: boolean;
  }>({
    detailPopup: false,
    popClipInfo: false,
  });
  const osType = JSON.parse(getCookie("custom-header")).os;

  //api call
  const fetchDataClipType = async () => {
    const { result, data, message } = await getClipType({});
    if (result === "success") {
      if (clipAction) {
        clipAction.setClipType!(data);
      }
    } else {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: `${message}`,
      });
    }
  };

  const scrollEvent = () => {
    fixedCategory(clipAction, { liveRef });
  };

  const popUpRender = () => {
    if (popState.detailPopup) {
      return <SortPopUp setPopState={setPopState} />;
    } else if (popState.popClipInfo) {
      return <MyClipInfoPopUp setPopState={setPopState} />;
    }
  };

  useLayoutEffect(() => {
    window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };
  }, []);

  useEffect(() => {
    fetchDataClipType();
  }, []);

  return (
    <Layout>
      <Header type="noBack">
        <span
          className="searchIcon"
          onClick={() =>
            history.push({
              pathname: "/menu/search",
              state: {
                state: "clip_search",
              },
            })
          }
        />
        <h2 className="headerTitle">클립</h2>
      </Header>

      <div id="clip_page" className="subContent">
        {baseData.isLogin && (
          <section>
            <div className="clipRegWrap">
              <button
                className="btnClip"
                onClick={() => {
                  if (osType === 3) {
                    if (isHybrid()) {
                      history.push("/clip_recording");
                    } else {
                      globalAction.setAppDownLayer!({ status: true, type: 3 });
                    }
                  } else {
                    clipReg("recording");
                  }
                }}
              >
                클립 녹음
              </button>
              <button
                className="btnClip"
                onClick={() => {
                  if (osType === 3) {
                    if (isHybrid()) {
                      history.push("/clip_upload");
                    } else {
                      globalAction.setAppDownLayer!({ status: true, type: 3 });
                    }
                  } else {
                    clipReg("upload");
                  }
                }}
              >
                클립 업로드
              </button>
            </div>
            <MyClip setPopState={setPopState} />
          </section>
        )}

        <section>
          <PopularRecommend />
          <ClipRank />
          <BannerContent />
          <MarketingClip />
          <RecentClip />
          <BestSlider />
        </section>

        <section ref={liveRef}>
          <LiveClip setPopState={setPopState} />
        </section>

        {popUpRender()}
        {/* {adminPopupData.length > 0 && <LayerAdminPopup adminPopupData={adminPopupData} setAdminPopupData={setAdminPopupData} />} */}
        <LayerAdminPopup position={13} />
      </div>
    </Layout>
  );
}
