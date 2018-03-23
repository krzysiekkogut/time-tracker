import * as React from 'react';
import { Col, Button, Modal, Card } from 'antd';

import ActivityRepository from '../dataAccess/activityRepository';
import TrackingRepository from '../dataAccess/trackingRepository';
import { serialize } from '../helpers/serializer';

interface ExportActivitiesProps {
    controlsWidth: string;
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

    async componentDidMount() {
        const activities = await ActivityRepository.getAllAsync();
        const tracking = await TrackingRepository.getAllAsync();
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

    closeModal = () => {
        this.setState({
            modalOpen: false
        });
    }

    render() {
        return (
            <Col xs={12}>
                <Button
                    style={{ width: this.props.controlsWidth, marginLeft: '15%', marginRight: 0 }}
                    onClick={() => this.openModal()}
                >
                    Export activities
                </Button>
                <Modal
                    title="Export tracking data"
                    visible={this.state.modalOpen}
                    footer={(
                        <div>
                            <Button onClick={() => this.closeModal()}>
                                Close
                            </Button>
                        </div>)}
                    closable={false}
                >
                    <p>
                        Copy following value and use it in a 'Import activities' in another browser to copy your data.
                    </p>
                    <Card style={{ overflowY: 'auto', maxHeight: '50vh'}}>
                        <p style={{ overflowWrap: 'break-word' }}>
                            {this.state.exportOutputValue}
                        </p>
                    </Card>
                </Modal>
            </Col>
        );
    }
}
