// libs common func clip
export const refreshClip = (clipAction: any, type?: string) => {
  if (scrollY !== 0) {
    window.scrollTo(0, scrollY);
  }
  if (type === "popular") {
    clipAction.setClipRefresh((prevState) => ({
      ...prevState,
      popular: true,
    }));
  } else if (type === "liveList") {
    clipAction.setClipRefresh((prevState) => ({
      ...prevState,
      liveList: true,
    }));
  }
  setTimeout(() => {
    clipAction.setClipRefresh((prevState) => ({
      ...prevState,
      popular: false,
      liveList: false,
    }));
  }, 340);
};

export const isHitBottom = () => {
  const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
  const body = document.body;
  const html = document.documentElement;
  const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  const windowBottom = windowHeight + window.pageYOffset;
  const diff = 300;

  return windowBottom >= docHeight - diff;
};

export const fixedCategory = (clipAction, refInfomation) => {
  const { liveRef } = refInfomation;
  const liveNode = liveRef.current;
  if (window.scrollY >= liveNode.offsetTop - 52) {
    clipAction.setFixedScrollInfo({ fixedState: true, scrollSectionHeight: liveNode.offsetTop });
  } else {
    clipAction.setFixedScrollInfo({ fixedState: false, scrollSectionHeight: 0 });
  }
};

export const handleScroll = () => {
  const item = document.getElementsByClassName("live_clip_wrap")[0] as HTMLElement;
  window.scrollTo({ top: item.offsetTop, behavior: "smooth" });
  setTimeout(() => {}, 150);
};
