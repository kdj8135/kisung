/**
 * @hidden
 */
export const maxValidator = (maxValue) => {
    return (control) => {
        const err = {
            maxError: {
                maxValue: maxValue,
                value: control.value
            }
        };
        if (!maxValue || !control.value) {
            return null;
        }
        return control.value > maxValue ? err : null;
    };
};
