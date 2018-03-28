import * as React from 'react';
import { Row } from 'antd';

import { Activity } from '../model/activity';
import { TrackingEntry } from '../model/trackingEntry';
import { ExportActivities } from './ExportActivities';
import { ImportActivities } from './ImportActivities';

interface ExportImportActivitiesProps {
    controlsWidth: string;
    onImport: () => void;
    getAllActivities: () => Activity[];
    getAllTrackingEntries: () => TrackingEntry[];
    saveAllActivities: (activites: Activity[]) => void;
    saveAllTrackingEntries: (trackingEntries: TrackingEntry[]) => void;
}

export const ExportImportActivities = (props: ExportImportActivitiesProps) => {
    return (
        <Row style={{ width: props.controlsWidth, marginLeft: 'auto', marginRight: 'auto' }}>
            <ExportActivities
                getAllActivities={props.getAllActivities}
                getAllTrackingEntries={props.getAllTrackingEntries}
            />
            <ImportActivities
                onImport={props.onImport}
                saveAllActivities={props.saveAllActivities}
                saveAllTrackingEntries={props.saveAllTrackingEntries}
            />
        </Row>
    );
};
