import * as React from "react";
import { DraggableSvgImage } from "../draggable_svg_image";
import { Plant } from "../interfaces";

interface Props {
    plant: Plant;
    onUpdate: (deltaX: number, deltaY: number, idx: number) => void;
    onDrop: (id: number) => void;
}
export function GardenPlant(props: Props) {
    let { plant, onUpdate, onDrop } = props;
    if (plant.id) {
        return <DraggableSvgImage key={plant.id}
            x={plant.x}
            y={plant.y}
            height={32}
            width={32}
            id={plant.id}
            onUpdate={onUpdate}
            onDrop={onDrop}
            href={"/app-resources/img/icons/Sprout-96.png"} />;
    } else {
        throw new Error("Save plants before placing them on the map");
    }
}