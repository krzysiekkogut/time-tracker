import { Activity } from '../model/activity';
import { TrackingEntry } from '../model/trackingEntry';

interface ExportObject {
    activities: Activity[];
    tracking: TrackingEntry[];
}

export const serialize = (obj: ExportObject): string => {
    return btoa(JSON.stringify(obj));
};

export const deserialize = (objStringifiedBase64: string): ExportObject => {
    return JSON.parse(atob(objStringifiedBase64));
};
