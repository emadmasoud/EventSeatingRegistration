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

    fetchAllEvents() {
        try {
            return axios.get(BASE_URL + "adminEvents").then(response => {
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
        console.log(eventId)
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
                   return t_list;
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

    getClasses(){
        return axios.get(BASE_URL + "getClasses").then(response=>{          
                return response;          
        })
    }

    getPaidTablesInfo(userID, eventID)
    {
        return axios.post(BASE_URL + "getPaidTablesInfo", {userID, eventID}).then(response=>{
            return response.data.data;
        })
    }

    paymentConfirmed(userID, eventID, noOfTables)
    {
        let data = {userID, eventID, noOfTables}
        return axios.post(BASE_URL + "paymentConfirmed", data).then(response=>{
            return response.data.data;
        })
    }

    createEvent(event)
    {
        let data = event
        return axios.post(BASE_URL + "createEvent", data).then(response=>{
            console.log(response,"create event")
            return response.data;
        })
    }
    stopRegistration(eventID)
    {
        return axios.post(BASE_URL + "stopRegistration", {eventID}).then(response=>{
            return response.data;
        })
    }

    fetchUsers()
    {
        try {
            return axios.get(BASE_URL + "users").then(response => {
                if (response.data.success) {
                   return response.data.data
                }
            }).catch(err => {
                return []
            })
        }
        catch (err) {
            return []
        }
    }
    fetchPaidUsers(eventId)
    {
        try {
            return axios.get(BASE_URL + `paidusers/${eventId}`).then(response => {
                if (response.data.success) {
                   return response.data.data
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
