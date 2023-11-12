import axios from 'axios';
require('dotenv').config();
const URL_API = process.env.URL_API;
//const URL_API = 'http://fetch.336699bet.com/';

const doRequest = async (url, params) => {
    var _params = '?';
    if (params !== null) {
        var count = 0;
        var paramsLength = Object.keys(params).length;
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                _params += key + '=' + params[key];
                if (count++ < paramsLength - 1) {
                    _params += '&';
                }
            }
        }
        //console.log(URL_API + url + _params);
        let result = await axios.get(URL_API + url + _params);
        if (!!result.data) {
            return result.data;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

export const doRequestPOST = async (url, params) => {
    var _params = '?';
    if (params !== null) {
        var count = 0;
        var paramsLength = Object.keys(params).length;
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                _params += key + '=' + params[key];
                if (count++ < paramsLength - 1) {
                    _params += '&';
                }
            }
        }
        //console.log(URL_API + url + _params);
        let result = await axios.post(URL_API + url + _params);
        if (!!result.data) {
            return result.data;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

export default doRequest;
