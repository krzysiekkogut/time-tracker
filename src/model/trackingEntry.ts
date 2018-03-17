export interface TrackingEntry {
    id: string;
    start: Date;
    end: Date | null;
    activityId: string;
}