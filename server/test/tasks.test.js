const app = require("../app");
const request = require('supertest');
const { Task } = require("../dataBase/models/task");
const sequelize = require("../dataBase/db");


describe("Routes Test", () => {

    const newTask = {
        title: "Prueba por defecto",
        description: "Descripcion por defecto"
    }

    beforeAll( async() => {
       
        await sequelize.sync({ force: true });

         Task.create(newTask);

    });



    //1) tests ruta cuando muestra todos los tasks
    describe('GET /tasks/allTask', () => {

        test('should respond with a 200 status code', async() => {
            const response = await request(app).get('/tasks/allTask').send();
            expect(response.statusCode).toBe(200);
        })


        test('should respond with an array', async() => {
            const response = await request(app).get('/tasks/allTask').send();
            expect(response.body).toBeInstanceOf(Array);
        })
    });



    //2) tests ruta cuando muestra un solo task
    describe('GET /showOneTask/:id', () => {

        describe("given a id", () => {

            const id = 1;

            test('should respond with a 200 status code', async() => {
                const response = await request(app).get(`/tasks/showOneTask/${id}`).send();
                expect(response.statusCode).toBe(200);
            })


            test('should respond with an object', async() => {
                const response = await request(app).get(`/tasks/showOneTask/${id}`).send();
                expect(response.body).toBeInstanceOf(Object);
            })
        })



        describe("not id", () => {

            test('should respond with a 404 status code', async() => {
                const response = await request(app).get(`/tasks/showOneTask/`).send();
                expect(response.statusCode).toBe(404);
            })
        })



        describe("id not exists", () => {

            const id = "number"; //simula que es un id que no existe en la BBDD

            test('should respond with a 400 status code', async() => {
                const response = await request(app).get(`/tasks/showOneTask/${id}`).send();
                expect(response.statusCode).toBe(400);
            })
        })

        
    });




    //3) tests ruta para crear un task
    describe('POST /tasks/createTask', () => {


        // Tenemos titulo y descripcion en el body
        describe("given a title and description", () => {

            const newTask = {
                title: "Test Creado",
                description: "Test Description"
            };
    
    
            test('should respond with a 200 status code', async() => {
                const response = await request(app).post('/tasks/createTask').send(newTask);
                expect(response.statusCode).toBe(200);
            });
    
    
            test('should respond with an array', async() => {
                const response = await request(app).post('/tasks/createTask').send(newTask);
                expect(response.body).toBeInstanceOf(Object);
            });


            // should respond with a json object containing the new task with an id
            test('should response with an task ID', async() => {
                const response = await request(app).post('/tasks/createTask').send(newTask);
                expect(response.body.id).toBeDefined();
            });
        })



        describe("when title and description is missing", () => {
        
            test('should response with 400 status code', async() => {
                const fields = [
                    {},
                    {title: "Test Task"},
                    {description: "Test Description"}
                ]
    
                for (const field of fields){
                    const response = await request(app).post('/tasks/createTask').send({field});
                    expect(response.statusCode).toBe(400);
                }
            });
        
        });
    });



    //4) tests ruta para actualizar un task
    describe('GET /tasks/upDateTask/:id', () => {


        describe("given a id", () => {

            const id = 1;

            const upDateTask = {
                title:  "Actualizado",
                description: "Vía test"
            }

        test('should respond with a 200 status code', async() => {
            const response = await request(app).put(`/tasks/upDateTask/${id}`).send(upDateTask);
            expect(response.statusCode).toBe(200);
        })


        test('should respond with an object', async() => {
            const response = await request(app).put(`/tasks/upDateTask/${id}`).send(upDateTask);
            expect(response.body).toBeInstanceOf(Object);
        })
        })



        describe("not id", () => {

            test('should respond with a 404 status code', async() => {
                const response = await request(app).put(`/tasks/upDateTask/`).send();
                expect(response.statusCode).toBe(404);
            })
        })



        describe("id not exists", () => {

            const id = "number"; //simula que es un id que no existe en la BBDD

            test('should respond with a 400 status code', async() => {
                const response = await request(app).put(`/tasks/upDateTask/${id}`).send();
                expect(response.statusCode).toBe(400);
            })
        })        
    });



    //5) tests ruta para actualizar la propiedad status
    describe('GET /tasks/madeTask/:id', () => {

        
        describe("given a id", () => {

            const id = 1;


        test('should respond with a 200 status code', async() => {
            const response = await request(app).put(`/tasks/madeTask/${id}`).send();
            expect(response.statusCode).toBe(200);
        })


        test('should respond with an object', async() => {
            const response = await request(app).put(`/tasks/madeTask/${id}`).send();
            expect(response.body).toBeInstanceOf(Object);
        })
        })



        describe("not id", () => {

            test('should respond with a 404 status code', async() => {
                const response = await request(app).put(`/tasks/madeTask/`).send();
                expect(response.statusCode).toBe(404);
            })
        })



        describe("id not exists", () => {

            const id = "number"; //simula que es un id que no existe en la BBDD

            test('should respond with a 400 status code', async() => {
                const response = await request(app).put(`/tasks/madeTask/${id}`).send();
                expect(response.statusCode).toBe(400);
            })
        })     

    });



    //6) tests ruta para borrar un task
    describe('GET /deleteTask/:id', () => {

        describe("given a id", () => {

            const id = 1;
            const id2 = 2;

            test('should respond with a 200 status code', async() => {
                const response = await request(app).delete(`/tasks/deleteTask/${id}`).send();
                expect(response.statusCode).toBe(200);
            })


            test('should respond with an json', async() => {
                const response = await request(app).delete(`/tasks/deleteTask/${id2}`).send();
                expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
            })
        })



        describe("not id", () => {

            test('should respond with a 404 status code', async() => {
                const response = await request(app).delete(`/tasks/deleteTask/`).send();
                expect(response.statusCode).toBe(404);
            })
        })



        describe("id not exists", () => {

            const id = "number"; //simula que es un id que no existe en la BBDD

            test('should respond with a 400 status code', async() => {
                const response = await request(app).delete(`/tasks/deleteTask/${id}`).send();
                expect(response.statusCode).toBe(400);
            })
        })

        
    });





})
    






