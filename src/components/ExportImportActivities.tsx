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
        <Row style={{ width: props.controlsWidth, marginLeft: 'auto', marginRight: 'auto' }}>
            <ExportActivities />
            <ImportActivities onImport={props.onImport} />
        </Row>
    );
};
