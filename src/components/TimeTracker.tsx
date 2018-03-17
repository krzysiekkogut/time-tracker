import * as React from 'react';
import { v4 as GuidV4 } from 'uuid';

import { UserData } from '../model/userData';
import ActivityRepository from '../dataAccess/activityRepository';
import TrackingRepository from '../dataAccess/trackingRepository';
import { Header } from './Header';
import { NewActiity } from './NewActivity';
import { TrackingEntry } from '../model/trackingEntry';

export class TimeTracker extends React.Component<{}, UserData> {

    constructor(props: {}) {
        super(props);

        this.state = {
            activities: [],
            tracking: [],
            historicalTracking: []
        };
    }

    componentWillMount() {
        this.loadUserData();
    }

    loadUserData = async () => {
        const activities = await ActivityRepository.getAllAsync();
        const tracking = await TrackingRepository.getAllAsync();
        const latestTrackingEntry = tracking.length === 0 ? null : tracking.find(entry => entry.end === null);

        const newState: UserData = {
            activities: activities,
            tracking: tracking,
            historicalTracking: []
        };
        if (latestTrackingEntry) {
            newState.latestTrackingEntry = latestTrackingEntry;
        }

        this.setState(newState);
    }

    startTracking = async (activityName: string) => {
        const activity = await ActivityRepository.addAsync(activityName);
        const now = new Date();
        const newTrackingEntry: TrackingEntry = {
            id: GuidV4(),
            start: now,
            end: null,
            activityId: activity.id,
        };
        await TrackingRepository.addAsync(newTrackingEntry);
        
        await this.loadUserData();
    }

    render() {
        return (
            <div>
                <Header />
                <NewActiity
                    latestTrackingEntry={this.state.latestTrackingEntry}
                    startTracking={this.startTracking}
                />

                <hr />

                <div>
                    <h1>Activities details</h1>
                    {/* Activities:
                            - grouped by activity id (name),
                            - timespan calculated,
                            - sorted by timespan desc
                    */}
                </div>
            </div>
        );
    }
}
