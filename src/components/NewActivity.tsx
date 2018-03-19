import * as React from 'react';
import * as moment from 'moment';
import { Input, Button } from 'antd';

import { TrackingEntry } from '../model/trackingEntry';

interface NewActivityProps {
    latestTrackingEntry: TrackingEntry | null;
    startTracking: (activityName: string) => Promise<void>;
}

export class NewActivity extends React.Component<NewActivityProps, { newActivityName: string }> {

    constructor(props: NewActivityProps) {
        super(props);

        this.state = {
            newActivityName: ''
        };
    }

    render() {
        const controlsWidth = '85%';
        return (
            <div>
                <div>
                    <Input
                        placeholder="Activity name"
                        value={this.state.newActivityName}
                        onChange={this.onActivityNameChange}
                        size="large"
                        onPressEnter={this.startTracking}
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
                        Next activity
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
                            Latest activity started at:
                            <br />
                            <span style={{ fontWeight: 'bold' }}>
                                {moment(this.props.latestTrackingEntry.start).format('dddd HH:mm:ss')}
                            </span>
                        </p>
                    )
                }
            </div >
        );
    }

    private onActivityNameChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            newActivityName: event.currentTarget.value
        });
    }

    private startTracking = async () => {
        await this.props.startTracking(this.state.newActivityName);
        this.setState({ newActivityName: '' });
    }
}
