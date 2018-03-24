import * as React from 'react';
import { Row } from 'antd';
import { ExportActivities } from './ExportActivities';
import { ImportActivities } from './ImportActivities';

interface ExportImportActivitiesProps {
    controlsWidth: string;
    onImport: () => void;
}

export const ExportImportActivities = (props: ExportImportActivitiesProps) => {
    return (
        <Row>
            <ExportActivities controlsWidth={props.controlsWidth} />
            <ImportActivities controlsWidth={props.controlsWidth} onImport={props.onImport} />
        </Row>
    );
};
