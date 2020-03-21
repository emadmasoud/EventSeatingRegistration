import axios from 'axios';
import { BASE_URL } from '../Config'

export class DataService {
    static _instance;


    constructor() {
        //...
    }
    static get Instance() {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }

    fetchEvents() {
        try {
            return axios.get(BASE_URL + "events").then(response => {
                if (response.data.success) {
                    let list = response.data.data.map(ev => {
                        ev['tables_list'] = []
                        return ev;
                    });
                    return list;
                }
            }).catch(err => {
                return []
            })
        }
        catch (err) {
            return []
        }

    }


    fetchTables(eventId) {
        const params = {
            eventID: eventId
        };
        try {
            return axios.get(BASE_URL + "getTables", { params }).then(response => {
                if (response.data.success) {
                    let t_list = response.data.data.map(ele => {
                        ele['isReserved'] = ele['isReserved'] == 0 ? false : true;
                        return ele;
                    })
                   return t_list
                }
            })
        }
        catch (err) {
            return []
        }

    }

    reserveTables(data){
        try {
            return axios.post(BASE_URL + "reserveTables", data).then(response => {
                if (response.data.success) {
                    console.log("SUCCCCESSS")
                   return []
                }
            }).catch(err => {
                return []
            })
        }
        catch (err) {
            return []
        }

    }

}

export default DataService;
