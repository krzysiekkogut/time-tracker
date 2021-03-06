import { TrackingEntry } from '../model/trackingEntry';

// tslint:disable-next-line:interface-name
export interface ITrackingRepository {
    getAll: () => TrackingEntry[];
    add: (newTrackingEntry: TrackingEntry) => TrackingEntry;
    clearAll: () => void;
    saveAll: (activities: TrackingEntry[]) => void;
}

export class TrackingRepository implements ITrackingRepository {

    private static trackingKey: string = 'TRACKING_ENTRIES';

    getAll = (): TrackingEntry[] => {
        const trackingJson = localStorage.getItem(TrackingRepository.trackingKey);
        if (trackingJson) {
            const parsedObject = JSON.parse(trackingJson as string);
            return parsedObject instanceof Array ? parsedObject : [];
        }

        return [];
    }

    add = (newTrackingEntry: TrackingEntry): TrackingEntry => {
        const tracking = this.getAll();
        if (tracking.length > 0) {
            const indexOfLatest = tracking.findIndex(entry => entry.end === null);
            tracking[indexOfLatest].end = newTrackingEntry.start;
        }

        tracking.push(newTrackingEntry);
        localStorage.setItem(TrackingRepository.trackingKey, JSON.stringify(tracking));
        return newTrackingEntry;
    }

    clearAll = (): void => {
        localStorage.removeItem(TrackingRepository.trackingKey);
    }

    saveAll = (trackingEntries: TrackingEntry[]): void => {
        this.clearAll();
        localStorage.setItem(TrackingRepository.trackingKey, JSON.stringify(trackingEntries));
    }
}
