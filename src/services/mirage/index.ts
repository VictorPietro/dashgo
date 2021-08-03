import { ActiveModelSerializer, createServer, Factory, Model, Response } from 'miragejs';
import faker from 'faker';

type User = {
    name: string;
    email: string;
    created_at: string;
}

export function makeServer() {
    const server = createServer({
        serializers: {
            // esse é o padrão mais usado de envio e recebimento de API
            application: ActiveModelSerializer
        },

        models: {
            // partial nidica que não contém necessariamente todos os campos do type User
            user: Model.extend<Partial<User>>({})
        },

        // gerar dados em massa
        factories: {
            user: Factory.extend({
                name(i: number) {
                    return `User ${i + 1}`
                },
                email() {
                    return faker.internet.email().toLowerCase();
                },
                createdAt() {
                    return faker.date.recent(10)    // criado nos últimos 10 dias
                },
            }),
        },

        seeds(server) {
            // passa o nome do factory e quantos registros quer criar
            server.createList('user', 200)
        },

        routes() {
            // usa o namespace api para as rotas abaixo
            this.namespace = 'api';
            this.timing = 750;  // toda chamada demoa 750ms para acontecer (delay). Para testar loadings, spinners e afins

            this.get('/users', function (schema, request) {
                const { page = 1, per_page = 10 } = request.queryParams;

                const total = schema.all('user').length

                const pageStart = (Number(page) - 1) * Number(per_page);
                const pageEnd = pageStart + Number(per_page)

                const users = this.serialize(schema.all('user'))
                    .users
                    .slice(pageStart, pageEnd)

                return new Response(
                    200,
                    { 'x-total-count': String(total) },
                    { users }
                )
            });

            this.get('/users/:id');
            this.post('/users');

            // e reseta logo em seguida (para não prejudicar as rotas de api do Next)
            this.namespace = '';
            this.passthrough();  // as chamadas enviadas para api passarão primeiro pelo mirage e, se não forem detectadas, passarão adiante para a rota original na aplicação
        }
    });
}