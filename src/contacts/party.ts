import { BooleanFieldSet } from "../fields";

export function createRespondentToggle(defaultOn: boolean) {
    const group = new BooleanFieldSet("Role in Proceedings", "radio", [
        ["false", "Applicant"],
        ["true", "Respondent"]
    ], "respondent");
    group.value = String(defaultOn);
    return group;
}