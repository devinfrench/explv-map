'use strict';

import {
    Drawable
} from './Drawable.js';
import {
    Position,
    RS_TILE_WIDTH_PX,
    RS_TILE_HEIGHT_PX
} from './Position.js';

export class PolyArea extends Drawable {

    constructor(featureGroup, map) {
        super(map);
        this.map = map;
        this.positions = [];
        this.polygon = undefined;
        this.featureGroup = featureGroup;
    }

    show(map) {
        map.addLayer(this.featureGroup);
    }

    hide(map) {
        map.removeLayer(this.featureGroup);
    }

    add(position) {
        this.positions.push(position);
        this.featureGroup.removeLayer(this.polygon);
        this.polygon = this.toLeaflet();
        this.featureGroup.addLayer(this.polygon);
    }

    removeLast() {

        if (this.positions.length > 0) {
            this.positions.pop();
            this.featureGroup.removeLayer(this.polygon);
        }

        if (this.positions.length > 0) {
            this.polygon = this.toLeaflet();
            this.featureGroup.addLayer(this.polygon);
        }
    }

    removeAll() {

        while (this.positions.length > 0) {
            this.positions.pop();
            this.featureGroup.removeLayer(this.polygon);
        }

        while (this.positions.length > 0) {
            this.polygon = this.toLeaflet();
            this.featureGroup.addLayer(this.polygon);
        }
    }

    toLeaflet() {

        var latLngs = [];

        for (var i = 0; i < this.positions.length; i++) {
            latLngs.push(this.positions[i].toCentreLatLng(this.map));
        }

        for (var i = 0; i < latLngs.length; i++) {
            var point = this.map.project(latLngs[i], this.map.getMaxZoom());
            point.x -= RS_TILE_WIDTH_PX / 2;
            point.y += RS_TILE_HEIGHT_PX / 2;
            latLngs[i] = this.map.unproject(point, this.map.getMaxZoom());
        }

        return L.polygon(
            latLngs, {
                color: "#33b5e5",
                weight: 1,
                interactive: false
            }
        );
    }

    fromString(text) {
        this.removeAll();
        text = text.replace(/\s/g, '');
        var positionsPattern = /newRSTile\((\d+),(\d+),(\d)\)/mg;

        var match;
        while ((match = positionsPattern.exec(text))) {
            this.add(new Position(match[1], match[2], match[3]));
        }
    }

    toJavaCode() {
        if (this.positions.length == 0) {
            return "";
        }
        var output = "RSArea area = new RSArea(new RSTile[] {";
        for (var i = 0; i < this.positions.length; i++) {
            output += `\n    new RSTile(${this.positions[i].x}, ${this.positions[i].y}, ${this.positions[i].z})`;
            if (i !== this.positions.length - 1) {
                output += ",";
            }
        }
        output += "\n})";
        output += ";";
        return output;
    }

    toRawString() {
        var output = "";
        return output;
    }

    getName() {
        return "Area";
    }
};