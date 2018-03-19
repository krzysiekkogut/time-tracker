import * as React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { v4 as GuidV4 } from 'uuid';
import * as moment from 'moment';
import { Layout, Menu, Icon, Divider } from 'antd';

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

        const newActivityComponent = () => (
            <NewActivity
                latestTrackingEntry={latestTrackingEntry}
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
                    <Layout.Sider collapsible={true} breakpoint="md">
                        <Menu>
                            <Menu.Item>
                                <Link to="/new">
                                    <Icon type="play-circle-o" />
                                    <span>New activity</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to="/details">
                                    <Icon type="bars" />
                                    <span>Details</span>
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Layout.Sider>
                    <Layout style={{ minWidth: '240px', overflowX: 'auto' }}>
                        <Layout.Content
                            style={{
                                textAlign: 'center',
                                paddingTop: '2vh',
                                overflowY: 'auto'
                            }}
                        >
                            <Header />
                            <Divider />
                            <Switch>
                                <Route path="/details" component={activitiesDetailsComponent} />
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
                            >
                                Krzysztof Kogut &copy; 2018
                            </a>
                        </Layout.Footer>
                    </Layout>
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
