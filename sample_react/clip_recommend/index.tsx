import React, { useState, useEffect, useContext } from "react";
import { getMarketingClipList } from "common/api";
import Layout from "common/layout";
import Header from "common/ui/header";
import { convertDateFormat } from "lib/dalbit_moment";
import ClipRecommendHandleDateBtn from "./components/clip_recommend_handle_date_btn";
import ClipRecommendMainClip from "./components/clip_recommend_main_clip";
import ClipRecommendSubClipList from "./components/clip_recommend_sub_clip_list";
import { GlobalContext } from "context/global_ctx";
import "./index.scss";

type objType = {
  recDate: string;
  time: string;
  clipNo: string;
  clipMemNo: string;
  regCnt: number;
  isFan: boolean;
  titleMsg: string;
  byeolCnt: number;
  goodCnt: number;
  replyCnt: number;
  bannerUrl: string;
  thumbUrl: string;
  fbookUrl: string;
  instaUrl: string;
  ytubeUrl: string;
  subjectType: string;
  subjectName: string;
  title: string;
  memNo: string;
  nickNm: string;
  descMsg: string;
};

type listType = {
  clipNo: string;
  bgImg: {
    thumb150x150: string;
  };
  fileName: string;
  filePlay: string;
  subjectType: string;
  subjectName: string;
  title: string;
  memNo: string;
  nickName: string;
  gender: string;
  isLeader: boolean;
  byeolCnt: number;
  goodCnt: number;
  replyCnt: number;
};

function ClipRecommend() {
  const { globalState, globalAction } = useContext(GlobalContext);
  const dateState = convertDateFormat(globalState.dateState, "YYYY-MM-DD");

  const [mainClip, setMainClip] = useState<objType>({
    recDate: "",
    time: "",
    clipNo: "",
    clipMemNo: "",
    regCnt: 0,
    isFan: false,
    titleMsg: "",
    byeolCnt: 0,
    goodCnt: 0,
    replyCnt: 0,
    bannerUrl: "",
    thumbUrl: "",
    fbookUrl: "",
    instaUrl: "",
    ytubeUrl: "",
    subjectType: "",
    subjectName: "",
    title: "",
    memNo: "",
    nickNm: "",
    descMsg: "",
  });
  const [clipList, setClipList] = useState<Array<listType>>([]);
  const [clipNo, setClipNo] = useState("");
  const [isShowToggle, setIsShowToggle] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await getMarketingClipList({
        recDate: dateState,
        isLogin: globalState.baseData.isLogin,
        isClick: true,
      });
      if (result === "success") {
        let length = data.recommendInfo.descMsg.split("\n").length;
        if (length > 2) {
          setIsShowToggle(true);
        } else {
          setIsShowToggle(false);
        }
        setMainClip(data.recommendInfo);
        setClipList(data.list);
        setClipNo(data.recommendInfo.clipNo);
      } else {
        globalAction.setAlertStatus!({
          status: true,
          content: `${message}`,
        });
      }
    };
    fetchData();
  }, [dateState]);

  return (
    <Layout>
      <Header title="주간 클립테이블" />
      <div id="clipRecommend" className="subContent gray">
        {mainClip && (
          <>
            <ClipRecommendHandleDateBtn date={mainClip.time} />
            <ClipRecommendMainClip
              mainClip={mainClip}
              isShowToggle={isShowToggle}
            />
          </>
        )}

        <ClipRecommendSubClipList
          mainClip={mainClip}
          clipList={clipList}
          clipNo={clipNo}
        />
      </div>
    </Layout>
  );
}

export default ClipRecommend;
