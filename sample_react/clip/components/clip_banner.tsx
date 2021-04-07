import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SwiperSlide } from "swiper/react";

import { getBanner } from "common/api";
import DalbitSwiper from "common/ui/dalbit_swiper";

interface BannerListType {
  bannerUrl: string;
  buttonNm: string;
  contents: string;
  idx: number;
  is_button_view: number;
  is_cookie: number;
  is_title_view: number;
  linkType: string;
  linkUrl: string;
  popup_type: number;
  thumbsUrl: string;
  title: string;
}

const swiperProps = {
  slidesPerView: "auto",
  spaceBetween: 10,
  autoHeight: true,
};

export default function ClipBanner() {
  const history = useHistory();

  const [bannerList, setBannerList] = useState<BannerListType[]>([]);
  const [bannerView, setBannerView] = useState<boolean>(false);

  async function getBannerData(position: number) {
    const res = await getBanner({ position: position });
    if (res.result === "success") {
      if (res.hasOwnProperty("data")) setBannerList(res.data);
    } else {
      console.log(res.result, res.message);
    }
  }

  useEffect(() => {
    getBannerData(10);
  }, []);

  return (
    <div className="banner_clip_wrap">
      {/* Banner Collapsed */}
      <div className={`banner_slide${bannerView === false ? "" : " active"}`}>
        <button className={`more_button${bannerView === true ? " active" : ""}`} onClick={() => setBannerView(!bannerView)} />

        {bannerList && bannerList.length > 0 && (
          <DalbitSwiper {...swiperProps}>
            {bannerList.map(({ bannerUrl, linkUrl, title }, idx) => (
              <SwiperSlide key={`banner-${idx}`}>
                <div className="banner">
                  <img src={bannerUrl} alt={title} onClick={() => history.push(linkUrl)} />
                </div>
              </SwiperSlide>
            ))}
          </DalbitSwiper>
        )}
      </div>

      {/* Banner Opened */}
      <ul className={`banner_list ${bannerView === true ? "active" : ""}`}>
        {bannerList &&
          bannerList.length > 0 &&
          bannerList.map(({ bannerUrl, linkUrl, title }, idx) => (
            <li className="banner_item" key={`banner-${idx}`}>
              {idx === 0 && (
                <button
                  className={`more_button${bannerView === true ? " active" : ""}`}
                  onClick={() => setBannerView(!bannerView)}
                />
              )}
              <img
                src={bannerUrl}
                alt={title}
                onClick={() => {
                  history.push(linkUrl);
                }}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}
