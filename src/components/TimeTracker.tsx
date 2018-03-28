import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import * as moment from 'moment';
import { Layout } from 'antd';

import { ITrackingRepository } from '../dataAccess/trackingRepository';
import { IActivityRepository } from '../dataAccess/activityRepository';
import { NewActivity } from './NewActivity';
import { ActivitiesDetails } from './ActivitiesDetails';
import { Activity } from '../model/activity';
import { TrackingEntry } from '../model/trackingEntry';

import './TimeTracker.css';
import { Header } from './Header';

interface TimeTrackerProps {
    activityRepository: IActivityRepository;
    trackingRepository: ITrackingRepository;
}

interface UserData {
    activities: Activity[];
    tracking: TrackingEntry[];
}

export class TimeTracker extends React.Component<TimeTrackerProps, UserData> {

    constructor(props: TimeTrackerProps) {
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
                ? this.state.activities.find(activity => activity.name === latestTrackingEntry.activityName)!.name
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
                onImport={this.onImport}
                getAllActivities={this.props.activityRepository.getAll}
                getAllTrackingEntries={this.props.trackingRepository.getAll}
                saveAllActivities={this.props.activityRepository.saveAll}
                saveAllTrackingEntries={this.props.trackingRepository.saveAll}
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

    private loadUserData = () => {
        const activities = this.props.activityRepository.getAll();
        const tracking = this.props.trackingRepository.getAll();

        const newState: UserData = {
            activities: activities,
            tracking: tracking
        };

        this.setState(newState);
    }

    private startTracking = (activityName: string, startTime: moment.Moment) => {
        const activity = this.props.activityRepository.add(activityName);
        const newTrackingEntry: TrackingEntry = {
            start: startTime.valueOf(),
            end: null,
            activityName: activity.name,
        };
        this.props.trackingRepository.add(newTrackingEntry);
        this.loadUserData();
    }

    private resetTracking = () => {
        this.props.trackingRepository.clearAll();
        this.props.activityRepository.clearAll();
        this.loadUserData();
    }

    private onImport = () => {
        this.loadUserData();
    }
}
