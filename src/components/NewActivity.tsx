import * as React from 'react';
import * as moment from 'moment';

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
        return (
            <div>
                <h1>New activity</h1>
                <input
                    placeholder="Activity name"
                    value={this.state.newActivityName}
                    onChange={this.onActivityNameChange}
                />
                <button
                    disabled={this.state.newActivityName.length === 0}
                    onClick={this.startTracking}
                >
                    Next activity
                </button>
                {
                    this.props.latestTrackingEntry
                    && (
                        <p>
                            Latest activity started at:&nbsp;
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
