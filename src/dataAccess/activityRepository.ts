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

        const existingActivity = activities.find(a => a.name === activityName);
        if (existingActivity) {
            return existingActivity;
        }

        const newActivity = {
            id: GuidV4(),
            name: activityName
        };
        activities.push(newActivity);
        localStorage.setItem(ActivityRepository.activitiesKey, JSON.stringify(activities));

        return newActivity;
    }
}

export default new ActivityRepository();