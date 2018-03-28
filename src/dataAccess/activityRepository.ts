import { Activity } from '../model/activity';

// tslint:disable-next-line:interface-name
export interface IActivityRepository {
    getAll: () => Activity[];
    add: (activityName: string) => Activity;
    clearAll: () => void;
    saveAll: (activities: Activity[]) => void;
}

export class ActivityRepository implements IActivityRepository {

    private static activitiesKey: string = 'ACTIVITIES';

    getAll = (): Activity[] => {
        const activitiesJson = localStorage.getItem(ActivityRepository.activitiesKey);
        if (activitiesJson) {
            const parsedObject = JSON.parse(activitiesJson as string);
            return parsedObject instanceof Array ? parsedObject : [];
        }

        return [];
    }

    add = (activityName: string): Activity => {
        const activities = this.getAll();

        const existingActivity = activities.find(a => a.name.toLowerCase() === activityName.toLowerCase());
        if (existingActivity) {
            return existingActivity;
        }

        const newActivity = {
            name: activityName,
            colorHex: this.getRandomColor()
        };
        activities.push(newActivity);
        localStorage.setItem(ActivityRepository.activitiesKey, JSON.stringify(activities));

        return newActivity;
    }

    clearAll = (): void => {
        localStorage.removeItem(ActivityRepository.activitiesKey);
    }

    saveAll = (activities: Activity[]): void => {
        this.clearAll();
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
