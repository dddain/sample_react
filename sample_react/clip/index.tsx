import React from "react";

import { ClipProvider } from "context/clip_ctx";
import ClipMain from "./clip_main";

import "./clip.scss";

export default function Clip() {
  return (
    <ClipProvider>
      <ClipMain />
    </ClipProvider>
  );
}
