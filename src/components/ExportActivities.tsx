import * as React from 'react';
import { Col, Button, Modal, notification } from 'antd';
import * as CopyToClipboard from 'react-copy-to-clipboard';

import { serialize } from '../helpers/serializer';
import { Activity } from '../model/activity';
import { TrackingEntry } from '../model/trackingEntry';

interface ExportActivitiesProps {
    getAllActivities: () => Activity[];
    getAllTrackingEntries: () => TrackingEntry[];
}

interface ExportActivitiesState {
    exportOutputValue: string;
    modalOpen: boolean;
}

export class ExportActivities extends React.Component<ExportActivitiesProps, ExportActivitiesState> {

    constructor(props: ExportActivitiesProps) {
        super(props);

        this.state = {
            exportOutputValue: '',
            modalOpen: false
        };
    }

    componentDidMount() {
        const activities = this.props.getAllActivities();
        const tracking = this.props.getAllTrackingEntries();
        this.setState({
            exportOutputValue: serialize({
                activities: activities,
                tracking: tracking
            })
        });
    }

    openModal = () => {
        this.setState({
            modalOpen: true
        });
    }

    closeModalAndShowNotification = () => {
        notification.success({
            message: 'Export code has been copied.',
            description: 'Paste in Import activities window in target browser.'
        });
        this.closeModal();
    }

    closeModal = () => {
        this.setState({
            modalOpen: false
        });
    }

    render() {
        return (
            <Col xs={12}>
                <Button onClick={() => this.openModal()} style={{ width: '100%'}}>
                    Export activities
                </Button>
                <Modal
                    title="Export tracking data"
                    visible={this.state.modalOpen}
                    footer={(
                        <div>
                            <Button onClick={() => this.closeModal()}>Close</Button>
                            <CopyToClipboard
                                text={this.state.exportOutputValue}
                                onCopy={() => this.closeModalAndShowNotification()}
                            >
                                <Button type="primary">Export</Button>
                            </CopyToClipboard>
                        </div>)}
                    closable={false}
                >
                    <p>
                        After click on <strong>Copy</strong> button export code will be copied to your clipboard.<br />
                        Paste in Import activities window in target browser.
                    </p>
                </Modal>
            </Col>
        );
    }
}
