import { Origin } from "./origin.entity.js";

export class Bovine {
    constructor(id,bovineIdentifier, name, breedId, weight, date, departmentId,cityId,districtId, observations, batchId,userId, imgUrls) {
        this.id = id;
        this.bovineIdentifier = bovineIdentifier;
        this.name = name;
        this.breedId = breedId;
        this.weight = weight;
        this.date = date;
        this.departmentId = departmentId;
        this.cityId = cityId;
        this.districtId = districtId;
        this.observations = observations;
        this.batchId = batchId;
        this.userId = userId;
        this.imgUrls = imgUrls;
    }

    static fromDisplayableBovine(displayableBovine,breedId,departmentId,cityId,districtId) {
        return new Bovine(
            displayableBovine.id,
            displayableBovine.bovineIdentifier,
            displayableBovine.name,
            breedId,
            displayableBovine.weight,
            displayableBovine.date,
            departmentId,
            cityId,
            districtId,
            displayableBovine.observations,
            displayableBovine.batchId,
            displayableBovine.userId,
            displayableBovine.imgUrls
        );
    }

    static toDisplayableBovine(bovine,origin,breed) {
        return {
            id: bovine.id,
            bovineIdentifier: bovine.bovineIdentifier,
            name: bovine.name,
            breed: breed,
            weight: bovine.weight,
            date: bovine.date,
            origin: origin,
            observations: bovine.observations,
            batchId: bovine.batchId,
            userId: bovine.userId,
            imgUrls: bovine.imgUrls
        };
    }
}
