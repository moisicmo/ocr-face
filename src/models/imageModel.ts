/* FORM PROPERTIE MODEL */
export interface FormImageModel {
    photo: string | null;
}

/*FORM PROPERTIE MODEL VALIDATIONS */
export interface FormImageValidations {
    photo: [(value: string) => boolean, string];
}