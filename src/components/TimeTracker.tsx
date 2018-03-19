import * as React from 'react';
import { v4 as GuidV4 } from 'uuid';
import * as moment from 'moment';

import ActivityRepository from '../dataAccess/activityRepository';
import TrackingRepository from '../dataAccess/trackingRepository';
import { Header } from './Header';
import { NewActivity } from './NewActivity';
import { ActivitiesDetails } from './ActivitiesDetails';
import { Activity } from '../model/activity';
import { TrackingEntry } from '../model/trackingEntry';

interface UserData {
    activities: Activity[];
    tracking: TrackingEntry[];
}

export class TimeTracker extends React.Component<{}, UserData> {

    constructor(props: {}) {
        super(props);

        this.state = {
            activities: [],
            tracking: []
        };
    }

    componentWillMount() {
        this.loadUserData();
    }

    render() {
        const latestTrackingEntry =
            this.state.tracking.length === 0
                ? null
                : this.state.tracking.find(entry => entry.end === null)!;

        return (
            <div>
                <Header />
                <NewActivity
                    latestTrackingEntry={latestTrackingEntry}
                    startTracking={this.startTracking}
                />
                <ActivitiesDetails
                    tracking={this.state.tracking}
                    activities={this.state.activities}
                    resetTracking={this.resetTracking}
                />
            </div>
        );
    }

    private loadUserData = async () => {
        const activities = await ActivityRepository.getAllAsync();
        const tracking = await TrackingRepository.getAllAsync();

        const newState: UserData = {
            activities: activities,
            tracking: tracking
        };

        this.setState(newState);
    }

    private startTracking = async (activityName: string) => {
        const activity = await ActivityRepository.addAsync(activityName);
        const newTrackingEntry: TrackingEntry = {
            id: GuidV4(),
            start: moment().valueOf(),
            end: null,
            activityId: activity.id,
        };
        await TrackingRepository.addAsync(newTrackingEntry);
        await this.loadUserData();
    }

    private resetTracking = async () => {
        await TrackingRepository.clearAllAsync();
        await this.loadUserData();
    }
}
