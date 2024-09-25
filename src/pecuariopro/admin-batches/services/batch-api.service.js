import http from "../../../shared/services/http-common.js";
export class BatchApiService{

    getAll(campaignId){
        return http.get(`/campaigns/${campaignId}/batches`);
    }

    getById(campaignId,id){
        return http.get(`/campaigns/${campaignId}/batches/${id}`);
    }

    create(batch){
        return http.post(`campaigns/add-batch`,batch);
    }


    update(id,campaignId, batch){
        return http.put(`campaigns/${campaignId}/batches/${id}`,batch);
    }


    delete(campaignId,id){
        return http.delete(`/campaigns/${campaignId}/batches`,id);
    }

    findByName(name){
        return http.get(`/batches?name=${name}`);
    }

    async getTotalBatches() {
        try {
            const response = await this.getAll();
            return response.data.length;
        } catch (error) {
            console.error('Error fetching total vaccines:', error);
            throw error;
        }
    }

}