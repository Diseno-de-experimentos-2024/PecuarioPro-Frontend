import http from "../../../shared/services/http-common.js";

export class VaccinesApiService {

    getAll() {
        return http.get('/vaccines');
    }

    getById(id) {
        return http.get(`/vaccines/${id}`);
    }

    getAllByBovineId(bovineId){
        return http.get(`/vaccines/bovines/${bovineId}`);
    }

    getAllByUserId(userId){
        return http.get(`/vaccines/users/${userId}`);
    }

    create(vaccineResource, authToken) {
        return http.post('/vaccines', vaccineResource, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
    }

    /*update(id, vaccineResource, authToken) {
        return http.put(`/vaccines/${id}`, vaccineResource, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
    }*/

    update(id, vaccineResource) {
        return http.put(`/vaccines/${id}`,vaccineResource);
    }

    delete(id) {
        return http.delete(`/vaccines/${id}`);
    }

























    getVaccinesGroupedByYear() {
        return this.getAll().then(response => {
            // Suponiendo que 'response.data' es un array de objetos vacunas como el ejemplo proporcionado
            const vaccines = response.data;

            const groupedByYear = {};
            vaccines.forEach(vaccine => {
                const year = new Date(vaccine.date).getFullYear(); // Convertimos la cadena de fecha a un objeto Date y obtenemos el año
                if (!groupedByYear[year]) {
                    groupedByYear[year] = [];
                }
                groupedByYear[year].push(vaccine);
            });

            return Object.entries(groupedByYear).map(([year, vaccines]) => ({
                year: parseInt(year),
                count: vaccines.length
            }));
        });
    }
    getVaccinesGroupedByMonth() {
        return this.getAll().then(response => {
            const vaccines = response.data;

            const groupedByMonth = {};
            vaccines.forEach(vaccine => {
                const month = new Date(vaccine.date).getMonth(); // Convertimos la cadena de fecha a un objeto Date y obtenemos el mes
                if (!groupedByMonth[month]) {
                    groupedByMonth[month] = [];
                }
                groupedByMonth[month].push(vaccine);
            });

            return Object.entries(groupedByMonth).map(([month, vaccines]) => ({
                month: parseInt(month),
                count: vaccines.length
            }));
        });
    }

     async getTotalVaccines() {
         try {
             const response = await this.getAll();
             return response.data.length;
         } catch (error) {
             console.error('Error fetching total vaccines:', error);
             throw error;
         }
     }
}
