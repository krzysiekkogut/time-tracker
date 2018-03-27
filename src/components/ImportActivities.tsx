import * as React from 'react';
import { Col, Button, Modal, notification, Input } from 'antd';

import ActivityRepository from '../dataAccess/activityRepository';
import TrackingRepository from '../dataAccess/trackingRepository';
import { deserialize } from '../helpers/serializer';

interface ImportActivitiesProps {
    onImport: () => void;
}

interface ImportActivitiesState {
    importInputValue: string;
    modalOpen: boolean;
}

export class ImportActivities extends React.Component<ImportActivitiesProps, ImportActivitiesState> {

    constructor(props: ImportActivitiesProps) {
        super(props);

        this.state = {
            importInputValue: '',
            modalOpen: false
        };
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

    changeInputValue = (newValue: string) => {
        this.setState({
            importInputValue: newValue.trim()
        });
    }

    saveData = () => {
        try {
            const deserialized = deserialize(this.state.importInputValue);
            if (deserialized.activities.length > 0 && deserialized.tracking.length > 0) {
                ActivityRepository.saveAll(deserialized.activities);
                TrackingRepository.saveAll(deserialized.tracking);
                notification.success({
                    message: 'Successfully imported data',
                    description: 'Data has been successfully imported.'
                });
                this.props.onImport();
                this.closeModal();
            }
        } catch {
            notification.error({
                message: 'Could not import data',
                description:
                    `Data could not have been imported.
                    Please use correct value:
                    it needs to be generated using 'Export activities' feature`
            });
        }
    }

    render() {
        return (
            <Col xs={12}>
                <Button onClick={() => this.openModal()} style={{ width: '100%' }}>
                    Import activities
                </Button>
                <Modal
                    title="Import tracking data"
                    visible={this.state.modalOpen}
                    footer={(
                        <div>
                            <Button onClick={() => this.closeModal()}>
                                Close
                            </Button>
                            <Button
                                type="primary"
                                disabled={this.state.importInputValue.length === 0}
                                onClick={() => this.saveData()}
                            >
                                Import
                            </Button>
                        </div>)}
                    closable={false}
                >
                    <p>
                        Paste generated value here and to import tracking data from another browser.
                    </p>
                    <p>
                        <strong>It will overwrite all tracking data in the current browser!</strong>
                    </p>
                    <Input.TextArea
                        rows={10}
                        value={this.state.importInputValue}
                        onChange={
                            (event: React.ChangeEvent<HTMLTextAreaElement>) =>
                                this.changeInputValue(event.currentTarget.value)}
                    />
                </Modal>
            </Col>
        );
    }
}
