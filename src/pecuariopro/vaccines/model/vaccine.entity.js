
export class Vaccine {
    constructor(id, name, reason, date, code,dose,userId,bovineId) {
        this.id = id;
        this.name = name;
        this.reason = reason;
        this.date = date;
        this.code = code;
        this.dose = dose;
        this.userId= userId;
        this.bovineId= bovineId;
    }
    static fromDisplayableVaccine(displayableVaccine) {
        return new Vaccine (
            displayableVaccine.id,
            displayableVaccine.name,
            displayableVaccine.reason,
            displayableVaccine.date,
            displayableVaccine.code,
            displayableVaccine.dose,
            displayableVaccine.userId,
            displayableVaccine.bovineId,
        );
    }

    static toDisplayableVaccine(vaccine) {
        return {
            id: vaccine.id,
            name: vaccine.name,
            reason: vaccine.reason,
            date: vaccine.date,
            code: vaccine.code,
            dose: vaccine.dose,
            userId : vaccine.userId,
            bovineId : vaccine.bovineId,
        };
    }

}
