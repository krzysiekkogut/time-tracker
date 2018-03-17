import { Activity } from './activity';
import { TrackingEntry } from './trackingEntry';

export interface UserData {
    activities: Activity[];
    tracking: TrackingEntry[];
    latestTrackingEntry?: TrackingEntry;
    historicalTracking: TrackingEntry[];
}