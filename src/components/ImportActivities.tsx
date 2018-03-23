import * as React from 'react';
import { Col, Button, Modal, notification, Input } from 'antd';

import ActivityRepository from '../dataAccess/activityRepository';
import TrackingRepository from '../dataAccess/trackingRepository';
import { deserialize } from '../helpers/serializer';

interface ImportActivitiesProps {
    controlsWidth: string;
    onImport: () => Promise<void>;
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

    saveData = async () => {
        try {
            const deserialized = deserialize(this.state.importInputValue);
            if (deserialized.activities.length > 0 && deserialized.tracking.length > 0) {
                await ActivityRepository.saveAllAsync(deserialized.activities);
                await TrackingRepository.saveAllAsync(deserialized.tracking);
                notification.success({
                    message: 'Successfully imported data',
                    description: 'Data has been successfully imported.'
                });
                await this.props.onImport();
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
                <Button
                    style={{ width: this.props.controlsWidth, marginLeft: 0, marginRight: '15%' }}
                    onClick={() => this.openModal()}
                >
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
