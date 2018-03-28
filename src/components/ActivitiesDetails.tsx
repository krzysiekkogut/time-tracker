import * as React from 'react';
import { Pie, ChartData } from 'react-chartjs-2';
import { ChartData as ChartJsData } from 'chart.js';
import * as moment from 'moment';
import { Button, Table, Row, Col, Popconfirm } from 'antd';

import { TrackingEntry } from '../model/trackingEntry';
import { Activity } from '../model/activity';
import { getDurationString } from '../helpers/durationHelper';
import { ExportImportActivities } from './ExportImportActivities';

interface ActivityDetails {
    activityName: string;
    percent: number;
    percentString: string;
    durationString: string;
    colorHex: string;
}

interface ActivitiesDetailsProps {
    tracking: TrackingEntry[];
    activities: Activity[];
    resetTracking: () => void;
    onImport: () => void;
    getAllActivities: () => Activity[];
    getAllTrackingEntries: () => TrackingEntry[];
    saveAllActivities: (activities: Activity[]) => void;
    saveAllTrackingEntries: (trackingEntries: TrackingEntry[]) => void;
}

export class ActivitiesDetails extends React.Component<ActivitiesDetailsProps> {

    render() {
        const now = moment();
        const firstActivityStart =
            this.props.tracking.length > 0
                ? moment(this.props.tracking.sort((a, b) => a.start < b.start ? -1 : 1)[0].start)
                : now;
        const reportDuration = now.diff(firstActivityStart);

        const trackingAggregatedAndSorted = this.aggregateAndSortTracking(now.valueOf(), reportDuration);
        const colDefs = [{
            title: 'Activity name',
            dataIndex: 'activityName',
            key: 'ACTIVITY_NAME_COLUMN'
        }, {
            title: 'Duration',
            dataIndex: 'durationString',
            key: 'DURATION_COLUMN'
        }, {
            title: 'Percent',
            dataIndex: 'percentString',
            key: 'PERCENT_COLUMN'
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
                                    <Col xs={0} sm={12} style={{ height: 'calc(100vh - 150px)', paddingLeft: '2vh' }}>
                                        <Pie
                                            data={this.convertToChartJsData(trackingAggregatedAndSorted)}
                                            options={{
                                                legend: {
                                                    position: 'top',
                                                    labels: {
                                                        boxWidth: 10
                                                    }
                                                },
                                                maintainAspectRatio: false,
                                                responsive: true,
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
                                            footer={() => (
                                                <span style={{ fontWeight: 'bold' }}>
                                                    Total time: {getDurationString(reportDuration)}
                                                </span>)}
                                            rowKey={(record: ActivityDetails) =>
                                                `ACTIVITY_DETAILS_TABLE_ROW_${record.activityName}`}
                                        />
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: '2vh' }}>
                                    <Col>
                                        <Popconfirm
                                            title="Are you sure?"
                                            onConfirm={(e: React.MouseEvent<HTMLElement>) => this.props.resetTracking()}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button
                                                type="danger"
                                                size="large"
                                                style={{ width: controlsWidth }}
                                            >
                                                Reset
                                            </Button>
                                        </Popconfirm>
                                    </Col>
                                </Row>
                            </div>
                        )
                }
                <ExportImportActivities
                    controlsWidth={controlsWidth}
                    onImport={this.props.onImport}
                    getAllActivities={this.props.getAllActivities}
                    getAllTrackingEntries={this.props.getAllTrackingEntries}
                    saveAllActivities={this.props.saveAllActivities}
                    saveAllTrackingEntries={this.props.saveAllTrackingEntries}
                />
            </div>
        );
    }

    private aggregateAndSortTracking = (now: number, reportDuration: number): ActivityDetails[] => {
        if (this.props.tracking.length === 0) {
            return [];
        }

        const trackingWithColors =
            this
                .props
                .tracking
                .map(entry => {
                    const duration = moment(entry.end || now).diff(moment(entry.start));
                    const activity = this.props.activities.find(a => a.name === entry.activityName)!;
                    return {
                        activityName: entry.activityName,
                        colorHex: activity.colorHex,
                        duration: duration
                    };
                });

        const mapForGroupping = new Map<string, { activityName: string, colorHex: string, duration: number }>();
        trackingWithColors.forEach(activity => {
            if (mapForGroupping.has(activity.activityName)) {
                const activityAlreadyInMap = mapForGroupping.get(activity.activityName)!;
                activityAlreadyInMap.duration += activity.duration;
                mapForGroupping.set(activity.activityName, activityAlreadyInMap);
            } else {
                mapForGroupping.set(activity.activityName, activity);
            }
        });

        const activitiesGroupped: ActivityDetails[] = [];
        mapForGroupping.forEach(activity => activitiesGroupped.push({
            activityName: activity.activityName,
            colorHex: activity.colorHex,
            percent: activity.duration / reportDuration,
            percentString: `${Math.round(activity.duration / reportDuration * 100)}%`,
            durationString: getDurationString(activity.duration)
        }));
        return activitiesGroupped.sort(this.compareActivities);
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
