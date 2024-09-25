import http from "../../../shared/services/http-common.js";

export class InventoryApiService{

    getAll(type, userId) {
        return http.get('/inventory/'+ userId + '/' + type);
    }
    getById(id){
        return http.get(`/inventory/${id}`);
    }
    create(inventoryResource){
        return http.post('/inventory',inventoryResource);
    }

    update(id, inventory){
        return http.put(`/inventory/${id}`,inventory);
    }


    delete(id){
        return http.delete(`/inventory/${id}`);
    }
}

