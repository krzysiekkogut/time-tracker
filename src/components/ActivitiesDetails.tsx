import * as React from 'react';
import { Pie, ChartData } from 'react-chartjs-2';
import { ChartData as ChartJsData } from 'chart.js';
import * as moment from 'moment';
import { Button, Table, Row, Col } from 'antd';

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
        const colDefs = [{
            title: 'Activity name',
            dataIndex: 'activityName',
            key: 'ACTIVITY_NAME_COLUMN'
        }, {
            title: 'Duration',
            dataIndex: 'durationString',
            key: 'DURATION_COLUMN'
        }];
        const controlsWidth = '85%';

        return (
            <div>
                {
                    trackingAggregatedAndSorted.length === 0
                        ? <p>No activities tracked.</p>
                        : (
                            <div>
                                <Row>
                                    <Col xs={0} sm={12}>
                                        <Pie
                                            data={this.convertToChartJsData(trackingAggregatedAndSorted)}
                                            options={{
                                                legend: {
                                                    position: 'left'
                                                },
                                                tooltips: {
                                                    callbacks: {
                                                        label: (tooltipItem, data) => {
                                                            return data.labels![tooltipItem.index!];
                                                        }
                                                    }
                                                },
                                            }}
                                        />
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Table
                                            dataSource={trackingAggregatedAndSorted}
                                            columns={colDefs}
                                            style={{ marginLeft: 'auto', marginRight: 'auto', width: controlsWidth }}
                                            pagination={false}
                                            rowKey={(record: ActivityDetails) =>
                                                `ACTIVITY_DETAILS_TABLE_ROW_${record.activityName}`}
                                        />
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: '2vh' }}>
                                    <Col>
                                        <Button
                                            onClick={this.props.resetTracking}
                                            type="danger"
                                            size="large"
                                            style={{ width: controlsWidth }}
                                        >
                                            Reset
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        )
                }
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
}
