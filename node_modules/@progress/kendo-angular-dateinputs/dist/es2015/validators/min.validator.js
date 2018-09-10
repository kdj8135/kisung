/**
 * @hidden
 */
export const minValidator = (minValue) => {
    return (control) => {
        const err = {
            minError: {
                minValue: minValue,
                value: control.value
            }
        };
        if (!minValue || !control.value) {
            return null;
        }
        return control.value < minValue ? err : null;
    };
};
