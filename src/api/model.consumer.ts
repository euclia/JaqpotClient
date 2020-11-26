import axios, { AxiosAdapter, AxiosInstance } from 'axios';
import { Model, Models, Dataset } from '../models/jaqpot.models';
import { BaseConsumer } from './base.consumer';

export interface IModelConsumer{
    getPromiseWithPathId(id:string, token:string):Promise< Model >;
    getMyModels(authToken:string, min:Number, max:Number):Promise<Models>
    getOrgsModels(organization:string, min:Number, max:Number, authToken:string):Promise<Models>
    predict(modelId:string, datasetId:string, authToken:string):Promise<Dataset>
}

export class ModelConsumer extends BaseConsumer<Model> implements IModelConsumer{

    private _client : AxiosInstance
    private _jaqpotPath:string;
    private _modelsPath:string = '/model/';
    private _datasetPath:string = '/dataset/';


    constructor(_httpClient:AxiosInstance, _jaqpotBase:string){
            super(_httpClient, "model/", _jaqpotBase)
            this._client = _httpClient
            this._jaqpotPath = _jaqpotBase
    }

    public getMyModels(authToken:string, min:Number, max:Number):Promise<Models>{

        let params = new URLSearchParams();
        params.set("min", min.toString());
        params.set("max", max.toString());

        let config = {
            params,
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer '  + authToken
            }
        }

        return this._client.get(this._jaqpotPath + this._modelsPath, config).then(response => {
            
            let retJson: Models= {}
            retJson.total = Number(response.headers["total"]);
            retJson.models = response.data

            var promise = new Promise(function(resolve, reject) {
                resolve(retJson);
              });
            
              return promise;
          })

        }

        public getOrgsModels(organization:string, min:Number, max:Number, authToken:string):Promise<Models>{

            let params = new URLSearchParams();
            params.set("organization", organization);
            params.set("min", min.toString());
            params.set("max", max.toString());
    
            let config = {
                params,
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '  + authToken
                }
            }
    
            return this._client.get(this._jaqpotPath + this._modelsPath, config).then(response => {
                
                let retJson: Models= {}
                retJson.total = Number(response.headers["total"]);
                retJson.models = response.data
    
                var promise = new Promise(function(resolve, reject) {
                    resolve(retJson);
                });
                
                return promise;
            })
    
        }

        public predict(modelId:string, datasetId:string, authToken:string):Promise<Dataset>{
            
            let dataset_uri:string = this._jaqpotPath + this._datasetPath + datasetId

            let data = {
                "dataset_uri": dataset_uri,
                "visible": true
            }

            let config = {
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer '  + authToken
                }
            }

            return this._client.post(this._jaqpotPath + this._modelsPath + modelId, data, config)

        }

} 
