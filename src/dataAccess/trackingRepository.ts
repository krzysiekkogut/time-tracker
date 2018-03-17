import { TrackingEntry } from '../model/trackingEntry';

class TrackingRepository {
    private static trackingKey: string = 'TRACKING_ENTRIES';

    getAllAsync = async (): Promise<TrackingEntry[]> => {
        const trackingJson = localStorage.getItem(TrackingRepository.trackingKey);
        if (trackingJson) {
            const parsedObject = JSON.parse(trackingJson as string);
            return parsedObject instanceof Array ? parsedObject : [];
        }

        return [];
    }

    addAsync = async (newTrackingEntry: TrackingEntry): Promise<TrackingEntry> => {
        const tracking = await this.getAllAsync();
        if (tracking.length > 0) {
            const indexOfLatest = tracking.findIndex(entry => entry.end === null);
            tracking[indexOfLatest].end = newTrackingEntry.start;
        }

        tracking.push(newTrackingEntry);
        localStorage.setItem(TrackingRepository.trackingKey, JSON.stringify(tracking));
        return newTrackingEntry;
    }

}

export default new TrackingRepository();
