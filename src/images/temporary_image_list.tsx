import { Image } from "./interfaces";
import * as React from "react";

export interface TempImageListProps {
    images: Image[];
}

/** As the name suggests, this is just a temporary thing so that we can view
 * images as they come in. */
export function TemporaryImageList({images}: TempImageListProps) {
    return <div>
        {images.map(function (x, y) {
            return (<div className="row" key={y} >
                <div className="col-sm-12">
                    {
                        (x.attachment_processed_at) ?
                            <img src={x.attachment_url} /> :
                            <p> Image {x.id} is still processing. </p>}
                </div>
            </div>);
        })}
    </div>;
}
