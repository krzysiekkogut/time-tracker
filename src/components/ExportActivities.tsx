import * as React from 'react';
import { Col, Button, Modal, notification } from 'antd';
import * as CopyToClipboard from 'react-copy-to-clipboard';

import ActivityRepository from '../dataAccess/activityRepository';
import TrackingRepository from '../dataAccess/trackingRepository';
import { serialize } from '../helpers/serializer';

interface ExportActivitiesState {
    exportOutputValue: string;
    modalOpen: boolean;
}

export class ExportActivities extends React.Component<{}, ExportActivitiesState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            exportOutputValue: '',
            modalOpen: false
        };
    }

    componentDidMount() {
        const activities = ActivityRepository.getAll();
        const tracking = TrackingRepository.getAll();
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
