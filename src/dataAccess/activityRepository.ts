import { Activity } from '../model/activity';
import { v4 as GuidV4 } from 'uuid';

class ActivityRepository {

    private static activitiesKey: string = 'ACTIVITIES';

    getAllAsync = async (): Promise<Activity[]> => {
        const activitiesJson = localStorage.getItem(ActivityRepository.activitiesKey);
        if (activitiesJson) {
            const parsedObject = JSON.parse(activitiesJson as string);
            return parsedObject instanceof Array ? parsedObject : [];
        }

        return [];
    }

    addAsync = async (activityName: string): Promise<Activity> => {

        const activities = await this.getAllAsync();

        const existingActivity = activities.find(a => a.name.toLowerCase() === activityName.toLowerCase());
        if (existingActivity) {
            return existingActivity;
        }

        const newActivity = {
            id: GuidV4(),
            name: activityName,
            colorHex: this.getRandomColor()
        };
        activities.push(newActivity);
        localStorage.setItem(ActivityRepository.activitiesKey, JSON.stringify(activities));

        return newActivity;
    }

    clearAllAsync = async (): Promise<void> => {
        localStorage.removeItem(ActivityRepository.activitiesKey);
    }

    saveAllAsync = async (activities: Activity[]): Promise<void> => {
        await this.clearAllAsync();
        localStorage.setItem(ActivityRepository.activitiesKey, JSON.stringify(activities));
    }

    private getRandomColor = (): string => {
        let color = '#';
        for (let index = 0; index < 6; index++) {
            color += Math.floor(Math.random() * 16).toString(16);
        }
        return color;
    }
}

export default new ActivityRepository();