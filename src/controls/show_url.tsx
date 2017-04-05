import * as React from "react";
import { FallbackImg } from "../ui/fallback_img";
import { PLACEHOLDER_FARMBOT, WEBCAM_ERROR } from "../images/index";

export const showUrl = (url: string, dirty: boolean) => {
  if (dirty) {
    return <p>Press save to view.</p>;
  } else {
    if (url.includes(PLACEHOLDER_FARMBOT)) {
      return <div className="webcam-stream-unavailable">
        <FallbackImg className="webcam-stream"
          src={url}
          fallback={WEBCAM_ERROR} />
        <text>
          Camera stream not available.
          <br />
          Press <b>EDIT</b> to add a stream.
        </text>
      </div>;
    } else {
      return <FallbackImg className="webcam-stream"
        src={url}
        fallback={WEBCAM_ERROR} />;
    };
  };
};
