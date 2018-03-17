import * as React from 'react';
import { TrackingEntry } from '../model/trackingEntry';

interface NewActivityProps {
    latestTrackingEntry: TrackingEntry | undefined;
    startTracking: (activityName: string) => Promise<void>;
}

export class NewActiity extends React.Component<NewActivityProps, { newActivityName: string }> {

    constructor(props: NewActivityProps) {
        super(props);

        this.state = {
            newActivityName: ''
        };
    }

    onActivityNameChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            newActivityName: event.currentTarget.value
        });
    }

    render() {
        return (
            <div>
                <h1>New activity</h1>
                <button
                    disabled={this.state.newActivityName.length === 0}
                    onClick={() => this.props.startTracking(this.state.newActivityName)}
                >
                    Next activity
                </button>
                <input
                    placeholder="Activity name"
                    value={this.state.newActivityName}
                    onChange={this.onActivityNameChange}
                />
                {
                    this.props.latestTrackingEntry
                    && <p>Latest activity started at: {this.props.latestTrackingEntry.start}</p>}
            </div >
        );
    }
}
