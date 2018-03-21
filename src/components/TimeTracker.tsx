import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { v4 as GuidV4 } from 'uuid';
import * as moment from 'moment';
import { Layout } from 'antd';

import ActivityRepository from '../dataAccess/activityRepository';
import TrackingRepository from '../dataAccess/trackingRepository';
import { NewActivity } from './NewActivity';
import { ActivitiesDetails } from './ActivitiesDetails';
import { Activity } from '../model/activity';
import { TrackingEntry } from '../model/trackingEntry';

import './TimeTracker.css';
import { Header } from './Header';

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
        const latestActivityName =
            latestTrackingEntry
                ? this.state.activities.find(activity => activity.id === latestTrackingEntry.activityId)!.name
                : null;

        const newActivityComponent = () => (
            <NewActivity
                activities={this.state.activities}
                latestTrackingEntry={latestTrackingEntry}
                latestActivityName={latestActivityName}
                startTracking={this.startTracking}
            />
        );
        const activitiesDetailsComponent = () => (
            <ActivitiesDetails
                tracking={this.state.tracking}
                activities={this.state.activities}
                resetTracking={this.resetTracking}
            />
        );

        return (
            <BrowserRouter>
                <Layout style={{ height: '100vh' }}>
                    <Header />
                    <Layout.Content
                        style={{
                            textAlign: 'center',
                            paddingTop: '2vh',
                            overflowY: 'auto'
                        }}
                    >
                        <Switch>
                            <Route path="/details" exact={true} component={activitiesDetailsComponent} />
                            <Route component={newActivityComponent} />
                        </Switch>
                    </Layout.Content>
                    <Layout.Footer
                        style={{
                            textAlign: 'center',
                            borderTop: '1px solid rgb(232, 232, 232)',
                        }}
                    >
                        <a
                            href="https://www.linkedin.com/in/krzysztofkogut/"
                            title="LinkedIn profile"
                            target="_blank"
                            rel="noopener"
                        >
                            Krzysztof Kogut &copy; 2018
                        </a>
                    </Layout.Footer>
                </Layout>
            </BrowserRouter>
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
            start: moment.utc().valueOf(),
            end: null,
            activityId: activity.id,
        };
        await TrackingRepository.addAsync(newTrackingEntry);
        await this.loadUserData();
    }

    private resetTracking = async () => {
        await TrackingRepository.clearAllAsync();
        await ActivityRepository.clearAllAsync();
        await this.loadUserData();
    }
}
