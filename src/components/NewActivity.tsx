import * as React from 'react';
import * as moment from 'moment';
import { AutoComplete, Button } from 'antd';

import { TrackingEntry } from '../model/trackingEntry';
import { Activity } from '../model/activity';
import { getDurationString } from '../helpers/durationHelper';

interface NewActivityProps {
    activities: Activity[];
    latestTrackingEntry: TrackingEntry | null;
    latestActivityName: string | null;
    startTracking: (activityName: string) => Promise<void>;
}

interface NewActivityState {
    newActivityName: string;
    autoCompleteDataSource: string[];
    lastActivityDuration: number;
}

export class NewActivity extends React.Component<NewActivityProps, NewActivityState> {

    private updateLastActivityDurationInterval: NodeJS.Timer;

    constructor(props: NewActivityProps) {
        super(props);

        this.state = {
            newActivityName: '',
            autoCompleteDataSource: [],
            lastActivityDuration: this.props.latestTrackingEntry ? this.getLastActivityDuration() : 0
        };
    }

    componentDidMount() {
        this.setState({
            autoCompleteDataSource:
                this.props.activities.map(a => a.name).sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1)
        });

        this.updateLastActivityDurationInterval = setInterval(
            () => {
                if (this.props.latestTrackingEntry) {
                    this.setState({
                        lastActivityDuration: this.getLastActivityDuration()
                    });
                }
            },
            60 * 1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.updateLastActivityDurationInterval);
    }

    render() {
        const controlsWidth = '85%';
        return (
            <div>
                <div>
                    <AutoComplete
                        placeholder="Activity name"
                        value={this.state.newActivityName}
                        onChange={this.onActivityNameChange}
                        dataSource={this.state.autoCompleteDataSource}
                        size="large"
                        style={{ width: '85%' }}
                    />
                </div>
                <div style={{ marginTop: '2vh' }}>
                    <Button
                        disabled={this.state.newActivityName.length === 0}
                        onClick={this.startTracking}
                        type="primary"
                        icon="play-circle"
                        size="large"
                        style={{ width: '85%' }}
                    >
                        {'Start / Stop'}
                    </Button>
                </div>
                {
                    this.props.latestTrackingEntry
                    && (
                        <p
                            style={{
                                marginTop: '2vh',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: controlsWidth,
                                textAlign: 'left'
                            }}
                        >
                            Latest activity ({this.props.latestActivityName}) started at&nbsp;
                            <span style={{ fontWeight: 'bold' }}>
                                {moment(this.props.latestTrackingEntry.start).format('dddd HH:mm')}
                            </span>
                            &nbsp;and lasts {getDurationString(this.state.lastActivityDuration)}
                        </p>
                    )
                }
            </div >
        );
    }

    private getLastActivityDuration(): number {
        return moment.utc().diff(moment.utc(this.props.latestTrackingEntry!.start));
    }

    private onActivityNameChange = (value: string) => {
        this.setState({
            newActivityName: value,
            autoCompleteDataSource:
                this.props.activities
                    .map(a => a.name)
                    .filter(a => a.toLowerCase().indexOf(value.toLowerCase()) >= 0)
                    .sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1)
        });
    }

    private startTracking = async () => {
        await this.props.startTracking(this.state.newActivityName);
    }
}
