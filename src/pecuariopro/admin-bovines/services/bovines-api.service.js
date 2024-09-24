import http from "../../../shared/services/http-common.js";
export class BovinesApiService{

    getAll(){
        return http.get('/bovines');
    }

    getById(id){
        return http.get(`/bovines/${id}`);
    }

    create(bovine){
        return http.post('/bovines',bovine);
    }


    update(id, bovine){
        return http.put(`/bovines/${id}`,bovine);
    }


    delete(id){
        return http.delete(`/bovines/${id}`);
    }

    findByName(name){
        return http.get(`/bovines?name=${name}`);
    }

    aggregateImage(id,imgUrl){
        return http.post(`/bovines/${id}/add-images`,imgUrl);
    }

    getAllBovinesByUserId(userId){
        return http.get(`/bovines/users/${userId}`);
    }


    getBovinesGroupedByBatchId() {
        return this.getAll().then(response => {
            const bovines = response.data;

            const groupedByBatchId = {};
            bovines.forEach(bovine => {
                const batchId = bovine.batchId;
                if (!groupedByBatchId[batchId]) {
                    groupedByBatchId[batchId] = [];
                }
                groupedByBatchId[batchId].push(bovine);
            });

            return Object.entries(groupedByBatchId).map(([batchId, bovines]) => ({
                batchId: parseInt(batchId),
                count: bovines.length,
                bovines: bovines
            }));
        });
    }


    async getTotalBovines() {
        try {
            const response = await this.getAll();
            return response.data.length;
        } catch (error) {
            console.error('Error fetching total vaccines:', error);
            throw error;
        }
    }


    getStatsByWeight() {
        return this.getAll().then(response => {
            const bovines = response.data;
            const stats = {
                minWeight: Number.POSITIVE_INFINITY,
                maxWeight: Number.NEGATIVE_INFINITY,
                totalWeight: 0,
                averageWeight: 0
            };

            bovines.forEach(bovine => {
                const weight = bovine.weight;
                stats.totalWeight += weight;

                if (weight < stats.minWeight) {
                    stats.minWeight = weight;
                }

                if (weight > stats.maxWeight) {
                    stats.maxWeight = weight;
                }
            });

            if (bovines.length > 0) {
                stats.averageWeight = stats.totalWeight / bovines.length;
            }

            return stats;
        });
    }

    getBovinesCountByBatch() {
        return this.getAll().then(response => {
            const bovines = response.data;
            const groupedByBatchId = {};

            bovines.forEach(bovine => {
                const batchId = bovine.batchId;
                if (!groupedByBatchId[batchId]) {
                    groupedByBatchId[batchId] = 0;
                }
                groupedByBatchId[batchId]++;
            });

            return Object.entries(groupedByBatchId).map(([batchId, count]) => ({
                batchId: parseInt(batchId),
                count: count
            }));
        });
    }

}