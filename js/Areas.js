'use strict';

import {
    Area
} from './Area.js';
import {
    Position
} from './Position.js';

export class Areas {

    constructor(map, featureGroup) {
        this.map = map;
        this.featureGroup = featureGroup;
        this.areas = [];
        this.rectangles = [];
    }

    add(area) {
        this.areas.push(area);
        var rectangle = area.toLeaflet(this.map);
        this.rectangles.push(rectangle);
        this.featureGroup.addLayer(rectangle);
    }

    removeLast() {
        if (this.areas.length > 0) {
            this.areas.pop();
            this.featureGroup.removeLayer(this.rectangles.pop());
        }
    }

    removeAll() {
        while (this.areas.length > 0) {
            this.areas.pop();
            this.featureGroup.removeLayer(this.rectangles.pop());
        }
    }

    show(map) {
        map.addLayer(this.featureGroup);
    }

    hide(map) {
        map.removeLayer(this.featureGroup);
    }

    fromString(text) {
        this.removeAll();
        text = text.replace(/\s/g, '');
        var areasPattern = /(?:newRSArea\(newRSTile\((\d+,\d+,\d)\),newRSTile\((\d+,\d+,\d)\)\))/mg;
        var match;
        while ((match = areasPattern.exec(text))) 
		{
                var pos1Values = match[1].split(",");
                var pos2Values = match[2].split(",");
              
                this.add(new Area(new Position(pos1Values[0], pos1Values[1], pos1Values[2]), new Position(pos2Values[0], pos2Values[1], pos2Values[2])));
        }
    }

    toArrayString() {
        if (this.areas.length === 1) {
            return "RSArea area = " + this.areas[0].toJavaCode() + ";";
        } else if (this.areas.length > 1) {
            var output = "RSArea[] area = {\n";
            var numAreas = this.areas.length;
            $.each(this.areas, function (index, area) {
                output += "    " + area.toJavaCode();
                if (index !== numAreas - 1) {
                    output += ",";
                }
                output += "\n";
            });

            output += "};";
            return output;
        }
        return "";
    }

    toListString() {
        if (this.areas.length === 1) {
            return this.toArrayString();
        } else if (this.areas.length > 1) {
            var output = "List&lt;RSArea&gt; area = new ArrayList<>();\n";
            $.each(this.areas, function (index, area) {
                output += "area.add(" + area.toJavaCode() + ");\n";
            });
            return output;
        }
        return "";
    }

    toArraysAsListString() {
        return "";
    }

    toRawString() {
        return "";
    }
}