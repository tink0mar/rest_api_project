import axios, { AxiosError }from 'axios';
import jasmine from 'jasmine';
import app from '../src/app'

let token: string;

let config: Object

describe("Integration tests", () => {
    beforeAll(() => {
        require('../src/app')
    })

    let collections: {name: string, id: number}[] = [];

    describe("Creating new user and login", () => {


        let bodyParams = {
            "username": "test",
            "password": "test"
        }
    
        it("POST users/register - create new user", async () => {
    
            const response = await axios.post('http://localhost:3000/hnnews/users/register/', bodyParams)    
            
            expect(response.status).toBe(201)
            expect(response.data).toEqual({
                userId: 1,
                username: 'test'
            })
    
        })
    
        it("POST users/register - on existing user", async() => {
    
            try {
                const response = await axios.post('http://localhost:3000/hnnews/users/register/', bodyParams)    
            } catch (e) {
                if (e instanceof AxiosError){
                    expect(e.response?.status).toBe(422)
                }
            }
    
        })
    
        it("POST users/login - on existing user", async() => {
    
            const response = await axios.post('http://localhost:3000/hnnews/users/login/', bodyParams)    
            
            expect(response.status).toBe(200)
            expect(response.data.username).toEqual("test")
            expect(response.data.token).toBeDefined()
        
            token = response.data.token
            config = {
                headers: { Authorization: `Bearer ${token}` }
            };
        })
    
        it('POST users/login - on non existing user', async() => {
    
            const badBodyParams = {
                username: "test_1",
                password: "test"
            }
    
            try {
                const response = await axios.post('http://localhost:3000/hnnews/users/login/', bodyParams)
            } catch (e) {
                if (e instanceof AxiosError){
                    expect(e.response?.status).toBe(401)
                }
            }
    
        })
    
        it('POST users/login - bad password', async() => {
    
            const badBodyParams = {
                username: 'test',
                password: "bad password"
            }
    
            try {
                const response = await axios.post('http://localhost:3000/hnnews/users/login/', badBodyParams)
            } catch (e) {
                if (e instanceof AxiosError){
                    expect(e.response?.status).toBe(401)
                }
            }
    
        })
    
    })
    
    
    describe("CRUD operations for collection", async () => {
    
        it('Request without authentification', async () => {
            
            try {
                const response = await axios.get('http://localhost:3000/hnnews/collections/')
            } catch (e) {
                if (e instanceof AxiosError){
                    expect(e.response?.status).toBe(401)
                }
            }
            
        })
    
        let bodyParams = {
            name: "test"
        }

        
    
        it('POST /collections - create collection', async () => {
            
            const response = await axios.post('http://localhost:3000/hnnews/collections/', bodyParams, config)
            
            expect(response.status).toBe(201)
            expect(response.data.collectionName).toEqual("test")
            expect(response.data.collectionId).toBeDefined()
            collections.push({
                name: response.data.collectionName,
                id: response.data.collectionId
            })
    
        })
        
        it('GET /collections - list all of collections', async() => {
            let ids = [];
            for(let i = 0;i < collections.length;i++)
                ids.push(collections[i].id);


            const response = await axios.get("http://localhost:3000/hnnews/collections/", config)
            
            expect(response.status).toBe(200)
            expect(response.data.data.collections).toBeDefined
            expect(response.data.data.collections).toEqual(ids)
    
        })

        

        it('POST /collections - create exisiting collection', async () =>{

            try {
                const response = await axios.post('http://localhost:3000/hnnews/collections/', bodyParams, config)
            } catch(e) {
                if (e instanceof AxiosError){
                    expect(e.response?.status).toBe(422)
                }
            }
    
        })
    
    
        it('PUT /collections/:id - change whole collection', async () => {
            
            const putBodyParam = {
                name: "test4"
            }
    
            const response = await axios.put('http://localhost:3000/hnnews/collections/' + collections[0].id.toString(), putBodyParam, config)
    
            expect(response.status).toBe(200)
            expect(response.data.collectionName).toEqual("test4")
            expect(response.data.collectionId).toBeDefined()
            collections[0].name = response.data.collectionName      
    
        })
    
        it('PUT /collections/:id - create new collection', async () => {
            
            const newBodyParam = {
                name: "new"
            }
    
            const response = await axios.put("http://localhost:3000/hnnews/collections/" + "2", newBodyParam, config)
            
            expect(response.status).toBe(201)
            expect(response.data.collectionName).toEqual("new")
            collections.push({
                name: response.data.collectionName,
                id: response.data.collectionId
            })
    
        })
    
    
        it('GET /collections/:id - display existing collection', async() => {
    
            const response = await axios.get("http://localhost:3000/hnnews/collections/" + collections[0].id, config)
    
            expect(response.status).toBe(200)
            expect(response.data).toEqual({
                "userId": 1,
                "collectionId": collections[0].id,
                "collectionName": collections[0].name,
                "type": "collection",
                "data" : {
                    stories: []
            }
            })
    
        })
    
        it('GET /collections - display non existing collection', async() => {
            
            try {
                const response = await axios.get("http://localhost:3000/hnnews/collections/" + 10, config)
            
            } catch(e) {
                if (e instanceof AxiosError){
                    expect(e.response?.status).toBe(404)
                }
            }

        })

        it('DELETE /collections/:id - delete existing resource', async() => {
            
            const response = await axios.delete("http://localhost:3000/hnnews/collections/" + collections[1].id.toString(), config)
    
            expect(response.status).toBe(204)
    
        })
        
        it('DELETE /collections/:id - delete non existing resource', async() => {
            
            try {
                const response = await axios.delete("http://localhost:3000/hnnews/collections/" + 10, config)
            
            } catch(e) {
                if (e instanceof AxiosError){
                    expect(e.response?.status).toBe(404)
                }
            }

        })


    })
    

    describe("Add stories to collection", async () => {

        let comment = {
            ids: [31942182]
        }
        
        let stories = {
            ids: [31943531]
        } 

        it('POST /collections/:id - non exisitng story ', async() => {

            try {
                const response = await axios.post("http://localhost:3000/hnnews/collections/"+ collections[0].id.toString(), comment, config)
            } catch (e) {
                if (e instanceof AxiosError){
                    expect(e.response?.status).toBe(400)
                }
            }

        })

        it('POST /collections/:id - add existing stories', async() => {

            const response = await axios.post("http://localhost:3000/hnnews/collections/"+ collections[0].id.toString(), stories, config)

            expect(response.status).toBe(201)
            expect(response.data).toEqual({
                "userId": 1,
                "collectionId": collections[0].id,
                "collectionName": collections[0].name,
                "type": "collection",
                "data" : {
                    stories: [31943531]
                }
            })

        })

        it('POST /collections/:id - add existing stories once aagain', async() => {

            try {
                const response = await axios.post("http://localhost:3000/hnnews/collections/"+ collections[0].id.toString(), stories, config)
            } catch (e) {
                if (e instanceof AxiosError){
                    expect(e.response?.status).toBe(409)
                }
            }

        })

    })

    describe("Display items", async () => {

        let item = 31943531
        let nonExistingItem = 31942182

        it('GET /items/:id - display non existing item in your collection', async () => {

            try{
                const response = await axios.get("http://localhost:3000/hnnews/items/"+ nonExistingItem.toString(), config)
            } catch (e){
                if (e instanceof AxiosError){
                    expect(e.response?.status).toBe(404)
                }

            }

        })

        it('GET /items/:id - display existing item from collection', async () => {

            const response = await axios.get("http://localhost:3000/hnnews/items/"+ item.toString(), config)

            expect(response.status).toBe(200)
            
            expect(response.data.kids).toBeDefined()
            
        })

    })
})


