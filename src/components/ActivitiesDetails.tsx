import * as React from 'react';
import { Pie, ChartData } from 'react-chartjs-2';
import { ChartData as ChartJsData } from 'chart.js';
import * as moment from 'moment';

import { TrackingEntry } from '../model/trackingEntry';
import { Activity } from '../model/activity';

interface ActivityDetails {
    activityName: string;
    percent: number;
    durationString: string;
    colorHex: string;
}

interface ActivitiesDetailsProps {
    tracking: TrackingEntry[];
    activities: Activity[];
    resetTracking: () => Promise<void>;
}

export class ActivitiesDetails extends React.Component<ActivitiesDetailsProps> {

    render() {
        const trackingAggregatedAndSorted = this.aggregateAndSortTracking();

        return (
            <div>
                <h1>Activities details</h1>
                {
                    trackingAggregatedAndSorted.length === 0
                        ? <p>No activities tracked.</p>
                        : (
                            <div>
                                <Pie
                                    data={this.convertToChartJsData(trackingAggregatedAndSorted)}
                                    options={{ tooltips: { enabled: false } }}
                                />
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Activity name</th>
                                            <th>Percent</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            trackingAggregatedAndSorted.map(this.createActivityRow)
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )
                }
                <button onClick={this.props.resetTracking}>Reset</button>
            </div>
        );
    }

    private aggregateAndSortTracking = (): ActivityDetails[] => {
        if (this.props.tracking.length === 0) {
            return [];
        }

        const now = moment();
        const firstActivityStart = moment(this.props.tracking.sort((a, b) => a.start < b.start ? -1 : 1)[0].start);
        const reportDuration = now.diff(firstActivityStart);

        const activities =
            this
                .props
                .tracking
                .map(entry => {
                    const duration = moment(entry.end || now).diff(moment(entry.start));
                    const activity = this.props.activities.find(a => a.id === entry.activityId)!;
                    return {
                        activityName: activity.name,
                        colorHex: activity.colorHex,
                        durationString: this.getDurationString(duration),
                        percent: duration / reportDuration,
                    };
                });

        const mapForGroupping = new Map<string, ActivityDetails>();
        activities.forEach(activity => {
            if (mapForGroupping.has(activity.activityName)) {
                const activityAlreadyInMap = mapForGroupping.get(activity.activityName)!;
                activityAlreadyInMap.percent += activity.percent;
                mapForGroupping.set(activity.activityName, activityAlreadyInMap);
            }

            mapForGroupping.set(activity.activityName, activity);
        });

        const activitiesGroupped: ActivityDetails[] = [];
        mapForGroupping.forEach(value => activitiesGroupped.push(value));
        return activitiesGroupped.sort(this.compareActivities);
    }

    private getDurationString = (durationMilliseconds: number): string => {
        const secondInMilliseconds = 1000;
        const minuteInMilliseconds = 60 * secondInMilliseconds;
        const hourInMilliseconds = 60 * minuteInMilliseconds;
        const dayInMilliseconds = 24 * hourInMilliseconds;

        let result = '';

        if (durationMilliseconds >= dayInMilliseconds) {
            result += `${Math.floor(durationMilliseconds / dayInMilliseconds)}d `;
            durationMilliseconds %= dayInMilliseconds;
        }

        result += `${('00' + Math.floor(durationMilliseconds / hourInMilliseconds)).substr(-2, 2)}h:`;
        durationMilliseconds %= hourInMilliseconds;

        result += `${('00' + Math.floor(durationMilliseconds / minuteInMilliseconds)).substr(-2, 2)}m`;
        durationMilliseconds %= minuteInMilliseconds;

        return result;
    }

    private compareActivities = (a: ActivityDetails, b: ActivityDetails): number => {
        return a.percent < b.percent
            ? 1
            : (
                a.percent === b.percent
                    ? (a.activityName < b.activityName ? -1 : 1)
                    : -1);
    }

    private convertToChartJsData = (activitiesDetails: ActivityDetails[]): ChartData<ChartJsData> => {
        return {
            labels: activitiesDetails.map(act => act.activityName),
            datasets: [{
                data: activitiesDetails.map(activity => activity.percent),
                backgroundColor: activitiesDetails.map(activity => activity.colorHex)
            }]
        };
    }

    private createActivityRow = (activityDetails: ActivityDetails): JSX.Element => {
        return (
            <tr key={`ACTIVITY_DETAILS_${activityDetails.activityName}`}>
                <td>{activityDetails.activityName}</td>
                <td>{activityDetails.durationString}</td>
            </tr>
        );
    }
}
