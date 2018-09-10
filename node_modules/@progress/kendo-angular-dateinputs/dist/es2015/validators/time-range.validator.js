import { isInTimeRange } from '../util';
/**
 * @hidden
 */
export const timeRangeValidator = (min, max) => {
    return (control) => {
        if (!min || !max || !control.value) {
            return null;
        }
        const err = {
            timeRangeError: {
                maxValue: max,
                minValue: min,
                value: control.value
            }
        };
        return isInTimeRange(control.value, min, max) ? null : err;
    };
};
