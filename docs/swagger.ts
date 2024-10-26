export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Golden Raspberry Awards API",
    version: "1.0.0",
    description:
      "API para gerenciar filmes, produtores e estúdios do prêmio da categoria, 'Pior Filme' do Golden Raspberry Awards.",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  paths: {
    "/producers": {
      post: {
        summary: "Adicionar um novo produtor",
        tags: ["Producers"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Produtor criado com sucesso",
          },
          "400": {
            description: "Requisição inválida",
          },
        },
      },
      get: {
        summary: "Listar todos os produtores",
        tags: ["Producers"],
        responses: {
          "200": {
            description: "Lista de produtores",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id_producer: {
                        type: "integer",
                      },
                      name: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/producers/awards-gaps": {
      get: {
        summary: "Listar intervalos de prêmios dos produtores",
        tags: ["Producers"],
        responses: {
          "200": {
            description: "Intervalos de prêmios dos produtores",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    min: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          producer: {
                            type: "string",
                          },
                          interval: {
                            type: "integer",
                          },
                          previousWin: {
                            type: "integer",
                          },
                          followingWin: {
                            type: "integer",
                          },
                        },
                      },
                    },
                    max: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          producer: {
                            type: "string",
                          },
                          interval: {
                            type: "integer",
                          },
                          previousWin: {
                            type: "integer",
                          },
                          followingWin: {
                            type: "integer",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/producers/{id}": {
      get: {
        summary: "Obter um produtor pelo ID",
        tags: ["Producers"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do produtor",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Produtor encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id_producer: {
                      type: "integer",
                    },
                    name: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Produtor não encontrado",
          },
        },
      },
      put: {
        summary: "Atualizar um produtor pelo ID",
        tags: ["Producers"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do produtor",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id_producer: {
                    type: "number",
                  },
                  name: {
                    type: "string",
                  },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Produtor atualizado com sucesso",
          },
          "400": {
            description: "Requisição inválida",
          },
          "404": {
            description: "Produtor não encontrado",
          },
        },
      },
    },
    "/studios": {
      post: {
        summary: "Adicionar um novo estúdio",
        tags: ["Studios"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Estúdio criado com sucesso",
          },
          "400": {
            description: "Requisição inválida",
          },
        },
      },
      get: {
        summary: "Listar todos os estúdios",
        tags: ["Studios"],
        responses: {
          "200": {
            description: "Lista de estúdios",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id_studio: {
                        type: "integer",
                      },
                      name: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/studios/{id}": {
      get: {
        summary: "Obter um estúdio pelo ID",
        tags: ["Studios"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do estúdio",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Estúdio encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id_studio: {
                      type: "integer",
                    },
                    name: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Estúdio não encontrado",
          },
        },
      },
      put: {
        summary: "Atualizar um estúdio pelo ID",
        tags: ["Studios"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do estúdio",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id_studio: {
                    type: "number",
                  },
                  name: {
                    type: "string",
                  },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Estúdio atualizado com sucesso",
          },
          "400": {
            description: "Requisição inválida",
          },
          "404": {
            description: "Estúdio não encontrado",
          },
        },
      },
    },
    "/movies": {
      post: {
        summary: "Adicionar um novo filme",
        tags: ["Movies"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                  },
                  year: {
                    type: "integer",
                  },
                  winner: {
                    type: "boolean",
                  },
                  studios: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id_studio: {
                          type: "number",
                        },
                      },
                    },
                  },
                  producers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id_producer: {
                          type: "number",
                        },
                      },
                    },
                  },
                },
                required: ["title", "year", "winner"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Filme criado com sucesso",
          },
          "400": {
            description: "Requisição inválida",
          },
        },
      },
      get: {
        summary: "Listar todos os filmes",
        tags: ["Movies"],
        responses: {
          "200": {
            description: "Lista de filmes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id_movie: {
                        type: "integer",
                      },
                      title: {
                        type: "string",
                      },
                      year: {
                        type: "integer",
                      },
                      winner: {
                        type: "boolean",
                      },
                      studios: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id_studio: {
                              type: "number",
                            },
                            name: {
                              type: "string",
                            },
                          },
                        },
                      },
                      producers: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id_producer: {
                              type: "number",
                            },
                            name: {
                              type: "string",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/movies/winners": {
      get: {
        summary: "Listar todos os filmes vencedores",
        tags: ["Movies"],
        responses: {
          "200": {
            description: "Lista de filmes vencedores",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id_movie: {
                        type: "integer",
                      },
                      title: {
                        type: "string",
                      },
                      year: {
                        type: "integer",
                      },
                      winner: {
                        type: "boolean",
                      },
                      studios: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id_studio: {
                              type: "number",
                            },
                            name: {
                              type: "string",
                            },
                          },
                        },
                      },
                      producers: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id_producer: {
                              type: "number",
                            },
                            name: {
                              type: "string",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/movies/{id}": {
      get: {
        summary: "Obter um filme pelo ID",
        tags: ["Movies"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do filme",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Filme encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id_movie: {
                      type: "integer",
                    },
                    title: {
                      type: "string",
                    },
                    year: {
                      type: "integer",
                    },
                    winner: {
                      type: "boolean",
                    },
                    studios: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id_studio: {
                            type: "number",
                          },
                          name: {
                            type: "string",
                          },
                        },
                      },
                    },
                    producers: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id_producer: {
                            type: "number",
                          },
                          name: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Filme não encontrado",
          },
        },
      },
      put: {
        summary: "Atualizar um filme pelo ID",
        tags: ["Movies"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do filme",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id_movie: {
                    type: "number",
                  },
                  title: {
                    type: "string",
                  },
                  year: {
                    type: "integer",
                  },
                  winner: {
                    type: "boolean",
                  },
                  studios: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id_studio: {
                          type: "number",
                        },
                        name: {
                          type: "string",
                        },
                      },
                    },
                  },
                  producers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id_producer: {
                          type: "number",
                        },
                        name: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
                required: ["title", "year", "winner"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Filme atualizado com sucesso",
          },
          "400": {
            description: "Requisição inválida",
          },
          "404": {
            description: "Filme não encontrado",
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Producers",
      description: "Operações relacionadas aos produtores",
    },
    {
      name: "Studios",
      description: "Operações relacionadas aos estúdios",
    },
    {
      name: "Movies",
      description: "Operações relacionadas aos filmes",
    },
  ],
};
